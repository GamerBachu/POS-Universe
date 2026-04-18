import { useState } from "react";
import AdjustmentModal from "./AdjustmentModal";
import type { TAdjustmentCategory } from "@/types/terminal1";
import { PercentageIcon, PlusIcon } from "@/libs/icons";
import { useLanguage } from "@/contexts/language";


const AdjustmentButtons = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<TAdjustmentCategory | undefined>();
    const { t } = useLanguage();

    const onAddDiscount = () => {
        setIsOpen(true);
        setTitle(t("pos_t1.title_add_discount"));
        setCategory("DISCOUNT");
    };
    const onAddServiceCharge = () => {
        setIsOpen(true);
        setTitle(t("pos_t1.title_add_service_charge"));
        setCategory("CHARGE");
    };
    const onClose = () => {
        setIsOpen(false);
        setTitle("");
        setCategory(undefined);
    };

    return (
        <>
            <div className="flex gap-2 w-full">
                {/* Add Discount Button (Amber) */}
                <button
                    type="button"
                    onClick={onAddDiscount}
                    className="flex-1 h-9 px-2 rounded-sm border border-amber-200 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-500 text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:bg-amber-100"
                >
                    <PercentageIcon className="w-3.5 h-3.5" />
                    <span>{t("pos_t1.btn_add_discount")}</span>
                </button>

                {/* Add Service Charge Button (Indigo) */}
                <button
                    type="button"
                    onClick={onAddServiceCharge}
                    className="flex-1 h-9 px-2 rounded-sm border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:bg-indigo-100"
                >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>{t("pos_t1.btn_service_charge")}</span>
                </button>
            </div>
            <AdjustmentModal
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                category={category}
            />
        </>
    );
};

export default AdjustmentButtons;
