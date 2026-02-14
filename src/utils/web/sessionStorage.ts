import type { StorageKey } from "../keys";

export default class sessionStorage {
    private k: string;
    constructor(key: StorageKey) {
        this.k = key.toString();
    }

    set = (v: string): void => {
        window.sessionStorage.setItem(this.k, v);
    };

    get = (): string | null => {
        return window.sessionStorage.getItem(this.k);
    };

    remove = (): void => {
        return window.sessionStorage.removeItem(this.k);
    };
    clear = (): void => {
        return window.sessionStorage.clear();
    };

};