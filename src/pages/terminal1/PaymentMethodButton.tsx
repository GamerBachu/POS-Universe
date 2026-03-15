import React from "react";

const PaymentMethodButton = ({
    children,
    active = false,
    onClick,
}: {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex-1 h-8 px-2 rounded-sm text-[10px] font-black uppercase transition-all duration-75 border 
            relative inline-flex items-center justify-center select-none active:scale-95
            ${active
                ? "bg-teal-600 border-teal-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-teal-500"
            }`}
    >
        <div className="flex items-center justify-center gap-1">
            {active && (
                <svg
                    className="w-3 h-3 shrink-0 animate-in fade-in zoom-in duration-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            )}
            <span className="leading-[0] mt-[1px]">{children}</span>
        </div>
    </button>
);

export default PaymentMethodButton;