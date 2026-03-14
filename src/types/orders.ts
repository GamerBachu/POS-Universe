/**
 * 1. THE ORDER HEADER
 * Summarizes the entire transaction.
 */
export interface IOrder {
    id?: number;            // Auto-increment 
    orderNumber: string;    // e.g., ORD-20260314-A1
    customerId?: number;    // foreign key to customer 
    cashierId: number;      // foreign key to user

    // Financial Summary
    subtotal: number;       // Sum of all items before any adjustments
    totalDiscount: number;  // Total of all rows in IOrderDiscount
    totalTax: number;       // Total of all rows in IOrderTax
    totalCharge: number;    // Total of service/maintenance charges
    grandTotal: number;     // Subtotal - Discount + Tax + Charges

    status: string;          //'completed' | 'voided' | 'refunded';
    createdAt: string;
}


/**
 * 2. LINE ITEMS
 * Links products to the order. Simple and flat.
 */
export interface IOrderItem {
    id?: number;            // Auto-increment 
    orderId: number;        // foreign key to order 
    productId: number;      // foreign key to product 
    productName: string;
    quantity: number;
    unitPrice: number;      // Selling price at time of sale
    rowTotal: number;       // unitPrice * quantity
}

/**
 * 3. TAXES & EXTRA CHARGES
 * Store Service charges, Maintenance, and Govt Taxes here.
 */
export interface IOrderAdjustment {
    id?: number;
    orderId: number;
    category: string;           // TAX = Govt, CHARGE = Service/Maintenance
    label: string;              // e.g. "VAT 5%", "Service Charge"
    amount: number;             // The calculated value
}

/**
 * 4. DISCOUNTS
 * Store Points, Gift Cards, and Coupons here.
 */
export interface IOrderDiscount {
    id?: number;
    orderId: number;
    type: string;                //'COUPON' | 'POINTS' | 'GIFT_CARD';
    description: string;        // e.g. "Redeemed 100 points"
    amount: number;             // Total value to subtract
}

/**
 * 5. PAYMENTS
 * Handles split payments (e.g. half cash, half card).
 */
export interface IOrderPayment {
    id?: number;
    orderId: number;
    method: string;              //'CASH' | 'CARD' | 'UPI' | 'GIFT_CARD';
    amount: number;
    reference?: string;         // Transaction ID // Card Auth ID or Wallet Txn ID
}


/**
 * 6. ORDER CANCELLATIONS
 * Stores history of voided or cancelled orders for audit purposes.
 */
export interface IOrderCancellation {
    id?: number;
    orderId: number;        // Links to the original Order ID
    orderNumber: string;   // Copied for quick searching

    // Cancellation Metadata
    reason: string;         // e.g., "Customer Changed Mind", "Entry Error", "Out of Stock"
    cancelledBy: number;    // Cashier/Admin ID who authorized cancellation

    // Financial Snapshot at time of cancellation
    refundedAmount: number;     // How much was returned to the customer
    refundMethod: string;        // 'CASH' | 'ORIGINAL_PAYMENT' | 'STORE_CREDIT';

    // Inventory Management
    restocked: boolean;     // Were the items put back into the inventory?

    createdAt: string;      // When the cancellation happened
}



export interface IOrderView {
    order: IOrder;
    items: IOrderItem[];
    adjustments: IOrderAdjustment[];
    discounts: IOrderDiscount[];
    payments: IOrderPayment[];
    cancellation?: IOrderCancellation;
}



//Would you like me to write a saveFullOrder transaction function that ensures all 5 tables are updated at once(Atomicity) ?;


//create a "Z-Report" function that sums up these tables for the end-of-day closing