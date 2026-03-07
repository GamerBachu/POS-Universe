import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from "react";

// Define terminal state shape
export interface TerminalState {
  cart: Array<{ id: string; name: string; price: number; quantity: number }>;
  paymentMethod: string | null;
  isPaid: boolean;
}

// Define action types
export type TerminalAction =
  | { type: "ADD_ITEM"; item: { id: string; name: string; price: number } }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "SET_PAYMENT_METHOD"; method: string }
  | { type: "PAY" }
  | { type: "RESET" };

// Initial state
const initialState: TerminalState = {
  cart: [],
  paymentMethod: null,
  isPaid: false,
};

// Reducer function
export function terminalReducer(
  state: TerminalState,
  action: TerminalAction
): TerminalState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.cart.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { ...action.item, quantity: 1 },
        ],
      };
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.id),
      };
    }
    case "SET_PAYMENT_METHOD": {
      return {
        ...state,
        paymentMethod: action.method,
      };
    }
    case "PAY": {
      return {
        ...state,
        isPaid: true,
      };
    }
    case "RESET": {
      return initialState;
    }
    default:
      return state;
  }
}

// Contexts
const TerminalStateContext = createContext<TerminalState | undefined>(undefined);
const TerminalDispatchContext = createContext<Dispatch<TerminalAction> | undefined>(undefined);

// Provider component
export const TerminalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  return (
    <TerminalStateContext.Provider value={state}>
      <TerminalDispatchContext.Provider value={dispatch}>
        {children}
      </TerminalDispatchContext.Provider>
    </TerminalStateContext.Provider>
  );
};

// Custom hooks
export function useTerminalState() {
  const context = useContext(TerminalStateContext);
  if (context === undefined) {
    throw new Error("useTerminalState must be used within TerminalProvider");
  }
  return context;
}

export function useTerminalDispatch() {
  const context = useContext(TerminalDispatchContext);
  if (context === undefined) {
    throw new Error("useTerminalDispatch must be used within TerminalProvider");
  }
  return context;
}