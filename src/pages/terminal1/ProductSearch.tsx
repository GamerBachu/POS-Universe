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
                <div className="relative group flex items-center">
                    {/* Search Icon (Left) */}
                    <div className="absolute left-2.5 flex items-center justify-center pointer-events-none">
                        <svg
                            className="h-3.5 w-3.5 text-gray-400"
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

                    <input
                        type="text"
                        placeholder="Search item..."
                        value={inputCode}
                        onChange={(e) => onInputType(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 text-xs bg-gray-100 dark:bg-gray-700 border-none rounded-sm focus:ring-1 focus:ring-teal-500 transition-all"
                    />

                    {/* Clear Icon (Right) */}
                    {inputCode && (
                        <button
                            type="button"
                            onClick={() => onInputType("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-90"
                        >
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="p-3 grid grid-cols-3 gap-2 flex-1 content-center">
                {NUMPAD_KEYS.map((val: string) =>
                    val === "-1" ? (
                        //   {/* Backspace Button */ }
                        <NumpadButton
                            onClick={() => onNumpad(val)}
                            className="text-red-500 dark:text-red-400 active:bg-red-500"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M12 19l-7-7 7-7M5 12h14"
                                />
                            </svg>
                        </NumpadButton>
                    ) : val === "-2" ? (
                        //       {/* Enter / Apply Button */}
                        <NumpadButton
                            onClick={() => onNumpad(val)}
                            className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 active:bg-teal-600"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
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
