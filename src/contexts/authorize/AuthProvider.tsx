import { useCallback, useState, type ReactNode } from "react";
import type { IAuthorize } from "./type";
import defaultSession from "./const";
import { AuthProviderContext } from "./AuthProviderContext";
import { applicationStorage, sessionStorage, StorageKeys } from "@/utils";
import type { appUser } from "@/types/appUser";


export function AuthProvider({ children }: { children: ReactNode; }) {
    const [info, setInfo] = useState<IAuthorize>(() => defaultSession);

    const value = {
        info,
        setInfo: (info: IAuthorize) => {
            setInfoStart(info);
        },
    };

    const setInfoStart = useCallback((value: IAuthorize | undefined) => {
        const newValue = value ?? defaultSession;

        const userStorage = new applicationStorage(StorageKeys.USER);
        const tokenStorage = new sessionStorage(StorageKeys.TOKEN);

        const newUser: appUser = {
            guid: newValue.account?.guid ?? "",
            displayName: newValue.account?.displayName ?? "",
            username: newValue.account?.username ?? "",
            roles: newValue.account?.roles ?? [],
            refreshToken: newValue.account?.refreshToken ?? "",
        };

        tokenStorage.set(newValue.appToken);
        userStorage.set(JSON.stringify(newUser));
        setInfo(newValue);
    }, []);


    return (
        <AuthProviderContext.Provider value={value}>
            {children}
        </AuthProviderContext.Provider>
    );
}