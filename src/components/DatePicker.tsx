import React, { type InputHTMLAttributes } from 'react';
import { CloseIcon } from "@/libs/icons";

// Extend standard HTML Input attributes so you can pass name, onBlur, min, max, etc.
interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    onClear?: () => void;
    classBox?: string;
    classInput?: string;
    classLabel?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    value,
    onClear,
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
                    id={inputId}
                    type="date"
                    value={value}
                    {...props}
                    className={`w-full pl-9 pr-9 py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${classInput}`}
                />

                {/* Clear Action (Right) */}
                {onClear && value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
                    >
                        <CloseIcon className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DatePicker;