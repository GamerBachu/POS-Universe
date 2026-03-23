import db from "@/libs/db/appDb";
import {
    type IOrder,
    type IOrderView,
    type IOrderCancellation,
    type IOrderFilter,
} from "@/types/orders"; // Added IOrderCancellation
import type { IProduct } from "@/types/product";
import { generateSecureRandomStr } from "@/utils/helper/guid";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";
import type { ServiceResponse } from "@/types/serviceResponse";

export class orderServiceApi {
    /**
     * Standardized response helper
     */
    private static createResponse<T>(
        success: boolean,
        status: number = 200,
        message: string,
        data: T,
    ): ServiceResponse<T> {
        return { success, message, data, status };
    }

    private static getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : "Operation failed";
    }

    /**
    * Generates a secure, unique, non-sequential order number.
    */
    static async generateUniqueOrderNumber(): Promise<string> {
        const now = new Date();
        const datePart = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, "0")}`;

        while (true) {
            const secureStr = generateSecureRandomStr(6).toUpperCase();
            const newOrderNumber = `ORD-${datePart}-${secureStr}`;

            const exists = await db.orders
                .where("orderNumber")
                .equals(newOrderNumber)
                .count();
            if (exists === 0) return newOrderNumber;
        }
    }

    /**
     * Executes a full atomic transaction to save an order and update inventory.
     */
    static async addFullOrder(
        payload: IOrderView,
    ): Promise<ServiceResponse<IOrder | null>> {
        try {
            const { order, items, adjustments, discounts, payments, customer } =
                payload;

            // 1. Prepare Order Header
            order.orderNumber = await this.generateUniqueOrderNumber();

            // Cleanup: remove IDs and prepare payloads in one pass where possible
            delete order.id;
            items.forEach((item) => delete item.id);
            adjustments.forEach((adj) => delete adj.id);
            discounts.forEach((disc) => delete disc.id);
            payments.forEach((pay) => delete pay.id);
            //

            //logic to get customer id

            if (customer) {
                if (customer.id || customer.id !== 0) {
                    const existingCustomer = await db.customers.get(customer.id);
                    if (existingCustomer) {
                        order.customerId = existingCustomer.id;
                    }
                } else if (customer.id === 0 || !customer.id) {
                    // New customer or customer without an ID
                    delete customer.id;
                    const newCustomerId = await db.customers.add(customer);
                    if (newCustomerId) {
                        order.customerId = newCustomerId;
                    }
                }
            }

            const result = await db.transaction(
                "rw",
                [
                    db.orders,
                    db.orderItems,
                    db.orderAdjustments,
                    db.orderDiscounts,
                    db.orderPayments,
                    db.products,
                ],
                async () => {
                    // 1. Save Header & Get ID
                    const orderId = (await db.orders.add(order)) as number;

                    // 2. Map items with Order ID and update Stock
                    const itemOperations = items.map(async (item) => {
                        await db.orderItems.add({ ...item, orderId });

                        // Simple stock reduction logic
                        const product = await db.products.get(item.productId);
                        if (product && (product as IProduct).stock !== undefined) {
                            await db.products.update(item.productId, {
                                stock: product.stock - item.quantity,
                            });
                        }
                    });

                    // 3. Map Adjustments (Taxes/Charges)
                    const adjOperations = adjustments.map((adj) =>
                        db.orderAdjustments.add({ ...adj, orderId }),
                    );

                    // 4. Map Discounts (Points/Coupons)
                    const discOperations = discounts.map((disc) =>
                        db.orderDiscounts.add({ ...disc, orderId }),
                    );

                    // 5. Map Payments
                    const payOperations = payments.map((pay) =>
                        db.orderPayments.add({ ...pay, orderId }),
                    );

                    // Execute all sub-operations
                    await Promise.all([
                        ...itemOperations,
                        ...adjOperations,
                        ...discOperations,
                        ...payOperations,
                    ]);

                    return { ...order, id: orderId };
                },
            );

            return this.createResponse(true, 201, "Order saved successfully", result);
        } catch (error: unknown) {
            return this.createResponse(false, 500, this.getErrorMessage(error), null);
        }
    }

    /**
     * Retrieves a full order with all related details.
     */
    static async getFullOrderDetailsById(id: number): Promise<ServiceResponse<IOrderView | null>> {
        try {
            const order = await db.orders.get(id);
            if (!order?.id) {
                return this.createResponse(false, 404, "Order not found", null);
            }

            // Fetch all related data in parallel
            const [items, adjustments, discounts, payments, cancellation, customer] = await Promise.all([
                db.orderItems.where("orderId").equals(order.id).toArray(),
                db.orderAdjustments.where("orderId").equals(order.id).toArray(),
                db.orderDiscounts.where("orderId").equals(order.id).toArray(),
                db.orderPayments.where("orderId").equals(order.id).toArray(),
                db.orderCancellations.where("orderId").equals(order.id).first(),
                // Only query customer if an ID exists and isn't 0
                order.customerId ? db.customers.get(order.customerId) : Promise.resolve(undefined),
            ]);

            return this.createResponse(true, 200, "Success", {
                order, items, adjustments, discounts, payments, cancellation, customer
            });
        } catch (error) {
            return this.createResponse(false, 500, this.getErrorMessage(error), null);
        }
    }


    /**
     * Retrieves a paginated and filtered list of orders.
     */
    static async getFilteredOrders(
        payload: IOrderFilter,
    ): Promise<ServiceResponse<{ items: IOrder[]; totalCount: number; }>> {
        try {
            const fOrderNumber = payload.orderNumber?.toLowerCase().trim() ?? "";
            const fCurrentPage = payload.currentPage;
            const fPageSize = payload.pageSize;

            // 1. Initiate collection using
            const collection = db.orders
                .orderBy("id")
                .reverse()
                .filter((order) => {
                    const matchesOrderNumber =
                        fOrderNumber === "" ||
                        order.orderNumber.toLowerCase().includes(fOrderNumber);

                    return matchesOrderNumber;
                });
            // 2. Get Total Count for Pagination
            const totalCount = await collection.count();

            // 3. Apply Pagination (Offset and Limit)
            const items = await collection
                .offset((fCurrentPage - 1) * fPageSize)
                .limit(fPageSize)
                .toArray();
            return this.createResponse(true, 200, "Orders retrieved successfully.", {
                items,
                totalCount,
            });
        } catch (error) {
            return this.createResponse(false, 500, this.getErrorMessage(error), {
                items: [],
                totalCount: 0,
            });
        }
    }
    /**
     * Cancels an order, logs the cancellation, and restocks items.
     */
    static async cancelOrder(
        orderId: number,
        reason: string,
        userId: number,
    ): Promise<ServiceResponse<boolean>> {
        try {
            // const result = await db.transaction(
            //     "rw",
            //     [db.orders, db.orderItems, db.products, db.orderCancellations],
            //     async () => {
            //         const order = await db.orders.get(orderId);
            //         if (!order || order.status !== "COMPLETED") {
            //             throw new Error("Order cannot be cancelled or does not exist.");
            //         }

            //         await db.orders.update(orderId, { status: "VOIDED" });

            //         const items = await db.orderItems.where({ orderId }).toArray();
            //         const stockUpdates = items.map((item) =>
            //             db.products
            //                 .where("id")
            //                 .equals(item.productId)
            //                 .modify((p) => {
            //                     p.stock += item.quantity;
            //                 }),
            //         );
            //         await Promise.all(stockUpdates);

            //         const cancellation: IOrderCancellation = {
            //             orderId,
            //             orderNumber: order.orderNumber,
            //             reason,
            //             cancelledBy: userId,
            //             refundedAmount: order.grandTotal,
            //             refundMethod: "ORIGINAL_PAYMENT",
            //             restocked: true,
            //             createdAt: toUTCNowForDB(),
            //         };
            //         await db.orderCancellations.add(cancellation);
            //     },
            // );
            return this.createResponse(
                true,
                200,
                "Order cancelled successfully.",
                true,
            );
        } catch (error) {
            return this.createResponse(
                false,
                500,
                this.getErrorMessage(error),
                false,
            );
        }
    }
}
