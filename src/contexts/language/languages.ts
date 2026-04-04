export interface ILanguage {
    code: string;
    label: string;
    isRTL?: boolean;
}

/**
 * Centralized list of all supported languages in the system.
 */
export const SUPPORTED_LANGUAGES: ILanguage[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },

];

export const DEFAULT_LOCALE = 'en';