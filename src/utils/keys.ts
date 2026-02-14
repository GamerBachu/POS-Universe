

export const StorageKeys = {
    USER: 'pos-u-user',
    THEME: 'pos-u-theme',
    TOKEN: 'pos-u-token',
} as const;


export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];