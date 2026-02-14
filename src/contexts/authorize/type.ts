import type { appUser } from "@/types/appUser";

export type AuthProviderState = {
    info: IAuthorize;
    setInfo: (info: IAuthorize) => void;
};

export interface IAuthorize {
    account?: appUser;
    isAuthorized: boolean;
    appToken: string;
}