import { createContext, useContext, type Dispatch } from "react";
import type { TerminalAction, TerminalState } from "@/types/terminal1";

// Contexts
export const TerminalStateContext = createContext<TerminalState | undefined>(undefined);
export const TerminalDispatchContext = createContext<Dispatch<TerminalAction> | undefined>(undefined);

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