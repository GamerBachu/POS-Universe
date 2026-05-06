import { useLanguage } from "@/contexts/language";
import { CloseIcon, SpinnerIcon } from "@/libs/icons";
import React from "react";

interface TextBoxClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
}

export const TextBoxClearButton: React.FC<TextBoxClearButtonProps> = ({
    isLoading = false,
    loadingText,
    className = "",
    disabled,
    ...props
}) => {
    const { t } = useLanguage();
    if (!loadingText) {
        loadingText = t("common.loading");
    }

    return (
        <button
            type={props.type || "button"}
            disabled={disabled || isLoading}
            className={`absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 transition-all active:scale-90 ${className}`}
            {...props}
        >
            {isLoading && (
                <SpinnerIcon className="animate-spin h-5 w-5 text-current" />
            )}
            <CloseIcon className="w-3.5 h-3.5" />
        </button>
    );
};
