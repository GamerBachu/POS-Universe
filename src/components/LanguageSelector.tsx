import React from "react";
import { useTranslation, SUPPORTED_LANGUAGES } from "@/contexts/language";
import Select from "./Select";

const LanguageSelector: React.FC = () => {
    const { locale, changeLanguage, isLoading } = useTranslation();

    return (
        <Select
            value={locale}
            disabled={isLoading}
            onChange={(e) => changeLanguage(e.target.value)}
        >
            {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white dark:bg-gray-800">
                    {lang.label}
                </option>
            ))}
        </Select>
    );
};

export default LanguageSelector;