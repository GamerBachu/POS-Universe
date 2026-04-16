import type {
    ICustomerInsight,
    IFinancialOverview,
    IHourlyHeatmapItem,
    IInventoryValuation,
    IPaymentMixItem,
    IReport,
    ISalesOverviewReport,
    ISalesSummaryData,
    ITopSellingProduct,
    IWeeklySalesData,
    IVoidReport,
    IZReportData,
    IRecentTransaction,
} from "@/types/reports";
import type { ICustomer } from "@/types/customer";
import type { IProduct } from "@/types/product";
import { getName } from "@/utils";
import db from "../libs/db/appDb";
import type { ServiceResponse } from "@/types/serviceResponse";
import {
    TOrderStatus,
    TPaymentCategory,
    TPaymentMethod,
} from "@/types/terminal1";

export class reportApi {
    private static createResponse<T>(
        data: T,
        message: string,
        success: boolean = true,
    ): ServiceResponse<T> {
        return { status: success ? 200 : 500, success, message, data };
    }

    static async add(
        payload: Partial<IReport>,
    ): Promise<ServiceResponse<number>> {
        try {
            if (payload.id !== undefined && payload.id !== null && payload.id <= 0) {
                delete payload.id;
            }
            const id = await db.reports.add({
                name: payload.name ?? "",
                description: payload.description ?? "",
                version: payload.version ?? "",
                url: payload.url ?? "",
            });
            return this.createResponse(id as number, "Report added successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to add";
            return this.createResponse(0, msg, false);
        }
    }

    static async getReports(userId: number): Promise<ServiceResponse<IReport[]>> {
        try {
            const reports = await db.reports.toArray();
            return this.createResponse(
                reports,
                "Reports retrieved successfully. for user" + userId,
            );
        } catch (error: unknown) {
            const msg =
                error instanceof Error ? error.message : "Failed to retrieve reports";
            return this.createResponse([], msg, false);
        }
    }

    /**
     * Z-Report: Daily financial reconciliation
     * Sums up today's net sales and actual cash collected.
     */
    static async getZReport(
        selectedDate: string,
    ): Promise<ServiceResponse<IZReportData>> {
        try {
            if (!selectedDate) {
                throw new Error("Invalid date provided");
            }
            const f_date = selectedDate.split("T")[0];

            if (!f_date) {
                throw new Error("Invalid date provided");
            }

            // Fetch all orders for today with status in [COMPLETED, VOIDED, REFUNDED, PARTIALLY_REFUNDED]

            const orders = await db.orders
                .where("createdAt")
                .between(f_date, f_date + "\uffff", true, true)
                .and((order) =>
                    (
                        [
                            TOrderStatus.COMPLETED,
                            TOrderStatus.VOIDED,
                            TOrderStatus.REFUNDED,
                            TOrderStatus.PARTIALLY_REFUNDED,
                        ] as string[]
                    ).includes(order.status),
                )
                .toArray();

            // Calculate sales metrics using the standardized Order Status
            const completedOrders = orders.filter(
                (o) => o.status === TOrderStatus.COMPLETED,
            );

            const sales = {
                gross: completedOrders.reduce((acc, o) => acc + (o.subtotal || 0), 0),
                discounts: completedOrders.reduce(
                    (acc, o) => acc + (o.totalDiscount || 0),
                    0,
                ),
                tax: completedOrders.reduce((acc, o) => acc + (o.totalTax || 0), 0),
                net: completedOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0),
            };

            // Fetch payments for these orders
            const orderIds = completedOrders
                .map((o) => o.id)
                .filter((id): id is number => id !== undefined);
            const payments = await db.orderPayments
                .where("orderId")
                .anyOf(orderIds)
                .toArray();

            const cardMethods: TPaymentMethod[] = [
                TPaymentMethod.CREDIT_CARD,
                TPaymentMethod.DEBIT_CARD,
            ];

            const paymentTotals = payments.reduce(
                (acc, p) => {
                    const amount = p.amount || 0;
                    if (p.category === TPaymentCategory.CASH) {
                        acc.cash += amount;
                    } else if (cardMethods.includes(p.method as TPaymentMethod)) {
                        acc.card += amount;
                    } else if (p.category === TPaymentCategory.ELECTRONIC) {
                        acc.digital += amount;
                    }
                    return acc;
                },
                { cash: 0, card: 0, digital: 0 },
            );

            const data: IZReportData = {
                sales,
                payments: paymentTotals,
                counters: {
                    totalOrders: orders.length,
                    completedOrders: orders.filter(
                        (o) => o.status === TOrderStatus.COMPLETED,
                    ).length,
                    voidedOrders: orders.filter((o) => o.status === TOrderStatus.VOIDED)
                        .length,
                    refundCount:
                        orders.filter((o) => o.status === TOrderStatus.REFUNDED).length +
                        orders.filter((o) => o.status === TOrderStatus.PARTIALLY_REFUNDED)
                            .length,
                },
            };

            return this.createResponse(data, "Z-Report generated successfully.");
        } catch (error) {
            return this.createResponse(
                {} as IZReportData,
                error instanceof Error ? error.message : "Failed to load report",
                false,
            );
        }
    }

    /**
     * Inventory Valuation: Total Asset Value
     * Calculates total stock value (Stock * Cost Price).
     */
    static async getInventoryValuation(): Promise<
        ServiceResponse<IInventoryValuation>
    > {
        // Rule 3: Always order by primary ID in reverse for reports.
        // Using .filter with !! coercion to fix "no data" issues caused by boolean/number index mismatches.
        const products = await db.products
            .orderBy("id")
            .reverse()
            .filter((p) => !!p.isActive)
            .toArray();

        const totalAssetValue = products.reduce(
            (acc, p) => acc + p.stock * (p.costPrice || 0),
            0,
        );
        const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

        return this.createResponse(
            { totalAssetValue, totalStock, products } as IInventoryValuation,
            "Inventory valuation completed.",
        );
    }

    /**
     * Void/Cancellation Report: Audit trail for cancelled orders
     */
    static async getVoidReportData(
        startDate: string,
        endDate: string,
    ): Promise<ServiceResponse<IVoidReport[]>> {
        try {
            if (!startDate || !endDate) {
                throw new Error("Invalid date provided");
            }
            const f_startDate = startDate.split("T")[0];
            const f_endDate = endDate.split("T")[0];

            if (!f_startDate || !f_endDate) {
                throw new Error("Invalid date provided");
            }

            const cancellations = await db.orderCancellations
                .where("createdAt")
                .between(f_startDate, f_endDate + "\uffff", true, true)
                .reverse()
                .toArray();

            // Join logic: Fetch unique user profiles for the names
            const userIds = Array.from(
                new Set(cancellations.map((c) => c.cancelledBy)),
            );
            const users = await db.users.where("id").anyOf(userIds).toArray();
            const userMap = new Map(
                users.map((u) => [
                    u.id,
                    getName(u.nameFirst, u.nameMiddle, u.nameLast),
                ]),
            );

            const data: IVoidReport[] = cancellations.map((c) => ({
                ...c,
                username: userMap.get(c.cancelledBy) || `ID: ${c.cancelledBy}`,
            }));

            return this.createResponse(data, "Void report generated successfully.");
        } catch (error) {
            const msg =
                error instanceof Error ? error.message : "Failed to load void report";
            return this.createResponse([], msg, false);
        }
    }

    /**
     * Inventory Management: Current stock levels and reorder alerts
     */
    static async getInventoryManagementData(): Promise<
        ServiceResponse<IProduct[]>
    > {
        try {
            const products = await db.products // Show inactive products OR active products with low stock
                .filter(
                    (p) =>
                        !p.isActive || (p.isActive && p.stock <= (p.reorderLevel || 0)),
                )
                .reverse()
                .toArray();
            return this.createResponse(
                products,
                "Inventory data retrieved successfully.",
            );
        } catch (error) {
            return this.createResponse(
                [],
                error instanceof Error ? error.message : "Failed to load inventory",
                false,
            );
        }
    }

    /**
     * Sales Summary: High-level overview of daily performance
     */
    static async getSalesSummary(
        selectedDate: string,
    ): Promise<ServiceResponse<ISalesSummaryData>> {
        try {
            const f_date = selectedDate.split("T")[0];
            const prev_date_obj = new Date(f_date);
            prev_date_obj.setDate(prev_date_obj.getDate() - 1);
            const f_prev_date = prev_date_obj.toISOString().split("T")[0];

            // 1. Fetch Today's Completed Orders
            const todayOrders = await db.orders
                .where("createdAt")
                .between(f_date, f_date + "\uffff", true, true)
                .filter((o) => o.status === TOrderStatus.COMPLETED)
                .toArray();

            // 2. Fetch Yesterday's Revenue for Growth Calculation
            const yesterdayOrders = await db.orders
                .where("createdAt")
                .between(f_prev_date, f_prev_date + "\uffff", true, true)
                .filter((o) => o.status === TOrderStatus.COMPLETED)
                .toArray();

            const todayRevenue = todayOrders.reduce(
                (sum, o) => sum + (o.grandTotal || 0),
                0,
            );
            const yesterdayRevenue = yesterdayOrders.reduce(
                (sum, o) => sum + (o.grandTotal || 0),
                0,
            );

            // 3. Calculate Metrics
            const totalSales = todayOrders.length;
            const averageOrderValue = totalSales > 0 ? todayRevenue / totalSales : 0;

            let growth = 0;
            if (yesterdayRevenue > 0) {
                growth = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
            } else if (todayRevenue > 0) {
                growth = 100; // 100% growth if there were no sales yesterday
            }

            // 4. Hourly Trend Breakdown
            const hourlyMap: Record<string, number> = {};
            todayOrders.forEach((order) => {
                const hour = new Date(order.createdAt).getHours();
                const label = `${hour.toString().padStart(2, "0")}:00`;
                hourlyMap[label] = (hourlyMap[label] || 0) + (order.grandTotal || 0);
            });

            // Sort hours and format for UI
            const salesTrend = Object.keys(hourlyMap)
                .sort()
                .map((label) => ({
                    label,
                    value: hourlyMap[label],
                }));

            const data: ISalesSummaryData = {
                totalSales,
                totalRevenue: todayRevenue,
                averageOrderValue,
                growth: Number(growth.toFixed(2)),
                salesTrend,
            };

            return this.createResponse(data, "Sales summary generated successfully.");
        } catch (error) {
            return this.createResponse(
                {} as ISalesSummaryData,
                error instanceof Error ? error.message : "Failed to load sales summary",
                false,
            );
        }
    }

    /**
     * Customer Insights: Aggregates order data to find top customers and loyalty trends
     */
    static async getCustomerInsights(): Promise<
        ServiceResponse<ICustomerInsight[]>
    > {
        try {
            // 1. Get all completed orders that have a customer assigned
            const orders = await db.orders
                .filter((o) => o.status === TOrderStatus.COMPLETED && !!o.customerId)
                .toArray();

            // 2. Resolve Customer Identities (Group by Phone to handle cases where IDs might differ)
            const uniqueIds = Array.from(new Set(orders.map((o) => o.customerId!)));
            const customersList = await db.customers
                .where("id")
                .anyOf(uniqueIds)
                .toArray();

            const idToPhoneKey = new Map<number, string>();
            const phoneToProfileMap = new Map<string, ICustomer>();

            customersList.forEach((c) => {
                const phoneKey = c.phone?.trim() || `ID_${c.id}`; // Fallback to ID if phone is missing
                idToPhoneKey.set(c.id!, phoneKey);
                if (!phoneToProfileMap.has(phoneKey)) {
                    phoneToProfileMap.set(phoneKey, c);
                }
            });

            // 3. Aggregate data by resolved Phone Key
            const aggregation: Record<
                string,
                { spent: number; count: number; lastDate: string; }
            > = {};

            orders.forEach((order) => {
                const key =
                    idToPhoneKey.get(order.customerId!) || `ID_${order.customerId}`;
                if (!aggregation[key]) {
                    aggregation[key] = { spent: 0, count: 0, lastDate: order.createdAt };
                }
                aggregation[key].spent += order.grandTotal || 0;
                aggregation[key].count += 1;
                if (new Date(order.createdAt) > new Date(aggregation[key].lastDate)) {
                    aggregation[key].lastDate = order.createdAt;
                }
            });

            const data: ICustomerInsight[] = Array.from(
                phoneToProfileMap.values(),
            ).map((c) => {
                const phoneKey = c.phone?.trim() || `ID_${c.id}`;
                const agg = aggregation[phoneKey];
                const avg = agg.count > 0 ? agg.spent / agg.count : 0;

                // Simple Loyalty Calculation: (Spent * 0.4) + (Count * 10)
                const loyaltyScore = agg.spent * 0.1 + agg.count * 5;

                return {
                    customerId: c.id!,
                    name: c.name === undefined || c.name === "" ? "--" : c.name,
                    email: c.email === undefined || c.email === "" ? "--" : c.email,
                    phone: c.phone === undefined || c.phone === "" ? "--" : c.phone,
                    totalSpent: agg.spent,
                    orderCount: agg.count,
                    avgOrderValue: avg,
                    lastPurchaseDate: agg.lastDate,
                    loyaltyScore: Math.round(loyaltyScore),
                };
            });

            // Sort by Total Spent descending
            data.sort((a, b) => b.totalSpent - a.totalSpent);

            return this.createResponse(data, "Customer insights generated.");
        } catch (error) {
            const msg =
                error instanceof Error ? error.message : "Failed to load insights";
            return this.createResponse([], msg, false);
        }
    }

    /**
     * Financial Overview: Profit margins and Cash flow
     */
    static async getFinancialOverview(
        startDate: string,
        endDate: string,
    ): Promise<ServiceResponse<IFinancialOverview>> {
        try {
            const f_start = startDate.split("T")[0];
            const f_end = endDate.split("T")[0];

            // 1. Get all completed orders in range
            const orders = await db.orders
                .where("createdAt")
                .between(f_start, f_end + "\uffff", true, true)
                .filter((o) => o.status === TOrderStatus.COMPLETED)
                .toArray();

            const orderIds = orders
                .map((o) => o.id)
                .filter((id): id is number => id !== undefined);

            // 2. Get all items for these orders to calculate COGS
            const items = await db.orderItems
                .where("orderId")
                .anyOf(orderIds)
                .toArray();
            const productIds = Array.from(new Set(items.map((i) => i.productId)));
            const products = await db.products
                .where("id")
                .anyOf(productIds)
                .toArray();
            const productMap = new Map(products.map((p) => [p.id, p]));

            const totalRevenue = orders.reduce(
                (sum, o) => sum + (o.grandTotal || 0),
                0,
            );

            const totalCogs = items.reduce((sum, item) => {
                const p = productMap.get(item.productId);
                return sum + item.quantity * (p?.costPrice || 0);
            }, 0);

            const grossProfit = totalRevenue - totalCogs;
            const grossMargin =
                totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

            const data: IFinancialOverview = {
                totalRevenue,
                totalCogs,
                grossProfit,
                grossMargin: Number(grossMargin.toFixed(2)),
                totalExpenses: 0, // Placeholder: Expenses feature coming soon
                netIncome: grossProfit,
                cashInflow: totalRevenue,
                cashOutflow: totalCogs,
            };

            return this.createResponse(data, "Financial overview generated.");
        } catch (error) {
            return this.createResponse(
                {} as IFinancialOverview,
                error instanceof Error ? error.message : "Failed to load financials",
                false,
            );
        }
    }

    /**
     * Sales Overview: Weekly sales performance and trends for dashboard.
     * Fetches sales data for the last 7 days.
     */
    static async getSalesOverviewData(): Promise<
        ServiceResponse<ISalesOverviewReport>
    > {
        try {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 6); // Get data for today and the past 6 days (7 days total)

            const startDate = sevenDaysAgo.toISOString().split("T")[0];
            const endDate = today.toISOString().split("T")[0];

            const orders = await db.orders
                .where("createdAt")
                .between(startDate, endDate + "\uffff", true, true)
                .filter((o) => o.status === TOrderStatus.COMPLETED)
                .toArray();

            const dailySalesMap: Record<string, number> = {};
            const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            // Initialize daily sales for the last 7 days to 0
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dateKey = d.toISOString().split("T")[0];
                dailySalesMap[dateKey] = 0;
            }

            orders.forEach((order) => {
                const orderDate = order.createdAt.split("T")[0];
                dailySalesMap[orderDate] =
                    (dailySalesMap[orderDate] || 0) + (order.grandTotal || 0);
            });

            let totalRevenueLast7Days = 0;
            const weeklySalesTrend: IWeeklySalesData[] = [];

            // Populate weeklySalesTrend, ensuring all 7 days are present and ordered from oldest to newest
            for (let i = 6; i >= 0; i--) {
                // Iterate from 7 days ago to today
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dateKey = d.toISOString().split("T")[0];
                const dayOfWeek = d.getDay(); // 0 for Sunday, 1 for Monday, etc.
                const salesForDay = dailySalesMap[dateKey] || 0;

                totalRevenueLast7Days += salesForDay;
                weeklySalesTrend.push({
                    date: dateKey,
                    dayLabel: dayLabels[dayOfWeek],
                    totalSales: salesForDay,
                });
            }

            const data: ISalesOverviewReport = {
                totalRevenueLast7Days,
                weeklySalesTrend,
            };
            return this.createResponse(
                data,
                "Sales overview generated successfully.",
            );
        } catch (error) {
            return this.createResponse(
                {} as ISalesOverviewReport,
                error instanceof Error
                    ? error.message
                    : "Failed to load sales overview",
                false,
            );
        }
    }

    /**
     * Aggregates top selling products based on completed orders
     */
    static async getTopSellingData(
        limit: number = 5,
    ): Promise<ServiceResponse<ITopSellingProduct[]>> {
        try {
            const items = await db.orderItems.toArray();
            const aggregation: Record<number, { count: number; revenue: number; }> =
                {};

            items.forEach((item) => {
                if (!aggregation[item.productId])
                    aggregation[item.productId] = { count: 0, revenue: 0 };
                aggregation[item.productId].count += item.quantity;
                aggregation[item.productId].revenue += item.quantity * item.unitPrice;
            });

            const productIds = Object.keys(aggregation).map(Number);
            const products = await db.products
                .where("id")
                .anyOf(productIds)
                .toArray();

            const result: ITopSellingProduct[] = products
                .map((p) => ({
                    productId: p.id!,
                    name: p.name,
                    soldCount: aggregation[p.id!].count,
                    totalRevenue: aggregation[p.id!].revenue,
                }))
                .sort((a, b) => b.soldCount - a.soldCount)
                .slice(0, limit);

            return this.createResponse(result, "Top selling products retrieved.");
        } catch (error) {
            return this.createResponse(
                [],
                error instanceof Error ? error.message : "Error loading top selling",
                false,
            );
        }
    }

    /**
     * Fetches current payment method distribution
     */
    static async getPaymentMixData(): Promise<
        ServiceResponse<IPaymentMixItem[]>
    > {
        try {
            const map: Record<string, { amount: number; color: string; }> = {
                Cash: { amount: 0, color: "bg-teal-500" },
                Card: { amount: 0, color: "bg-blue-500" },
                UPI: { amount: 0, color: "bg-purple-500" },
            };

            const today = new Date().toISOString().split("T")[0];

            // 1. Get completed orders for today (createdAt is indexed on orders)
            const orders = await db.orders
                .where("createdAt")
                .between(today, today + "\uffff", true, true)
                .filter((o) => o.status === TOrderStatus.COMPLETED)
                .toArray();

            const orderIds = orders
                .map((o) => o.id)
                .filter((id): id is number => id !== undefined);
            if (orderIds.length === 0) {
                const result: IPaymentMixItem[] = Object.entries(map).map(
                    ([label, data]) => ({
                        label,
                        amount: data.amount,
                        color: data.color,
                        val: 0,
                    }),
                );
                return this.createResponse(result, "Payment mix generated.");
            }

            // 2. Fetch payments linked to those orders
            const payments = await db.orderPayments
                .where("orderId")
                .anyOf(orderIds)
                .toArray();

            const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

            payments.forEach((p) => {
                if (p.category === TPaymentCategory.CASH)
                    map["Cash"].amount += p.amount;
                else if (p.category === TPaymentCategory.ELECTRONIC)
                    map["UPI"].amount += p.amount;
                else map["Card"].amount += p.amount;
            });

            const result: IPaymentMixItem[] = Object.entries(map).map(
                ([label, data]) => ({
                    label,
                    amount: data.amount,
                    color: data.color,
                    val: total > 0 ? Math.round((data.amount / total) * 100) : 0,
                }),
            );

            return this.createResponse(result, "Payment mix generated.");
        } catch (error) {
            return this.createResponse(
                [],
                error instanceof Error ? error.message : "Error loading payment mix",
                false,
            );
        }
    }

    /**
     * Generates an hourly heatmap for the current day
     */
    static async getHourlyHeatmapData(): Promise<
        ServiceResponse<IHourlyHeatmapItem[]>
    > {
        try {
            const today = new Date().toISOString().split("T")[0];

            const orders = await db.orders
                .where("createdAt")
                .between(today, today + "\uffff")
                .toArray();

            const hours = Array.from({ length: 24 }, (_, i) => ({
                hour: i,
                count: 0,
                revenue: 0,
                intensity: 0,
            }));

            orders.forEach((o) => {
                const hour = new Date(o.createdAt).getHours();
                hours[hour].count += 1;
                hours[hour].revenue += o.grandTotal || 0;
            });

            const maxCount = Math.max(...hours.map((h) => h.count), 1);
            hours.forEach((h) => (h.intensity = h.count / maxCount));

            return this.createResponse(hours, "Hourly heatmap generated.");
        } catch (error) {
            return this.createResponse(
                [],
                error instanceof Error ? error.message : "Error loading heatmap",
                false,
            );
        }
    }

    /**
     * Fetches top products with stock below reorder level
     */
    static async getInventoryAlertsData(): Promise<ServiceResponse<IProduct[]>> {
        try {
            const products = await db.products // Filter for active products with stock below reorder level
                .filter((p) => !!p.isActive && p.stock <= (p.reorderLevel || 0))
                .limit(10)
                .reverse()
                .toArray();
            return this.createResponse(products, "Inventory alerts retrieved.");
        } catch (error) {
            return this.createResponse(
                [],
                error instanceof Error ? error.message : "Error loading alerts",
                false,
            );
        }
    }

    static async getRecentTransactions(
        limit: number = 5,
    ): Promise<ServiceResponse<IRecentTransaction[]>> {
        try {
            const orders = await db.orders
                .orderBy("createdAt")
                .reverse()
                .filter(
                    (o) =>
                        o.status === TOrderStatus.COMPLETED ||
                        o.status === TOrderStatus.VOIDED,
                )
                .limit(limit)
                .toArray();

            const data: IRecentTransaction[] = orders.map((o) => ({
                id: o.id!,
                orderNumber: o.orderNumber,
                createdAt: o.createdAt,
                grandTotal: o.grandTotal || 0,
                status: o.status,
            }));

            return this.createResponse(data, "Recent transactions retrieved.");
        } catch (error) {
            return this.createResponse(
                [],
                error instanceof Error ? error.message : "Error loading transactions",
                false,
            );
        }
    }
}
