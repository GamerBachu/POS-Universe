import type { CartItem } from "@/types/terminal1";
import { displayPrice } from "@/utils/helper/numberUtils";
import { useTerminalDispatch } from "./TerminalContext";
import { calculateFinalPrice } from "./utils";


type OrderItemProps = {
    item: CartItem;
};

const OrderItem = ({ item }: OrderItemProps) => {
    const dispatch = useTerminalDispatch();

    const handleIncrement = () => {
        dispatch({
            type: "ADD_ITEM",
            item: {
                id: 0,
                rowId: item.rowId, // Keep the same rowId to update existing line
                product: item.product,
            }
        });
    };

    const handleDecrement = () => {
        dispatch({
            type: "REMOVE_ITEM",
            item: {
                id: 0,
                rowId: item.rowId,
                product: item.product,
            }
        });
    };

    return (
        <tr className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors">
            <td className="p-2 py-3">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                        {item.product.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {item.product.code}
                    </span>
                </div>
            </td>

            <td className="py-2 px-1">
                <div className="flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-fit mx-auto">
                    {/* Minus Button */}
                    <button
                        onClick={handleDecrement}
                        className="w-6 h-6 rounded-md flex items-center justify-center bg-white dark:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:text-red-500 hover:border-red-200 dark:hover:text-red-400 transition-all active:scale-90"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" />
                        </svg>
                    </button>

                    <span className="w-6 text-center font-black text-sm text-gray-700 dark:text-gray-200">
                        {item.quantity}
                    </span>

                    {/* Plus Button */}
                    <button
                        onClick={handleIncrement}
                        className="w-6 h-6 rounded-md flex items-center justify-center bg-teal-600 shadow-sm text-white hover:bg-teal-700 transition-all active:scale-90"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
            </td>

            <td className="py-2 px-1 text-right font-black text-gray-700 dark:text-gray-200">
                {displayPrice(calculateFinalPrice(item.product) * item.quantity)}
            </td>
        </tr>
    );
};

export default OrderItem;