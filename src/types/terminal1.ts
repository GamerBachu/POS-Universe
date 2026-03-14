import type { IStatusType } from "./actionState";
import type { ICustomer } from "./customer";
import type { IProduct } from "./product";

export interface ICartItem {
    id?: number;           // Internal DB Auto-increment
    rowId: string; // random unique code
    product: IProduct; // ref product
    quantity: number; // quantity
}

export interface ITerminalState {
    alert: { message: string; type: IStatusType; } | undefined;
    cart: ICartItem[];
    customer?: ICustomer | null,
    paymentMethod: string | null;
    isPaid: boolean;
}



export interface IPaymentMethod {
    name: string;
    id: number;
}









export type TerminalAction =
    | { type: "ADD_ITEM"; item: Omit<ICartItem, "quantity">; }
    | { type: "REMOVE_ITEM"; item: Omit<ICartItem, "quantity">; }
    | { type: "SET_ALERT"; alert: { message: string; type: IStatusType; } | null; }
    | { type: "SET_CUSTOMER"; customer: ICustomer | null; }
    | { type: "SET_PAYMENT_METHOD"; method: string; }
    | { type: "CHECK_PAYMENT_STATUS"; }
    | { type: "COMPLETE"; };



export const initialState: ITerminalState = {
    alert: undefined,
    cart: [],
    customer: null,
    paymentMethod: null,
    isPaid: false,
};

export const paymentMethods: IPaymentMethod[] = [
    { name: "Cash", id: 1 },
    { name: "Electronic", id: 2 }
];

export const paymentSystemMethods: IPaymentMethod[] = [
    { name: "Credit Card", id: 1 },
    { name: "Debit Card", id: 2 },
    { name: "UPI", id: 3 },
]

