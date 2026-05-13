import React from "react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/contexts/language";
import { SelectWithLabel } from "@/components/input";

const LanguageSelector: React.FC = () => {
    const { locale, changeLanguage, isLoading } = useLanguage();

    return (
        <SelectWithLabel
            label=""
            value={locale}
            disabled={isLoading}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeLanguage(e.target.value)}
        >
            {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white dark:bg-gray-800">
                    {lang.label}
                </option>
            ))}
        </SelectWithLabel>
    );
};

export default LanguageSelector;