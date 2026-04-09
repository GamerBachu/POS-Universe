import type { IOrder, IOrderAdjustment, IOrderDiscount, IOrderItem, IOrderPayment, IOrderView } from "@/types/orders";
import type { IProductFilter } from "@/types/product";
import { TOrderStatus, type ITerminalState } from "@/types/terminal1";
import { calculateFinalPrice } from "@/utils/financial";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";
import { roundNumber } from "@/utils/helper/numberUtils";



/** 
 *  newOrderState
 * 
 * 
 * **/

export const newOrderState: ITerminalState = {
    alert: undefined,
    cart: [],
    customer: null,
    paymentCategory: null,
    adjustment: [],
    paymentMethod: null,
    isPaid: false,

};








export const calculateRowAmount = (order: IOrder, adj: IOrderAdjustment | IOrderDiscount) => {

    if (adj.valueType === "PERCENT") {
        return (order.subtotal * adj.value) / 100;
    }
    return adj.value;
};






//NUMPAD_KEYS -2= Enter / Apply Button 
//NUMPAD_KEYS -1 = Backspace Button
export const NUMPAD_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "-1", "-2"];


/**
 * Maps the frontend Terminal State into a structured relational order format.
 * Note: 'id' fields are omitted or handled as undefined to allow Dexie auto-increment.
 */
export const mapTerminalStateToOrder = (state: ITerminalState, userId: number): IOrderView => {
    const { cart, customer, paymentCategory, paymentMethod, adjustment } = state;

    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    // 1. Map Line Items and Calculate Totals
    const items: IOrderItem[] = cart.map((item) => {

        const { product, quantity } = item;
        const unitPrice = calculateFinalPrice(product);
        const rowTotal = roundNumber(unitPrice * quantity);

        // Accumulate Subtotal
        subtotal += rowTotal;

        return {
            orderId: 0, // Placeholder, will be filled by OrderService transaction
            productId: product.id!,
            productName: `${product.name} ${product.code ? `(${product.code})` : ""}`,
            quantity: quantity,
            unitPrice: unitPrice,
            rowTotal: rowTotal,
        };
    });

    // 2. Apply Adjustments (Discounts, Surcharges) Construct Sub-tables (Only if values exist)

    const adjustments: IOrderAdjustment[] = [];

    const discounts: IOrderDiscount[] = [];
    adjustment.forEach((adj) => {
        // Calculate the actual numeric amount based on the valueType
        const amount = adj.valueType === 'PERCENT'
            ? roundNumber((subtotal * adj.value) / 100)
            : adj.value;

        if (adj.category === 'DISCOUNT') {
            totalDiscount += amount;

            // Push to discounts sub-table
            discounts.push({
                orderId: 0,
                category: adj.category,
                label: adj.label,
                value: adj.value,
                valueType: adj.valueType,
            });
        } else {
            // Handle Charges / Taxes
            totalTax += amount;

            // Push to adjustments/charges sub-table
            adjustments.push({
                orderId: 0,
                category: adj.category,
                label: adj.label,
                value: adj.value,
                valueType: adj.valueType,
            });
        }
    });

    // 3. Final Financial Snapshot
    // Subtract discounts and add taxes/charges
    const grandTotal = roundNumber(subtotal - totalDiscount + totalTax);

    // 4. Construct Order Header
    // 'orderNumber' is set to empty string here; OrderService.saveFullOrder will replace it.
    const order: IOrder = {
        orderNumber: "",
        customerId: customer?.id ?? 0, //link in transaction
        cashierId: userId,
        subtotal: roundNumber(subtotal),
        totalDiscount: roundNumber(totalDiscount),
        totalTax: roundNumber(totalTax),
        grandTotal: grandTotal,
        status: TOrderStatus.COMPLETED,
        createdAt: toUTCNowForDB()
    };


    // Map Payment Method safely
    const payments: IOrderPayment[] = paymentCategory ? [{
        orderId: 0,
        category: paymentCategory,
        method: paymentMethod!, // paymentMethod will be present if paymentCategory is present
        amount: grandTotal,
        reference: ''
    }] : [];

    return { order, items, adjustments, discounts, payments, customer: customer ?? undefined };
};

export const INITIAL_FILTER: IProductFilter = {
    code: undefined,
    sku: undefined,
    barcode: undefined,
    name: undefined,
    sellingPrice: undefined,
    taxRate: undefined,
    stock: undefined,
    reorderLevel: undefined,
    isActive: "",
    currentPage: 1,
    pageSize: 200,
};

/**
 * Compares the current filter state against the initial default values.
 * Returns true if all filter properties match the INITIAL_FILTER.
 */
export const isInitialFilter = (current: IProductFilter): boolean => {
    // Helper to treat null, undefined, and empty strings as equivalent for comparison
    const normalize = (val: string | number | null | undefined): string | number | undefined => {
        if (val === "" || val === null) {
            return undefined;
        }
        return val;
    };

    return (
        normalize(current.code) === normalize(INITIAL_FILTER.code) &&
        normalize(current.sku) === normalize(INITIAL_FILTER.sku) &&
        normalize(current.barcode) === normalize(INITIAL_FILTER.barcode) &&
        normalize(current.name) === normalize(INITIAL_FILTER.name) &&
        normalize(current.sellingPrice) === normalize(INITIAL_FILTER.sellingPrice) &&
        normalize(current.taxRate) === normalize(INITIAL_FILTER.taxRate) &&
        normalize(current.stock) === normalize(INITIAL_FILTER.stock) &&
        normalize(current.reorderLevel) === normalize(INITIAL_FILTER.reorderLevel) &&
        normalize(current.isActive) === normalize(INITIAL_FILTER.isActive)
    );
}; 