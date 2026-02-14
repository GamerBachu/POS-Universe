import type { IAuthorize } from "./type";
const defaultSession: IAuthorize = {
    account: undefined,
    isAuthorized: false,
    appToken: "",
};
export default defaultSession;