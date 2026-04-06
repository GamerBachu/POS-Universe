import { useState } from "react";
import { useTerminalState } from "./TerminalContext";
import CustomerForm from "./CustomerForm";
import { PersonCircleIcon } from "@/libs/icons";
import { useLanguage } from "@/contexts/language";


const CustomerLink = () => {
    const state = useTerminalState();
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const walkInCustomerText = "Walk-in Customer";

    return (
        <>
            <div className="px-4 py-2 bg-gray-50/80 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-teal-500 text-gray-400 hover:text-teal-500 transition-all shadow-sm active:scale-90"
                    >
                        <PersonCircleIcon className="w-4 h-4" />
                    </button>
                    <div
                        className="flex-1 cursor-pointer group"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <p className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-teal-500 transition-colors">
                            {t("pos_t1.lbl_customer")}
                        </p>
                        <p className="text-[12px] font-black text-gray-700 dark:text-gray-200 truncate">
                            {state.customer?.name || walkInCustomerText}
                        </p>
                    </div>
                </div>
            </div>
            {isModalOpen && <CustomerForm onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default CustomerLink;
