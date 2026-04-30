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
        <div className={`flex flex-col gap-1 ${containerClassName}`} ref={ref}>
            {/* Small, bold metadata label */}
            <label
                htmlFor={id}
                className="text-sm text-gray-700 dark:text-gray-400 uppercase tracking-wider ml-1"
            >
                {label}
            </label>

            {/* Clean text display with no borders or backgrounds */}
            <div
                id={id}
                className={`w-full px-1 py-0.5 text-sm font-semibold text-gray-800 dark:text-gray-200 cursor-default select-all ${className} `}
            >
                {value || "—"}
            </div>
        </div>
    );
});

ReadOnlyWithLabel.displayName = "ReadOnlyWithLabel";
