import { useLanguage } from "@/contexts/language";
import { SpinnerIcon } from "@/libs/icons";
import React, { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "info"
    | "amber"
    | "indigo";

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string;
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
    primary: "border-teal-600 text-teal-700 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950/30",
    secondary: "border-gray-500 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
    danger: "border-red-600 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/30",
    info: "border-blue-600 text-blue-700 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/30",
    amber: "border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950/30",
    indigo: "border-indigo-600 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/30",
};

export const OutlineButton = forwardRef<HTMLButtonElement, OutlineButtonProps>(
    (
        {
            children,
            title,
            isLoading,
            loadingText,
            icon,
            className = "",
            disabled,
            variant = "secondary",
            ...props
        },
        ref,
    ) => {
        const { t } = useLanguage();
        const displayLoadingText = loadingText || t("common.loading");
        return (
            <button
                ref={ref}
                title={title}
                disabled={disabled || isLoading}
                className={`flex items-center justify-center gap-2 w-full py-2.5 px-2.5 rounded-md font-bold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 border bg-transparent outline-none focus:ring-2 focus:ring-teal-500/20 ${variants[variant]} ${className}`}
                {...props}
            >
                {isLoading ? (
                    <>
                        <SpinnerIcon className="animate-spin h-4 w-4 text-current" />{" "}
                        <span className="ml-2">{displayLoadingText}</span>
                    </>
                ) : (
                    <>
                        {icon && <span className="shrink-0">{icon}</span>} {children}
                    </>
                )}
            </button>
        );
    },
);

OutlineButton.displayName = "OutlineButton";
