import { useLanguage } from "@/contexts/language";
import { SpinnerIcon } from "@/libs/icons";
import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
    children,
    isLoading = false,
    loadingText,
    icon,
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
            className={`relative flex items-center justify-center py-2.5 px-2.5 border rounded-md transition-all duration-200 active:scale-90 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
            {...props}
        >
            {isLoading && (
                <SpinnerIcon className="animate-spin h-5 w-5 text-current" />
            )}

            <span
                className={`flex items-center gap-2 ${isLoading ? "opacity-90" : "opacity-100"}`}
            >
                {!isLoading && icon && <span className="text-lg">{icon}</span>}
                {isLoading ? loadingText : children}
            </span>
        </button>
    );
};
