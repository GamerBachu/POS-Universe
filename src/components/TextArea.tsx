import type { TextareaHTMLAttributes } from "react";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;


export const TextArea = ({ className = "", readOnly, ...props }: TextAreaProps) => {
    return (
        <textarea
            className={`w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${readOnly
                ? "text-gray-500 cursor-not-allowed outline-none"
                : "outline-none"
                } ${className}`}
            {...props}
        />
    );
};
export default TextArea;