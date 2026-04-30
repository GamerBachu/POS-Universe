import { useId, forwardRef } from "react";

interface ReadOnlyWithLabelProps {
    label: string;
    value: string | number | undefined;
    containerClassName?: string;
    className?: string;
}

export const ReadOnlyWithLabel = forwardRef<
    HTMLDivElement,
    ReadOnlyWithLabelProps
>(({ label, value, containerClassName = "", className = "" }, ref) => {
    const id = useId();

    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`} ref={ref}>
            <label
                htmlFor={id}
                className="text-sm font-semibold text-gray-700 dark:text-gray-400 ml-1"
            >
                {label}
            </label>
            <div
                id={id}
                className={`w-full px-4 py-1 text-base font-medium text-gray-900 dark:text-gray-100 cursor-default select-all ${className}`}
            >
                {value || "—"}
            </div>
        </div>
    );
});

ReadOnlyWithLabel.displayName = "ReadOnlyWithLabel";