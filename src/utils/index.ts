export { type StorageKey, StorageKeys } from './keys';
export { default as sessionStorage } from './web/sessionStorage';
export { default as applicationStorage } from './web/applicationStorage';

export const tokenValidTill = 60 * 60 * 1000; // 1 hour in milliseconds

export const getName = (nf: string | undefined, nm: string | undefined, nl: string | undefined) => {

    // join them with space and trim the result to handle cases where some parts might be missing
    const fullName = `${nf || ""} ${nm || ""} ${nl || ""}`.trim();

    // if fullName is not empty, return it; otherwise, return the first non-empty part
    if (fullName) return fullName;
    return nf || nm || nl || ""; // return the first non-empty part or an empty string if all are empty
};