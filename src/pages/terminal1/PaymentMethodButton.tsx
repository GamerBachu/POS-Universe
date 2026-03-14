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
        className={`flex-1 p-2 rounded-sm text-[10px] font-black uppercase transition-all duration-75 border inline-flex items-center justify-center gap-1.5  active:scale-95 select-none
            ${active
                ? "bg-teal-600 border-teal-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-teal-500 hover:text-teal-500"
            }`}
    >
        {active && (
            <svg
                className="w-3.5 h-3.5 shrink-0 animate-in zoom-in duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="4"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        )}
        <span className="leading-none">{children}</span>
    </button>
);

export default PaymentMethodButton;