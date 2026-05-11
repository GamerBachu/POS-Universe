import type { ICartItem } from "@/types/terminal1";
import { displayPrice } from "@/utils/helper/numberUtils";
import { useTerminalDispatch } from "./TerminalContext";
import { calculateFinalPrice } from "@/utils/financial";
import PlusIcon from "@/libs/icons/PlusIcon";
import { MinusIcon } from "@/libs/icons";
import { OutlineButton } from "@/components/button";
import { useLanguage } from "@/contexts/language";


type OrderItemProps = {
    item: ICartItem;
};

const OrderItem = ({ item }: OrderItemProps) => {
    const dispatch = useTerminalDispatch();
    const { t } = useLanguage();
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
                    <OutlineButton
                        variant="secondary"
                        onClick={handleDecrement}
                        className="w-5 h-5 hover:text-red-500 hover:border-red-200 dark:hover:text-red-400"
                        icon={<MinusIcon className="w-3 h-3" />}
                        title={t("common.remove")}
                    >
                    </OutlineButton>

                    <span className="w-6 text-center font-black text-sm text-gray-700 dark:text-gray-200">
                        {item.quantity}
                    </span>

                    {/* Plus Button */}
                    <OutlineButton
                        variant="primary"
                        onClick={handleIncrement}
                        className="w-5 h-5"
                        icon={<PlusIcon className="w-3 h-3" />}
                        title={t("common.add")}
                    >

                    </OutlineButton>
                </div>
            </td>

            <td className="py-2 px-1 text-right font-black text-gray-700 dark:text-gray-200">
                {displayPrice(calculateFinalPrice(item.product) * item.quantity)}
            </td>
        </tr>
    );
};

export default OrderItem;