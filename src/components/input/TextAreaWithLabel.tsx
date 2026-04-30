import { useId, forwardRef, type TextareaHTMLAttributes } from "react";

interface TextAreaWithLabelProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    containerClassName?: string;
    helperText?: string;
    required?: boolean; // Added explicit required prop for the label logic
}

export const TextAreaWithLabel = forwardRef<
    HTMLTextAreaElement,
    TextAreaWithLabelProps
>(
    (
        {
            label,
            error,
            containerClassName = "",
            helperText,
            className = "",
            required,
            ...props
        },
        ref,
    ) => {
        const id = useId();

        return (
            <div className={`flex flex-col gap-2 ${containerClassName}`}>
                <label
                    htmlFor={id}
                    className="text-sm text-gray-700 dark:text-gray-400 uppercase tracking-wider ml-1"
                >
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1" title="Required">
                            *
                        </span>
                    )}
                </label>

                <textarea
                    id={id}
                    ref={ref}
                    autoComplete="off"
                    required={required}
                    className={`w-full px-4 py-2.5 text-base bg-white dark:bg-gray-950 text-gray-900 dark:text-white border rounded-md shadow-sm transition-all outline-none placeholder:text-gray-400 ${error ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"} disabled:bg-gray-50 disabled:text-gray-500 ${className} `}
                    {...props}
                />
                {error ? (
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium italic">
                        {error}
                    </p>
                ) : helperText ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    },
);

TextAreaWithLabel.displayName = "TextAreaWithLabel";
