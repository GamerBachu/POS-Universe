import { useLanguage } from "@/contexts/language";
import { displayPrice } from "@/utils/helper/numberUtils";

const RecentTransactions = () => {
    const { t } = useLanguage();

    // Static Sample Data
    const transactions = [
        { id: 1, orderNo: "ORD-9921", time: "14:20", amount: 125.50, status: "completed", type: "Cash" },
        { id: 2, orderNo: "ORD-9920", time: "14:15", amount: 45.00, status: "completed", type: "Card" },
        { id: 3, orderNo: "ORD-9919", time: "14:02", amount: 89.99, status: "voided", type: "UPI" },
        { id: 4, orderNo: "ORD-9918", time: "13:45", amount: 210.00, status: "completed", type: "Card" },
        { id: 5, orderNo: "ORD-9917", time: "13:30", amount: 12.50, status: "completed", type: "Cash" },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 transition-colors flex flex-col">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {t("reports.recent_transactions_title")}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.recent_transactions_desc")}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.recent_transactions_question")}
                </p>
            </div>

            {/* Transaction List */}
            <div className="flex-1 overflow-y-auto pr-1 -mr-1 scrollbar-thin">
                <div className="space-y-2">
                    {transactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between p-3 rounded-md border border-gray-50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20 hover:border-teal-200 dark:hover:border-teal-900 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                {/* Minimal Status Indicator */}
                                <div className={`w-1.5 h-8 rounded-full ${tx.status === 'voided' ? 'bg-red-500' : 'bg-teal-500'}`} />

                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight">
                                        {tx.orderNo}
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                        <span>{tx.time}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="uppercase">{tx.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`text-sm font-bold tabular-nums ${tx.status === 'voided' ? 'text-red-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                    {displayPrice(tx.amount)}
                                </p>
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${tx.status === 'voided' ? 'text-red-400' : 'text-teal-500'}`}>
                                    {t(`common.${tx.status}`)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Summary Footer */}
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                    <span>{t("reports.total_shown")}</span>
                    <span className="text-gray-900 dark:text-white tabular-nums">5 {t("common.orders")}</span>
                </div>
            </div>
        </div>
    );
};

export default RecentTransactions;