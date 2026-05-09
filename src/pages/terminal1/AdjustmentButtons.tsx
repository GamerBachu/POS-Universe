import { useState } from "react";
import AdjustmentModal from "./AdjustmentModal";
import type { TAdjustmentCategory } from "@/types/terminal1";
import { PercentageIcon, PlusIcon } from "@/libs/icons";
import { useLanguage } from "@/contexts/language";
import { OutlineButton } from "@/components/button";


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
                <OutlineButton
                    onClick={onAddDiscount}
                    icon={<PercentageIcon className="w-3.5 h-3.5" />}
                    variant="amber"
                    className="!px-2 w-full"
                >
                    {t("pos_t1.btn_add_discount")}
                </OutlineButton>
                {/* Add Service Charge Button (Indigo) */}
                <OutlineButton
                    type="button"
                    onClick={onAddServiceCharge}
                    icon={<PlusIcon className="w-3.5 h-3.5" />}
                    variant="indigo"
                    className="!px-2 w-full"
                >
                    {t("pos_t1.btn_service_charge")}
                </OutlineButton>

            </div >
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
