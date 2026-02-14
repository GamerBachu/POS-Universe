import { useCallback, useState, type ReactNode } from "react";
import type { IAuthorize } from "./type";
import defaultSession from "./const";
import { AuthProviderContext } from "./AuthProviderContext";
import { applicationStorage, sessionStorage, StorageKeys } from "@/utils";
import type { authUser } from "@/types/user";


export function AuthProvider({ children }: { children: ReactNode; }) {
    const [info, setInfo] = useState<IAuthorize>(() => defaultSession);

    const value = {
        info,
        setInfo: (info: IAuthorize | undefined) => { setInfoStart(info); },
    };

    const setInfoStart = useCallback((value: IAuthorize | undefined) => {

        const newValue = value;

        const userStorage = new applicationStorage(StorageKeys.USER);
        const tokenStorage = new sessionStorage(StorageKeys.TOKEN);

        if (newValue === undefined) {
            //logout
            setInfo(defaultSession);
            tokenStorage.remove();
            userStorage.remove();
        }
        else if (newValue.isAuthorized===false) {
            //logout
            setInfo(defaultSession);
            tokenStorage.remove();
            userStorage.remove();
        }
        else {
            //login
            const newUser: authUser = {
                guid: newValue.authUser?.guid ?? "",
                displayName: newValue.authUser?.displayName ?? "",
                username: newValue.authUser?.username ?? "",
                roles: newValue.authUser?.roles ?? [],
                refreshToken: newValue.authUser?.refreshToken ?? "",
            };
            tokenStorage.set(newValue.appToken);
            userStorage.set(JSON.stringify(newUser));
            setInfo(newValue);
        }
    }, []);


    return (
        <AuthProviderContext.Provider value={value}>
            {children}
        </AuthProviderContext.Provider>
    );
}