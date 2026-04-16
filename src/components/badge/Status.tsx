import React from "react";

type StatusProps = React.HTMLAttributes<HTMLSpanElement> & {
    isActive: boolean;
};

const Status = ({ isActive, children, className = "", ...rest }: StatusProps) => {
    // Determine variant classes
    const variant = isActive
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-600/20"
        : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-amber-600/20";

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ring-1 ring-inset ${variant} ${className}`}
            {...rest}
        >
            {children}
        </span>
    );
};

export default Status;