import NumpadButton from "./NumpadButton";
import type { IProductFilter } from "@/types/product";
import { NUMPAD_KEYS } from "./utils";

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
    return (
        <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search item..."
                        value={inputCode}
                        onChange={(e) => onInputType(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs bg-gray-100 dark:bg-gray-700 border-none rounded-sm focus:ring-1 focus:ring-teal-500 transition-all"
                    />
                    <svg
                        className="absolute left-2 top-2 h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="p-3 grid grid-cols-3 gap-2 flex-1 content-center">
                {NUMPAD_KEYS.map((val) => (
                    <NumpadButton
                        key={val}
                        className={
                            val === "⌫"
                                ? "bg-red-50 dark:bg-red-900/20 text-red-600"
                                : val === "↵"
                                    ? "bg-teal-600 text-white"
                                    : ""
                        }
                        onClick={() => onNumpad(val)}
                    >
                        {val}
                    </NumpadButton>
                ))}
            </div>
        </>
    );
};

export default ProductSearch;
