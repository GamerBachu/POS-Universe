import React, { useEffect, useState } from "react";
import { TAdjustmentCategory, type IAdjustment } from "@/types/terminal1";
import { generateGuidV2 } from "@/utils/helper/guid";
import { useTerminalDispatch } from "./TerminalContext";


interface AdjustmentModalProps {
    isOpen: boolean;
    title: string;
    category: TAdjustmentCategory | undefined;
    onClose: () => void;
}


const AdjustmentModal = ({ isOpen, title, category, onClose }: AdjustmentModalProps) => {
    const dispatch = useTerminalDispatch();

    const [label, setLabel] = useState("");
    const [value, setValue] = useState("");
    const [valueType, setValueType] = useState<'PERCENT' | 'FIXED'>('PERCENT');

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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[1px]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-150">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300">
                            {title}
                        </h3>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    <div className="space-y-3">

                        {/* Label */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Label</label>
                            <input
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="e.g. Seasonal Discount"
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500"
                            />
                        </div>

                        {/* Value & Type Toggle */}
                        <div className="flex gap-2">
                            <div className="flex-[2]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Value ({valueType === 'PERCENT' ? '%' : 'FIX'})</label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none focus:border-teal-500 font-mono font-bold"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Unit</label>
                                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded border border-gray-200 dark:border-gray-700 h-[38px]">
                                    <button
                                        type="button"
                                        onClick={() => setValueType('PERCENT')}
                                        className={`flex-1 text-[9px] font-black rounded transition-all ${valueType === 'PERCENT' ? 'bg-white dark:bg-gray-700 shadow-sm text-teal-600' : 'text-gray-400'}`}
                                    >%</button>
                                    <button
                                        type="button"
                                        onClick={() => setValueType('FIXED')}
                                        className={`flex-1 text-[9px] font-black rounded transition-all ${valueType === 'FIXED' ? 'bg-white dark:bg-gray-700 shadow-sm text-teal-600' : 'text-gray-400'}`}
                                    >FIX</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 text-[10px] font-black rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all uppercase"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-2 text-[10px] font-black rounded bg-teal-600 text-white hover:bg-teal-700 transition-all uppercase"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AdjustmentModal;