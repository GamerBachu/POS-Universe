import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { IAuthorize } from "./type";
import defaultSession from "./const";
import { AuthProviderContext } from "./AuthProviderContext";
import { CookieStorage, refreshTokenValidTill, StorageKeys } from "@/utils";
import type { IAuthUser } from "@/types/user";

export function AuthProvider({ children }: { children: ReactNode; }) {
    const [info, setInfo] = useState<IAuthorize>(() => defaultSession);

    const setInfoStart = useCallback((value: IAuthorize | undefined) => {
        if (value === undefined || value.isAuthorized === false) {
            //logout
            CookieStorage.delete(StorageKeys.TOKEN);
            setInfo(defaultSession);
        } else {
            const newToken = value.authUser?.refreshToken ?? "";
            const userId = value.authUser?.userId ?? 0;
            if (newToken === "" || userId === 0) {
                setInfo(defaultSession);
                return;
            }
            //login
            const newUser: IAuthUser = {
                userId: userId,
                displayName: value.authUser?.displayName ?? "",
                username: value.authUser?.username ?? "",
                roles: value.authUser?.roles ?? [],
                refreshToken: newToken,
            };
            CookieStorage.setSecure(
                StorageKeys.TOKEN,
                newToken,
                refreshTokenValidTill,
            );
            setInfo({
                isAuthorized: true,
                authUser: newUser,
            });
        }
    }, []);

    const value = useMemo(
        () => ({
            info,
            setInfo: setInfoStart,
        }),
        [info, setInfoStart],
    );

    return (
        <AuthProviderContext.Provider value={value}>
            {children}
        </AuthProviderContext.Provider>
    );
}
