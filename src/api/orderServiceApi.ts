import db from "@/libs/db/appDb";
import {
    type IOrder,
    type IOrderView
} from "@/types/orders";
import type { IProduct } from "@/types/product";
import { generateSecureRandomStr } from "@/utils/helper/guid";

export type ServiceResponse<T = null> = {
    success: boolean;
    status: number;
    message: string;
    data?: T;
    errorCode?: string;
};

export class orderServiceApi {
    /**
     * Standardized response helper
     */
    private static createResponse<T>(
        success: boolean,
        message: string,
        data?: T,
        status: number = 200
    ): ServiceResponse<T> {
        return { success, message, data, status };
    }

    private static getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : "Operation failed";
    }

    /**
     * Executes a full atomic transaction to save an order and update inventory.
     */
    static async addFullOrder(payload: IOrderView): Promise<ServiceResponse<IOrder | null>> {
        try {
            const { order, items, adjustments, discounts, payments } = payload;

            // 1. Prepare Order Header
            order.orderNumber = await this.generateUniqueOrderNumber();

            // Cleanup: remove IDs and prepare payloads in one pass where possible
            delete order.id;
            items.forEach(item => delete item.id);
            adjustments.forEach(adj => delete adj.id);
            discounts.forEach(disc => delete disc.id);
            payments.forEach(pay => delete pay.id);
            //

            const result = await db.transaction(
                'rw',
                [
                    db.orders,
                    db.orderItems,
                    db.orderAdjustments,
                    db.orderDiscounts,
                    db.orderPayments,
                    db.products
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
                                stock: product.stock - item.quantity
                            });
                        }
                    });

                    // 3. Map Adjustments (Taxes/Charges)
                    const adjOperations = adjustments.map(adj =>
                        db.orderAdjustments.add({ ...adj, orderId })
                    );

                    // 4. Map Discounts (Points/Coupons)
                    const discOperations = discounts.map(disc =>
                        db.orderDiscounts.add({ ...disc, orderId })
                    );

                    // 5. Map Payments
                    const payOperations = payments.map(pay =>
                        db.orderPayments.add({ ...pay, orderId })
                    );

                    // Execute all sub-operations
                    await Promise.all([
                        ...itemOperations,
                        ...adjOperations,
                        ...discOperations,
                        ...payOperations
                    ]);

                    return { ...order, id: orderId };
                }
            );

            return this.createResponse(true, "Order saved successfully", result, 201);
        }
        catch (error: unknown) {
            return this.createResponse(false, this.getErrorMessage(error), null, 500);
        }
    }

    /**
     * Retrieves a full order with all related details.
     */
    static async getFullOrderDetails(orderId: number): Promise<ServiceResponse<IOrderView | null>> {
        try {
            const order = await db.orders.get(orderId);
            if (!order) return this.createResponse(false, "Order not found", null, 404);

            const [items, adjustments, discounts, payments] = await Promise.all([
                db.orderItems.where('orderId').equals(orderId).toArray(),
                db.orderAdjustments.where('orderId').equals(orderId).toArray(),
                db.orderDiscounts.where('orderId').equals(orderId).toArray(),
                db.orderPayments.where('orderId').equals(orderId).toArray(),
            ]);

            const fullData: IOrderView = { order, items, adjustments, discounts, payments };
            return this.createResponse(true, "Order details retrieved", fullData);
        }
        catch (error: unknown) {
            return this.createResponse(false, this.getErrorMessage(error), null, 500);
        }
    }

    /**
     * Generates a secure, unique, non-sequential order number.
     */
    static async generateUniqueOrderNumber(): Promise<string> {
        const now = new Date();
        const datePart = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}`;

        while (true) {
            const secureStr = generateSecureRandomStr(6).toUpperCase();
            const newOrderNumber = `ORD-${datePart}-${secureStr}`;

            const exists = await db.orders.where("orderNumber").equals(newOrderNumber).count();
            if (exists === 0) return newOrderNumber;
        }
    }
}