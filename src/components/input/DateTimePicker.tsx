import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface DateTimePickerProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    containerClassName?: string;
    helperText?: string;
    required?: boolean; // Added explicit required prop for the label logic
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
    (
        {
            label,
            error,
            required,
            containerClassName = "",
            className = "",
            helperText,
            ...props
        },
        ref,
    ) => {
        const id = useId();
        return (
            <div className={`flex flex-col gap-2 ${containerClassName}`}>
                <label
                    htmlFor={id}
                    className="text-sm font-semibold text-gray-700 dark:text-gray-400 ml-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    type="datetime-local"
                    id={id}
                    ref={ref}
                    required={required}
                    className={`w-full px-4 py-2.5 text-base rounded-md border shadow-sm outline-none bg-white dark:bg-gray-950 dark:[color-scheme:dark] ${error ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"} ${className}`}
                    {...props}
                />
                {(error || helperText) && (
                    <div className="ml-1">
                        <p
                            className={`text-sm ${error ? "text-red-600 italic" : "text-gray-500"}`}
                        >
                            {error || helperText}
                        </p>
                    </div>
                )}
            </div>
        );
    },
);

DateTimePicker.displayName = "DateTimePicker";
