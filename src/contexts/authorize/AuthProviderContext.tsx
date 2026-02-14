import { createContext } from "react";
import type { AuthProviderState } from "./type";
import defaultSession from "./const";

const initialState: AuthProviderState = {
    info: defaultSession,
    setInfo: () => null,
};

export const AuthProviderContext = createContext<AuthProviderState>(initialState);
