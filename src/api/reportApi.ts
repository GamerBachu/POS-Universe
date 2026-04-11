import type { IReport, IVoidReport, IZReportData } from "@/types/reports";
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
    static async getZReportData(
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

            // Fetch all orders for today
            const orders = await db.orders
                .where("createdAt")
                .startsWith(f_date)
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
                businessDate: f_date,
                cashierName: "System Summary",
                sales,
                payments: paymentTotals,
                counters: {
                    totalOrders: orders.length,
                    voidedOrders: orders.filter((o) => o.status === TOrderStatus.VOIDED)
                        .length,
                    refundCount: orders.filter((o) => o.status === TOrderStatus.REFUNDED)
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
        ServiceResponse<{ totalAssetValue: number; totalStock: number; }>
    > {
        const products = await db.products.where("isActive").equals(1).toArray();
        const totalAssetValue = products.reduce(
            (acc, p) => acc + p.stock * (p.costPrice || 0),
            0,
        );
        const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

        return this.createResponse(
            { totalAssetValue, totalStock },
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
                .between(f_startDate, f_endDate + '\uffff', true, true)
                .reverse()
                .toArray();

            // Join logic: Fetch unique user profiles for the names
            const userIds = Array.from(new Set(cancellations.map(c => c.cancelledBy)));
            const users = await db.users.where("id").anyOf(userIds).toArray();
            const userMap = new Map(users.map(u => [u.id, getName(u.nameFirst, u.nameMiddle, u.nameLast)]));

            const data: IVoidReport[] = cancellations.map(c => ({
                ...c,
                username: userMap.get(c.cancelledBy) || `ID: ${c.cancelledBy}`
            }));

            return this.createResponse(data, "Void report generated successfully.");
        } catch (error) {
            const msg =
                error instanceof Error ? error.message : "Failed to load void report";
            return this.createResponse([], msg, false);
        }
    }
}
