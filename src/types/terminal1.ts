import type { TStatusType } from "./actionState";
import type { ICustomer } from "./customer";
import type { IProduct } from "./product";

export const initialState: ITerminalState = {
    alert: undefined,
    cart: [],
    customer: null,
    paymentCategory: null,
    paymentMethod: null,
    isPaid: false,
};


export interface ICartItem {
    id?: number;           // Internal DB Auto-increment
    rowId: string; // random unique code
    product: IProduct; // ref product
    quantity: number; // quantity
}

export interface ITerminalState {
    alert: { message: string; type: TStatusType; } | undefined;
    cart: ICartItem[];
    customer?: ICustomer | null,
    paymentCategory: TPaymentCategory | null;
    paymentMethod: TPaymentMethod | null;
    isPaid: boolean;
}


export type TerminalAction =
    | { type: "ADD_ITEM"; item: Omit<ICartItem, "quantity">; }
    | { type: "REMOVE_ITEM"; item: Omit<ICartItem, "quantity">; }
    | { type: "SET_ALERT"; alert: { message: string; type: TStatusType; } | null; }
    | { type: "SET_CUSTOMER"; customer: ICustomer | null; }
    | { type: "SET_PAYMENT_CATEGORY"; paymentCategory: TPaymentCategory | null; }
    | { type: "SET_PAYMENT_METHOD"; paymentMethod: TPaymentMethod | null; }
    | { type: "CHECK_PAYMENT_STATUS"; }
    | { type: "COMPLETE"; };


/**
 * THE TRANSACTION LIFECYCLE
 * Represents the current progress of an order from initiation to finality.
 * - PENDING: Initial state before payment confirmation.
 * - COMPLETED: Successfully paid and inventory adjusted.
 * - VOIDED: Cancelled by cashier (e.g., error in entry).
 * - REFUNDED: Money returned to customer for all items.
 * - PARTIALLY_REFUNDED: Partial return of specific items or value.
 */
export const TOrderStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    VOIDED: 'VOIDED',
    REFUNDED: 'REFUNDED',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
} as const;

/** Type alias derived from TOrderStatus object */
export type TOrderStatus = (typeof TOrderStatus)[keyof typeof TOrderStatus];

/**
 * PRIMARY PAYMENT CATEGORY
 * High-level classification used for daily sales reconciliation and physical cash counting.
 * - CASH: Physical notes and coins.
 * - ELECTRONIC: Any digital transaction requiring external verification.
 */
export const TPaymentCategory = {
    CASH: 'CASH',
    ELECTRONIC: 'ELECTRONIC',
} as const;

/** Type alias derived from TPaymentCategory object */
export type TPaymentCategory = (typeof TPaymentCategory)[keyof typeof TPaymentCategory];

/**
 * SPECIFIC PAYMENT CHANNEL
 * Granular detail for 'ELECTRONIC' transactions to help track banking fees and settlement sources.
 * - UPI: Unified Payments Interface (Mobile Scan/Pay).
 * - CREDIT_CARD / DEBIT_CARD: Physical card swipes or chips.
 * - NET_BANKING: Direct bank-to-bank transfers.
 * - WALLET: Third-party digital wallets (Apple Pay, Google Pay, etc).
 * - NOT_APPLICABLE: Default value for CASH transactions.
 */
export const TPaymentMethod = {
    UPI: 'UPI',
    CREDIT_CARD: 'CREDIT_CARD',
    DEBIT_CARD: 'DEBIT_CARD',
    NET_BANKING: 'NET_BANKING',
    WALLET: 'WALLET',
    NOT_APPLICABLE: 'N/A',
} as const;

/** Type alias derived from TPaymentMethod object */
export type TPaymentMethod = (typeof TPaymentMethod)[keyof typeof TPaymentMethod];