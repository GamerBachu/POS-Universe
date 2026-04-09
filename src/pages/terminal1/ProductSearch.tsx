import { useState } from "react";
import NumpadButton from "./NumpadButton";
import type { IProductFilter } from "@/types/product";
import { NUMPAD_KEYS, isInitialFilter } from "./utils";
import {
    BackspaceIcon,
    CheckIcon,
    CloseIcon,
    FilterIcon,
    SearchIcon,
} from "@/libs/icons";
import { useLanguage } from "@/contexts/language";
import Input from "@/components/Input";
import Button from "@/components/Button";
import InputWithLabel from "@/components/InputWithLabel";

type ProductSearchProps = {
    inputCode: string;
    onInputType: (val: string) => void;
    onNumpad: (val: string) => void;
    filter: IProductFilter;
    setFilter: (val: IProductFilter) => void;
    resetFilter: () => void;
};

const ProductSearch = ({
    inputCode,
    onInputType,
    onNumpad,
    filter,
    setFilter,
    resetFilter,
}: ProductSearchProps) => {
    const { t } = useLanguage();
    const [showFilter, setShowFilter] = useState<boolean>(false);

    // The search is considered "active" (isSearching) if the current filter
    // differs from the initial default state.
    const isSearching = !isInitialFilter(filter);

    return (
        <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1.5">
                    {/* 1. Search Input Container */}
                    <div className="relative flex-1 group">
                        <Input
                            type="text"
                            placeholder={t("pos_t1.ph_search_item")}
                            value={inputCode}
                            onChange={(e) => onInputType(e.target.value)}
                            className="w-full pr-9 py-2 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-teal-500"
                        />
                        {inputCode && (
                            <button
                                type="button"
                                onClick={() => onInputType("")}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 transition-all active:scale-90"
                            >
                                <CloseIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Search Button with Pulse Indicator */}
                        <button
                            type="button"
                            className={`relative flex items-center justify-center w-9 h-9 border rounded transition-all active:scale-90 shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500`}
                        >
                            <SearchIcon className="w-4 h-4" />
                        </button>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            type="button"
                            className={`relative flex items-center justify-center w-9 h-9 border rounded transition-all active:scale-90 shadow-sm ${showFilter
                                ? "border-teal-600 text-white"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500"
                                }`}
                        >
                            <FilterIcon className="w-4 h-4" />
                            {isSearching && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500 animate-pulse border border-white dark:border-gray-800" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Transition Wrapper */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out border-b border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10 ${showFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none border-none"
                    }`}
            >
                <div className="p-3 space-y-3">
                    <InputWithLabel
                        label={t("product_inventory.name")}
                        value={filter.name ?? ""}
                        name="name"
                        placeholder={t("product_inventory.ph_name")}
                        onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <InputWithLabel
                            label={t("product_inventory.sku")}
                            value={filter.sku ?? ""}
                            name="sku"
                            placeholder={t("product_inventory.ph_sku")}
                            onChange={(e) => setFilter({ ...filter, sku: e.target.value })}
                        />

                        <InputWithLabel
                            label={t("product_inventory.barcode")}
                            value={filter.barcode ?? ""}
                            name="barcode"
                            placeholder={t("product_inventory.ph_barcode")}
                            onChange={(e) => setFilter({ ...filter, barcode: e.target.value })}
                        />
                    </div>

                    <InputWithLabel
                        label={t("product_inventory.selling_price")}
                        value={filter.sellingPrice ?? ""}
                        name="sellingPrice"
                        placeholder={t("product_inventory.selling_price")}
                        classBox=""
                        required={true}
                        type="number"
                        onChange={(e) =>
                            setFilter({
                                ...filter,
                                sellingPrice:
                                    e.target.value === ""
                                        ? undefined
                                        : parseFloat(e.target.value),
                            })
                        }
                    />

                    <div className="flex gap-2 justify-end pt-1">
                        <Button
                            onClick={resetFilter}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 py-1.5 px-4 text-xs font-bold uppercase"
                        >
                            {t("common.reset")}
                        </Button>
                        <Button
                            onClick={() => setShowFilter(false)}
                            className="bg-teal-600 hover:bg-teal-700 py-1.5 px-6 text-xs font-bold uppercase"
                        >
                            {t("common.search")}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Numpad Section: Only shows when filter is closed */}
            {!showFilter && (
                <div className="p-3 grid grid-cols-3 gap-2 flex-1 content-start overflow-y-auto scrollbar-hide animate-in fade-in duration-500">
                    {NUMPAD_KEYS.map((val: string) =>
                        val === "-1" ? (
                            <NumpadButton
                                key="backspace"
                                onClick={() => onNumpad(val)}
                                className="text-red-500 dark:text-red-400 active:bg-red-500"
                            >
                                <BackspaceIcon className="w-6 h-6 stroke-[3]" />
                            </NumpadButton>
                        ) : val === "-2" ? (
                            <NumpadButton
                                key="check"
                                onClick={() => onNumpad(val)}
                                className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 active:bg-teal-600"
                            >
                                <CheckIcon className="w-7 h-7 stroke-[3]" />
                            </NumpadButton>
                        ) : (
                            <NumpadButton key={val} onClick={() => onNumpad(val)}>
                                {val}
                            </NumpadButton>
                        ),
                    )}
                </div>
            )}
        </>
    );
};

export default ProductSearch;