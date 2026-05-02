import React, { useEffect, useState } from "react";
import { TAdjustmentCategory, type IAdjustment } from "@/types/terminal1";
import { generateGuidV2 } from "@/utils/helper/guid";
import { useTerminalDispatch } from "./TerminalContext";
import { useLanguage } from "@/contexts/language";
import Modal from "@/components/Modal";
import { TextBoxWithLabel } from "@/components/input";
import { PrimaryButton, SecondaryButton } from "@/components/button";

interface AdjustmentModalProps {
    isOpen: boolean;
    title: string;
    category: TAdjustmentCategory | undefined;
    onClose: () => void;
}

const AdjustmentModal = ({
    isOpen,
    title,
    category,
    onClose,
}: AdjustmentModalProps) => {
    const dispatch = useTerminalDispatch();
    const { t } = useLanguage();

    const [label, setLabel] = useState("");
    const [value, setValue] = useState("");
    const [valueType, setValueType] = useState<"PERCENT" | "FIXED">("PERCENT");

    // Keyboard Shortcuts Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                // 3. Reset and Close
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    // Using React.FormEvent explicitly or handling via button click
    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (category === undefined) return;

        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return;

        // 1. Create the adjustment object
        const finalLabel = (label || category).toUpperCase();
        const adjustment: IAdjustment = {
            rowId: `ADJ-${generateGuidV2()}`,
            category: category,
            label: finalLabel,
            value: numericValue,
            valueType: valueType,
        };

        // 2. Dispatch the action
        dispatch({ type: "ADD_ADJUSTMENT", adjustment });

        // 3. Reset and Close
        setLabel("");
        setValue("");
        onClose();
    };

    return (
        <Modal className="w-full max-w-sm" title={title} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div className="space-y-3">
                    <TextBoxWithLabel
                        label={t("pos_t1.label")}
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder={t("pos_t1.ph_label")}
                    />

                    {/* Value & Type Toggle */}
                    <div className="flex gap-2">
                        <div className="flex-[2]">
                            <TextBoxWithLabel
                                label={
                                    t("pos_t1.value") +
                                    ` (${valueType === "PERCENT" ? "%" : t("pos_t1.txt_fix")})`
                                }
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                                {t("pos_t1.unit")}
                            </label>
                            <div
                                className="flex mt-1 bg-gray-100 dark:bg-gray-900 px-2.5 py-2.5  rounded border border-gray-200 dark:border-gray-700 h-11">
                                <button
                                    type="button"
                                    onClick={() => setValueType("PERCENT")}
                                    className={`flex-1 text-xs font-black rounded transition-all ${valueType === "PERCENT" ? "bg-white dark:bg-gray-700 shadow-sm text-teal-600" : "text-gray-400"}`}
                                >
                                    %
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValueType("FIXED")}
                                    className={`flex-1 text-xs font-black rounded transition-all ${valueType === "FIXED" ? "bg-white dark:bg-gray-700 shadow-sm text-teal-600" : "text-gray-400"}`}
                                >
                                    {t("pos_t1.txt_fix")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 pt-2">
                    <SecondaryButton
                        onClick={onClose}
                        title={t("common.cancel")}
                    >
                        {t("common.cancel")}
                    </SecondaryButton>
                    <PrimaryButton
                        title={t("common.add")}
                        type="submit"
                    >
                        {t("common.add")}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};
export default AdjustmentModal;
