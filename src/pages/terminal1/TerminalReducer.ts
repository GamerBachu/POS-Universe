import { initialState, type TerminalAction, type TerminalState } from "@/types/terminal1";


export function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
    switch (action.type) {
        case "ADD_ITEM": {

            const existingIndex = state.cart.findIndex((i) => i.product.id === action.item.product.id);
            if (existingIndex !== -1) {
                const newCart = [...state.cart];
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    quantity: newCart[existingIndex].quantity + 1
                };
                return { ...state, cart: newCart };
            }
            return {
                ...state,
                cart: [...state.cart, { ...action.item, quantity: 1 }],
            };
        }
        case "REMOVE_ITEM":
            return { ...state, cart: state.cart.filter((i) => i.id !== action.id) };
        case "SET_PAYMENT_METHOD":
            return { ...state, paymentMethod: action.method };
        case "PAY":
            return { ...state, isPaid: true };
        case "RESET":
            return initialState;
        default:
            return state;
    }
}