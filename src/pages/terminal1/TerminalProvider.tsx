import { useReducer, type ReactNode } from "react";
import { terminalReducer } from "./TerminalReducer";
import { TerminalStateContext, TerminalDispatchContext } from "./TerminalContext"; 
import { newOrderState } from "./utils";

const TerminalProvider = ({ children }: { children: ReactNode; }) => {
    const [state, dispatch] = useReducer(terminalReducer, newOrderState);
    return (
        <TerminalStateContext.Provider value={state}>
            <TerminalDispatchContext.Provider value={dispatch}>
                {children}
            </TerminalDispatchContext.Provider>
        </TerminalStateContext.Provider>
    );
};
export default TerminalProvider;