import { useMemo } from "react";
import OrderItem from "./OrderItem";
import { useTerminalState, useTerminalDispatch } from "./TerminalContext";
import { displayPrice } from "@/utils/helper/numberUtils";
import type { ICartItem } from "@/types/terminal1";
import { calculateFinalPrice } from "./utils";

const SectionLeft = () => {
    const state = useTerminalState();
    const dispatch = useTerminalDispatch();
    const { cart, adjustment = [] } = state;

    const totals = useMemo(() => {
        // 1. Calculate base Subtotal
        const subtotal = cart.reduce(
            (sum, item) => sum + calculateFinalPrice(item.product) * item.quantity, 0
        );

        // 2. Calculate Adjustment Total directly
        const adjustmentTotal = adjustment.reduce((sum, adj) => {
            const amount = adj.valueType === 'PERCENT'
                ? (subtotal * adj.value) / 100
                : adj.value;

            return adj.category === 'DISCOUNT' ? sum - amount : sum + amount;
        }, 0);

        return {
            subtotal,
            totalPayable: subtotal + adjustmentTotal,
            totalQty: cart.reduce((sum, item) => sum + item.quantity, 0),
            lineCount: cart.length,
        };
    }, [cart, adjustment]);

    const handleRemoveAdjustment = (rowId: string) => {
        dispatch({ type: "REMOVE_ADJUSTMENT", rowId });
    };

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
                        {cart.length === 0 && adjustment.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-2 text-center text-gray-400">No items</td>
                            </tr>
                        ) : (
                            cart.map((item: ICartItem) => (
                                <OrderItem key={item.rowId} item={item} />
                            ))
                        )}
                    </tbody>
                    {(cart.length > 0 || adjustment.length > 0) && (
                        /* FIXED: bg-white / bg-gray-900 (Non-transparent) */
                        <tfoot className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-10">
                            <tr className="font-bold text-gray-600 dark:text-gray-300">
                                <td className="p-2">Items: {totals.lineCount}</td>
                                <td className="p-2 text-center" colSpan={2}>Qty: {totals.totalQty}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* Financial Summary Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40 p-3 space-y-2">

                {/* Subtotal - Always visible above the scroll area */}
                <div className="flex justify-between items-center font-bold text-xs uppercase tracking-wider text-gray-500">
                    <span>Subtotal</span>
                    <span>{displayPrice(totals.subtotal)}</span>
                </div>

                {/* Adjustments List - Fixed to 3 rows max */}
                <div className="space-y-2 max-h-[96px] overflow-y-auto custom-scrollbar pr-1">
                    {adjustment.length > 0 && adjustment.map((adj) => {
                        const displayAmount = adj.valueType === 'PERCENT'
                            ? (totals.subtotal * adj.value) / 100
                            : adj.value;

                        return (
                            <div key={adj.rowId} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAdjustment(adj.rowId)}
                                        className="w-6 h-6 rounded-md flex items-center justify-center bg-white dark:bg-gray-600 shadow-sm border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 hover:text-red-500 transition-all active:scale-90 flex-shrink-0"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>

                                    </button>
                                    <span className="font-bold text-xs text-gray-800 dark:text-gray-200 line-clamp-1">
                                        {adj.label}
                                    </span>
                                </div>
                                <span className={`font-bold text-xs flex-shrink-0 ${adj.category === 'DISCOUNT' ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'
                                    }`}>
                                    {adj.category === 'DISCOUNT' ? '-' : '+'}{displayPrice(displayAmount)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Total Footer */}
            <div className="p-3 bg-teal-600 text-white ">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-80 uppercase">Total Payable</span>
                    <span className="text-xl font-black">{displayPrice(totals.totalPayable)}</span>
                </div>
            </div>
        </section>
    );
};

export default SectionLeft;