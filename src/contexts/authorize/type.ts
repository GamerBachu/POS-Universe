import type { IAuthUser } from "@/types/user";

export type AuthProviderState = {
    info: IAuthorize;
    setInfo: (info: IAuthorize | undefined) => void;
};

export interface IAuthorize {
    isAuthorized: boolean; 
    authUser?: IAuthUser;
}