
import { NavLink } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { type IOrder } from "@/types/orders";
import { displayPrice } from "@/utils/helper/numberUtils";
import { useLanguage } from "@/contexts/language";
import useCurrencySymbol from "@/hooks/useCurrencySymbol";
import { toDisplayString } from "@/utils/helper/dateUtils";
import OrderStatusLabel from "./OrderStatusLabel";


interface Props {
    item: IOrder;
}

const OrderTableRow: React.FC<Props> = ({ item }) => {
    const { t } = useLanguage();
    const currencySymbol = useCurrencySymbol();

    const editPath = `${PATHS.TERMINAL_1_EDIT}/${item.id}`;


    return (
        <tr className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">

            <td className="p-3">
                <NavLink
                    to={editPath}
                    className="text-xs text-gray-400 dark:text-gray-500 hover:text-blue-600 transition-colors hover:underline"
                >
                    {item.id}
                </NavLink>
            </td>


            <td className="p-3">
                <div className="flex flex-col">
                    <NavLink
                        to={editPath}
                        className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px] hover:text-blue-600 transition-colors underline"
                        title={item.orderNumber}
                    >
                        {item.orderNumber}
                    </NavLink>
                    <span className="text-[10px] uppercase ">{item.id}</span>
                </div>
            </td>

            <td className="p-3 text-sm text-right font-medium text-gray-700 dark:text-gray-200">
                {toDisplayString(item.createdAt)}
            </td>

            {/* Selling Price - Formatted */}
            <td className="p-3 text-sm text-right font-medium text-gray-700 dark:text-gray-200">
                {currencySymbol}
                {displayPrice(item.grandTotal)}
            </td>



            {/* Active/Inactive Status */}
            <td className="p-3 text-center">
                <OrderStatusLabel order={item} />
            </td>

            {/* Small Action Button Group */}
            <td className="p-3 text-right">
                <div className="inline-flex items-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <NavLink
                        to={`${PATHS.TERMINAL_1_VIEW}/${item.id}`}
                        className="px-2 py-1 text-[11px] font-bold uppercase text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors"
                    >
                        {t("common.view")}
                    </NavLink>
                    <NavLink
                        to={`${PATHS.TERMINAL_1_DELETE}/${item.id}`}
                        className="px-2 py-1 text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-r border-gray-200 dark:border-gray-700 transition-colors"
                    >
                        {t("common.edit")}
                    </NavLink>
                </div>
            </td>
        </tr>
    );
};

export default OrderTableRow;