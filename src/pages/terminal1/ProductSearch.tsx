import NumpadButton from "./NumpadButton";
import type { IProductFilter } from "@/types/product";
import { NUMPAD_KEYS } from "./utils";
import { BackspaceIcon, CheckIcon, CloseIcon, SearchIcon } from "@/libs/icons";
import { useLanguage } from "@/contexts/language";
import Input from "@/components/Input";

type ProductSearchProps = {
    inputCode: string;
    onInputType: (val: string) => void;

    onNumpad: (val: string) => void;

    filter: IProductFilter;
    setFilter: (val: IProductFilter) => void;
};

const ProductSearch = ({
    inputCode,
    onInputType,
    onNumpad,
    filter,
    setFilter,
}: ProductSearchProps) => {
    const { t } = useLanguage();
    return (
        <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="relative group flex items-center">
                    <div className="absolute left-2.5 flex items-center justify-center pointer-events-none">
                        <SearchIcon className="w-3 h-3" />
                    </div>

                    <Input
                        type="text"
                        placeholder={t("pos_t1.ph_search_item")}
                        value={inputCode}
                        onChange={(e) => onInputType(e.target.value)}
                        className="pl-9 pr-9 py-2"
                    />

                    {inputCode && (
                        <button
                            type="button"
                            onClick={() => onInputType("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-90"
                        >
                            <CloseIcon className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Middle Section: Stays at the top and scrolls if content overflows */}
            <div className="p-3 grid grid-cols-3 gap-2 flex-1 content-start overflow-y-auto scrollbar-hide">
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
                        <NumpadButton
                            key={val}
                            className={""}
                            onClick={() => onNumpad(val)}
                        >
                            {val}
                        </NumpadButton>
                    ),
                )}
            </div>
        </>
    );
};

export default ProductSearch;