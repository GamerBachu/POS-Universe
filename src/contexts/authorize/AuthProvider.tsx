import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { IAuthorize } from "./type";
import defaultSession from "./const";
import { AuthProviderContext } from "./AuthProviderContext";
import { applicationStorage, sessionStorage, StorageKeys } from "@/utils";
import type { authUser } from "@/types/user";


export function AuthProvider({ children }: { children: ReactNode; }) {
    const [info, setInfo] = useState<IAuthorize>(() => defaultSession);

    const setInfoStart = useCallback((value: IAuthorize | undefined) => {
        const userStorage = new applicationStorage(StorageKeys.USER);
        const tokenStorage = new sessionStorage(StorageKeys.TOKEN);

        if (value === undefined || value.isAuthorized === false) {
            //logout
            setInfo(defaultSession);
            tokenStorage.remove();
            userStorage.remove();
        }
        else {
            //login
            const newUser: authUser = {
                guid: value.authUser?.guid ?? "",
                displayName: value.authUser?.displayName ?? "",
                username: value.authUser?.username ?? "",
                roles: value.authUser?.roles ?? [],
                refreshToken: value.authUser?.refreshToken ?? "",
            };
            tokenStorage.set(value.appToken);
            userStorage.set(JSON.stringify(newUser));
            setInfo(value);
        }
    }, []);

    const value = useMemo(() => ({
        info,
        setInfo: setInfoStart,
    }), [info, setInfoStart]);



    return (
        <AuthProviderContext.Provider value={value}>
            {children}
        </AuthProviderContext.Provider>
    );
}