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

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title?: string;
    isLoading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
    primary:
        "bg-teal-600 border-teal-700 text-white hover:bg-teal-700 dark:bg-teal-500 dark:border-teal-400 dark:text-gray-950 dark:hover:bg-teal-400",
    secondary:
        "bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600",
    danger:
        "bg-red-600 border-red-700 text-white hover:bg-red-700 dark:bg-red-500 dark:border-red-400 dark:hover:bg-red-400",
    info: "bg-blue-600 border-blue-700 text-white hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-400 dark:hover:bg-blue-400",
    amber:
        "bg-amber-500 border-amber-600 text-white hover:bg-amber-600 dark:bg-amber-500 dark:border-amber-400 dark:text-gray-950",
    indigo:
        "bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:border-indigo-400 dark:hover:bg-indigo-400",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            title,
            isLoading,
            loadingText,
            icon,
            className = "",
            disabled,
            variant = "primary",
            type = "button",
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
                type={type}
                disabled={disabled || isLoading}
                className={`flex items-center justify-center gap-2 py-2.5 px-2.5 rounded-md font-bold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 border outline-none focus:ring-2 focus:ring-teal-500/20 ${variants[variant]} ${className}`}
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

Button.displayName = "Button";
