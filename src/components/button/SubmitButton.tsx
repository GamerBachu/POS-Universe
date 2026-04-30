import { useLanguage } from "@/contexts/language";
import { SpinnerIcon } from "@/libs/icons";
import React from "react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
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
            type={props.type || "submit"}
            disabled={disabled || isLoading}
            className={`relative flex items-center justify-center gap-2 w-full py-2.5 px-2.5 rounded-md font-bold uppercase text-sm tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 dark:bg-teal-500 dark:hover:bg-teal-400 ${className}`}
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
