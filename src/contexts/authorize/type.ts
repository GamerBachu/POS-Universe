import type { authUser } from "@/types/user";

export type AuthProviderState = {
    info: IAuthorize;
    setInfo: (info: IAuthorize | undefined) => void;
};

export interface IAuthorize {
    isAuthorized: boolean;
    appToken: string;
    authUser?: authUser;
}