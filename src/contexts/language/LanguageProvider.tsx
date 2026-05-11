import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import type { TranslationSchema, TranslationKey } from "./type";
import LanguageContext from "./LanguageContext";
import { applicationStorage, LoggerUtils, StorageKeys } from "@/utils";
import { DEFAULT_LOCALE } from "./languages";
import enUS from "@/assets/locales/en.json";


// Instantiate storage once outside to avoid overhead
const langStorage = new applicationStorage(StorageKeys.LANGUAGE);

export const LanguageProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const initialLocale = useMemo(() => langStorage.get() || DEFAULT_LOCALE, []);

    const [locale, setLocale] = useState<string>(initialLocale);
    const [translations, setTranslations] = useState<TranslationSchema | null>(() =>
        initialLocale === DEFAULT_LOCALE ? (enUS as unknown as TranslationSchema) : null
    );
    const [isLoading, setIsLoading] = useState(initialLocale !== DEFAULT_LOCALE);

    // Ref tracks the currently active language to skip redundant network requests
    const activeLangRef = useRef<string | null>(initialLocale === DEFAULT_LOCALE ? DEFAULT_LOCALE : null);

    const loadTranslations = useCallback(async (lang: string) => {
        // Prevent redundant loads if the language is already active
        if (activeLangRef.current === lang) return;

        setIsLoading(true);
        try {
            const data = await import(`@/assets/locales/${lang}.json`) as { default: TranslationSchema; };

            setTranslations(data.default);
            activeLangRef.current = lang;
            langStorage.set(lang);
        } catch (error) {
            // Fallback to the statically imported English asset if dynamic loading fails
            setTranslations(enUS as unknown as TranslationSchema);
            setLocale(DEFAULT_LOCALE);
            activeLangRef.current = DEFAULT_LOCALE;
            langStorage.set(DEFAULT_LOCALE);
            LoggerUtils.logCatch(error, "LanguageProvider", "loadTranslations", lang);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTranslations(locale);
    }, [locale, loadTranslations]);

    const t = useCallback(
        (path: TranslationKey): string => {
            const keys = path.split(".");

            const getValue = (obj: unknown): string | undefined => {
                if (!obj) return undefined;
                let current: unknown = obj;
                for (const key of keys) {
                    if (current && typeof current === "object" && key in current) {
                        current = (current as Record<string, unknown>)[key];
                    } else {
                        break;
                    }
                }
                return typeof current === "string" ? current : undefined;
            };

            // 1. Check primary translations
            const result = getValue(translations);
            if (result !== undefined) return result;

            // 2. Fallback to English static asset if primary isn't English
            return (translations !== (enUS as unknown)) ? (getValue(enUS) ?? path) : path;
        },
        [translations]
    );

    const changeLanguage = useCallback((lang: string) => {
        setLocale(lang);
    }, []);

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