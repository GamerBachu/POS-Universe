import type { IAuthorize } from "./type";
const defaultSession: IAuthorize = {
    authUser: undefined,
    isAuthorized: false,
    appToken: "",
};
export default defaultSession;