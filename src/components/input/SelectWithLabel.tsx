import { useId, forwardRef, type SelectHTMLAttributes } from "react";

interface SelectWithLabelProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    containerClassName?: string;
    helperText?: string;
    required?: boolean;
}

export const SelectWithLabel = forwardRef<
    HTMLSelectElement,
    SelectWithLabelProps
>(
    (
        {
            label,
            error,
            containerClassName = "",
            helperText,
            className = "",
            required,
            children,
            ...props
        },
        ref,
    ) => {
        const id = useId();

        return (
            <div className={`flex flex-col gap-2 ${containerClassName}`}>
                <label
                    htmlFor={id}
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
                >
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1" title="Required">
                            *
                        </span>
                    )}
                </label>

                <select
                    id={id}
                    ref={ref}
                    required={required}
                    className={`w-full px-4 py-2.5 text-base bg-white dark:bg-gray-950 text-gray-900 dark:text-white border rounded-md shadow-sm transition-all outline-none  ${error ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"} disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 ${className}`}
                    {...props}
                >
                    {children}
                </select>

                {(error || helperText) && (
                    <div className="min-h-[20px] ml-1">
                        <p
                            className={`text-sm ${error ? "text-red-600 dark:text-red-400 font-medium italic" : "text-gray-500 dark:text-gray-400"}`}
                        >
                            {error || helperText}
                        </p>
                    </div>
                )}
            </div>
        );
    },
);

SelectWithLabel.displayName = "SelectWithLabel";
