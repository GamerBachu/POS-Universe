import React from "react";

interface ResetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
}
export const ResetButton: React.FC<ResetButtonProps> = ({
    children,
    icon,
    className = "",
    ...props
}) => {
    return (
        <button
            // type="button" is safer than "reset" if you are managing state manually
            type="reset"
            className={`relative flex items-center justify-center gap-2 w-full py-2.5 px-2.5 rounded-md font-bold  text-sm  transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gray-600 hover:bg-gray-700 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 ${className}`}
            {...props}
        >
            <span className="flex items-center gap-2">
                {icon && <span className="text-lg">{icon}</span>}
                {children || "Reset"}
            </span>
        </button>
    );
};