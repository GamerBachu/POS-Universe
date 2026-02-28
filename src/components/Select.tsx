import type { SelectHTMLAttributes } from "react";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ className = "", disabled, ...props }: SelectProps) => {
    return (
        <select
            className={`w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none ${className} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={disabled}
            {...props}
        >
            {props.children}
        </select>
    );
};

export default Select;
