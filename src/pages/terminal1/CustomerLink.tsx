import { useState } from "react";
import { useTerminalState } from "./TerminalContext";
import CustomerForm from "./CustomerForm";
import { WALK_IN_CUSTOMER_TEXT } from "./utils";

const CustomerLink = () => {
    const state = useTerminalState();

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="px-4 py-2 bg-gray-50/80 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-teal-500 text-gray-400 hover:text-teal-500 transition-all shadow-sm active:scale-90"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </button>
                    <div
                        className="flex-1 cursor-pointer group"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <p className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-teal-500 transition-colors">
                            Customer
                        </p>
                        <p className="text-[12px] font-black text-gray-700 dark:text-gray-200 truncate">
                            {state.customer?.name || WALK_IN_CUSTOMER_TEXT}
                        </p>
                    </div>
                </div>
            </div>
            {isModalOpen && <CustomerForm onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default CustomerLink;
