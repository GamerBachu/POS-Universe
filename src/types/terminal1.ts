import type { IStatusType } from "./actionState";
import type { ICustomer } from "./customer";
import type { IProduct } from "./product";

export interface CartItem {
    id?: number;           // Internal DB Auto-increment
    rowId: string; // random unique code
    product: IProduct; // ref product
    quantity: number; // quantity
}

export interface TerminalState {
    alert: { message: string; type: IStatusType; } | undefined;
    cart: CartItem[];
    customer?: ICustomer | null,
    paymentMethod: string | null;
    isPaid: boolean;
}











export type TerminalAction =
    | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity">; }
    | { type: "REMOVE_ITEM"; item: Omit<CartItem, "quantity">; }
    | { type: "SET_ALERT"; alert: { message: string; type: IStatusType; } | null; }
    | { type: "SET_CUSTOMER"; customer: ICustomer | null; }
    | { type: "SET_PAYMENT_METHOD"; method: string; }
    | { type: "PAY"; }
    | { type: "RESET"; };



export const initialState: TerminalState = {
    alert: undefined,
    cart: [],
    paymentMethod: null,
    isPaid: false,
};


