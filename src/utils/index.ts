import type { IDeviceInfo } from '@/types/user';

export { type StorageKey, StorageKeys } from './keys';
export { default as sessionStorage } from './web/sessionStorage';
export { default as applicationStorage } from './web/applicationStorage';
export * from './web/cookieStorage';
export { default as LoggerUtils } from "./logger";

export const tokenValidTill = 60 * 60 * 1000; // 1 hour in milliseconds
export const refreshTokenValidTill = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const getName = (nf: string | undefined, nm: string | undefined, nl: string | undefined) => {

    // join them with space and trim the result to handle cases where some parts might be missing
    const fullName = `${nf || ""} ${nm || ""} ${nl || ""}`.trim();

    // if fullName is not empty, return it; otherwise, return the first non-empty part
    if (fullName) return fullName;
    return nf || nm || nl || ""; // return the first non-empty part or an empty string if all are empty
};

export const getDeviceInfo = (): IDeviceInfo => {
    return {
        browser: 'Unknown Browser',
        os: 'Unknown OS',
        deviceType: 'Desktop'
    };
};

export const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";