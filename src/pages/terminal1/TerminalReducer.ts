import { initialState, type TerminalAction, type TerminalState } from "@/types/terminal1";

export function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
    switch (action.type) {
        case "ADD_ITEM": {
            const { product } = action.item;
            const existingItem = state.cart.find((i) => i.product.id === product.id);
            const currentQty = existingItem?.quantity || 0;

            // Stock Validation
            if (currentQty >= (product.stock || 0)) {
                return {
                    ...state,
                    alert: { message: `Only ${product.stock} items available in stock`, type: "warning" }
                };
            }

            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: Number(item.quantity) + 1 }
                            : item
                    ),
                    alert: undefined // Clear alert on success
                };
            }

            return {
                ...state,
                cart: [...state.cart, { ...action.item, quantity: 1 }],
                alert: undefined
            };
        }

        case "REMOVE_ITEM": {
            const itemToUpdate = state.cart.find((i) => i.product.id === action.item.product.id);

            if (!itemToUpdate) return state;

            const shouldRemove = itemToUpdate.quantity <= 1;

            return {
                ...state,
                cart: shouldRemove
                    ? state.cart.filter((i) => i.product.id !== action.item.product.id)
                    : state.cart.map((i) =>
                        i.product.id === action.item.product.id
                            ? { ...i, quantity: i.quantity - 1 }
                            : i
                    ),
                alert: undefined
            };
        }

        case "SET_ALERT":
            return { ...state, alert: action.alert || undefined };

        case "SET_CUSTOMER":
            return { ...state, customer: action.customer };

        case "SET_PAYMENT_METHOD":
            return { ...state, paymentMethod: action.method };

        case "PAY":
            return { ...state, isPaid: true, alert: { message: "Transaction completed!", type: "success" } };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}