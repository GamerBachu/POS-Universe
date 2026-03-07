import type { IProduct } from "./product";

export interface CartItem {
    id?: number;           // Internal DB Auto-increment
    rowId: string; // random unique code
    product: IProduct; // ref product
    quantity: number; // quantity
}

export interface TerminalState {
    isError: boolean;
    errorMessage: string;
    cart: CartItem[];
    paymentMethod: string | null;
    isPaid: boolean;
}

export type TerminalAction =
    | { type: "ADD_ITEM"; item: CartItem; }
    | { type: "REMOVE_ITEM"; rowId: string; }
    | { type: "SET_PAYMENT_METHOD"; method: string; }
    | { type: "PAY"; }
    | { type: "RESET"; };



export const initialState: TerminalState = {
    isError: false,
    errorMessage: "",
    cart: [],
    paymentMethod: null,
    isPaid: false,
};