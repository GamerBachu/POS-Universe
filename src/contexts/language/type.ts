export type TranslationSchema = typeof import('@/assets/locales/en.json');

/**
 * Recursive type to extract all dot-notated paths to string leaves in the translation schema.
 * This enables full IDE autocompletion for t("...") keys.
 */
type PathsToLeaves<T> = T extends object
    ? {
        [K in keyof T]: `${K & string}${PathsToLeaves<T[K]> extends never ? "" : `.${PathsToLeaves<T[K]>}`}`
    }[keyof T]
    : never;

export type TranslationKey = PathsToLeaves<TranslationSchema>;

export interface LanguageContextType {
    locale: string;
    t: (key: TranslationKey) => string;
    changeLanguage: (lang: string) => void;
    isLoading: boolean;
}
