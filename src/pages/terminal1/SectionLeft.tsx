import { useMemo } from "react";
import OrderItem from "./OrderItem";
import { useTerminalState } from "./TerminalContext";
import { displayPrice } from "@/utils/helper/numberUtils";
import type { CartItem } from "@/types/terminal1";

const SectionLeft = () => {
    const state = useTerminalState();
    const { cart } = state;

    // Memoized Calculations for Total, Line Count, and Total Quantity
    const totals = useMemo(() => {
        const lineTotal = cart.reduce(
            (sum, item) => sum + item.product.sellingPrice * item.quantity,
            0,
        );

        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        const lineCount = cart.length;

        return {
            totalPayable: displayPrice(lineTotal),
            totalQty,
            lineCount,
        };
    }, [cart]);

    return (
        <section className="w-80 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700 font-bold text-xs uppercase tracking-wider text-gray-500">
                Order Detail
            </div>

            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10">
                        <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            <th className="p-2 font-medium">Item</th>
                            <th className="p-2 font-medium text-center">Qty</th>
                            <th className="p-2 font-medium text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {cart.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-2 text-center text-gray-400">
                                    No items
                                </td>
                            </tr>
                        ) : (
                            cart.map((item: CartItem) => (
                                <OrderItem key={item.rowId} item={item} />
                            ))
                        )}
                    </tbody>
                    {cart.length > 0 && (
                        <tfoot className="sticky bottom-0 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                            <tr className="font-bold text-gray-600 dark:text-gray-300">
                                <td className="p-2">
                                    Items: {totals.lineCount}
                                </td>
                                <td className="p-2 text-center" colSpan={2}>
                                    Qty: {totals.totalQty}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            <div className="p-4 bg-teal-600 text-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-80 uppercase">
                        Total Payable
                    </span>
                    <span className="text-xl font-black">
                        {displayPrice(totals.totalPayable)}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default SectionLeft;
