import React, { type InputHTMLAttributes } from "react";

// Extend standard HTML Input attributes so you can pass name, onBlur, min, max, etc.
interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    classBox?: string;
    classInput?: string;
    classLabel?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    required,
    classBox = "",
    classInput = "",
    classLabel = "",
    id,
    ...props
}) => {
    const inputId = id || props.name;

    return (
        <div className={`flex flex-col gap-1 ${classBox}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={`text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1 ${classLabel}`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative group">
                <input
                    type="date"
                    {...props}
                    className={`w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all cursor-pointer dark:[color-scheme:dark] ${classInput}`}
                />
            </div>
        </div>
    );
};

export default DatePicker;
