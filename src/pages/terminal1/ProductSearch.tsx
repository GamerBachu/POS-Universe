import { useState } from "react";
import NumpadButton from "./NumpadButton";
import type { IProductFilter } from "@/types/product";
import { NUMPAD_KEYS, isInitialFilter } from "./utils";
import {
    BackspaceIcon,
    CheckIcon,
    FilterIcon,
    SearchIcon,
} from "@/libs/icons";
import { useLanguage } from "@/contexts/language";
import { TextBoxWithLabel } from "@/components/input";

import { IconButton, PrimaryButton, SecondaryButton, TextBoxClearButton } from "@/components/button";

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

    // The search is considered "active" (isFilterApply) if the current filter
    // differs from the initial default state.
    const isFilterApply = !isInitialFilter(filter);

    return (
        <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-1.5">
                    {/* 1. Search Input Container */}
                    <div className="relative flex-1 group">
                        <TextBoxWithLabel
                            label=""
                            placeholder={t("pos_t1.ph_search_item")}
                            value={inputCode}
                            onChange={(e) => onInputType(e.target.value)}
                        />
                        {inputCode && (
                            <TextBoxClearButton
                                onClick={() => onInputType("")}
                                title={t("common.clear")} />
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <IconButton
                            icon={<SearchIcon className="w-4 h-4" />}
                            title={t("common.search")}
                        ></IconButton>
                        <IconButton
                            icon={<FilterIcon className="w-4 h-4" />}
                            title={t("common.filter")}
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            {isFilterApply && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500 animate-pulse border border-white dark:border-gray-800" />
                            )}
                        </IconButton>
                    </div>
                </div>
            </div>

            {/* Transition Wrapper */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out border-b border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10 ${showFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none border-none"
                    }`}
            >
                <div className="p-2 space-y-2">
                    <TextBoxWithLabel
                        label=""
                        value={filter.name ?? ""}
                        name="name"
                        placeholder={t("product_inventory.ph_name")}
                        onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <TextBoxWithLabel
                            label=""
                            value={filter.sku ?? ""}
                            name="sku"
                            placeholder={t("product_inventory.sku")}
                            onChange={(e) => setFilter({ ...filter, sku: e.target.value })}
                        />

                        <TextBoxWithLabel
                            label=""
                            value={filter.barcode ?? ""}
                            name="barcode"
                            placeholder={t("product_inventory.barcode")}
                            onChange={(e) => setFilter({ ...filter, barcode: e.target.value })}
                        />
                    </div>

                    <TextBoxWithLabel
                        label=""
                        value={filter.sellingPrice ?? ""}
                        name="sellingPrice"
                        placeholder={t("product_inventory.selling_price")}
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
                        <SecondaryButton
                            onClick={resetFilter}
                            title={t("common.reset")}
                        >
                            {t("common.reset")}
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={() => setShowFilter(false)}
                            title={t("common.save")}

                        >
                            {t("common.search")}
                        </PrimaryButton>
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