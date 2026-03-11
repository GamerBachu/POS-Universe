

export const StorageKeys = {
    USER: 'pos-u-user',
    THEME: 'pos-u-theme',
    TOKEN: 'pos-u-token',
    SIDEBAR: 'pos-u-sidebar'
} as const;


export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];


export const EventKeys = {
    SIDEBAR_EVENT: 'sidebar-toggle-event',
} as const;


export type EventKey = typeof EventKeys[keyof typeof EventKeys];