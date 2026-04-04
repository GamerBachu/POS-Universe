import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import type { TranslationSchema, TranslationKey } from "./type";
import LanguageContext from "./LanguageContext";
import { applicationStorage, LoggerUtils, StorageKeys } from "@/utils";
import { DEFAULT_LOCALE } from "./languages";

// Instantiate storage once outside to avoid overhead
const langStorage = new applicationStorage(StorageKeys.LANGUAGE);

export const LanguageProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const [locale, setLocale] = useState<string>(() => langStorage.get() || DEFAULT_LOCALE);
    const [translations, setTranslations] = useState<TranslationSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Ref tracks the currently active language to skip redundant network requests
    const activeLangRef = useRef<string | null>(null);

    const loadTranslations = useCallback(async (lang: string) => {
        if (activeLangRef.current === lang && translations) return;

        setIsLoading(true);
        try {
            const data = await import(`@/locales/${lang}.json`) as { default: TranslationSchema; };

            setTranslations(data.default);
            setLocale(lang);
            activeLangRef.current = lang;
            langStorage.set(lang);
        } catch (error) {
            LoggerUtils.logCatch(error, "LanguageProvider", "loadTranslations", lang);
            // Safety: if a specific file fails, attempt to load the default
            if (lang !== DEFAULT_LOCALE) {
                loadTranslations(DEFAULT_LOCALE);
            }
        } finally {
            setIsLoading(false);
        }
    }, [translations]);

    useEffect(() => {
        loadTranslations(locale);
    }, [locale, loadTranslations]);

    /**
     * Optimized 't' function
     * Replaces 'any' with Record<string, unknown> and strict type narrowing
     */
    const t = useCallback((path: TranslationKey): string => {
        if (!translations) return path;

        const keys = path.split('.');
        let result: unknown = translations;

        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = (result as Record<string, unknown>)[key];
            } else {
                result = undefined;
                break;
            }
        }

        return typeof result === 'string' ? result : path;
    }, [translations]);

    const changeLanguage = useCallback((lang: string) => {
        if (lang !== activeLangRef.current) {
            loadTranslations(lang);
        }
    }, [loadTranslations]);

    // Memoize the context value to prevent unnecessary re-renders in consumer components
    const contextValue = useMemo(() => ({
        locale,
        t,
        changeLanguage,
        isLoading
    }), [locale, t, changeLanguage, isLoading]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;