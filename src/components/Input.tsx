import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className = "", readOnly, ...props }: InputProps) => {
    return (
        <input
            readOnly={readOnly}
            className={`w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${readOnly
                    ? "text-gray-500 cursor-not-allowed outline-none"
                    : "outline-none"
                } ${className}`}
            {...props}
        />
    );
};

export default Input;
