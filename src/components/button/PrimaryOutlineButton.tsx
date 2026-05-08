import { useLanguage } from "@/contexts/language";
import { SpinnerIcon } from "@/libs/icons";
import React from "react";

interface PrimaryOutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
}

export const PrimaryOutlineButton: React.FC<PrimaryOutlineButtonProps> = ({
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
            className={`
                relative flex items-center justify-center gap-2
                w-full py-2.5 px-2.5 
                rounded-md font-bold text-sm 
                transition-all duration-200 active:scale-95 
                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 
                border
                bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100
                dark:bg-teal-900/10 Dark:text-teal-500 dark:hover:bg-teal-500/10
                ${className}`}
            {...props}
        >
            {isLoading && (
                <SpinnerIcon className="animate-spin h-4 w-4 text-current" />
            )}

            <span
                className={`flex items-center gap-2 ${isLoading ? "opacity-90" : "opacity-100"}`}
            >
                {!isLoading && icon && <span>{icon}</span>}
                {isLoading ? loadingText : children}
            </span>
        </button>
    );
};
