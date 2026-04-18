import { useCallback, useEffect, useState } from "react";
import { displayPrice } from "@/utils/helper/numberUtils";
import { useLanguage } from "@/contexts/language";
import { reportApi } from "@/api";
import type { IRecentTransaction } from "@/types/reports";
import Loader from "@/components/Loader";
import { LoggerUtils } from "@/utils";
import OrderStatusLabel from "../terminal1Order/OrderStatusLabel";
import type { IOrder } from "@/types/orders";
import { getIsDangerousAction } from "../terminal1Order/utils";

const RecentTransactions = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IRecentTransaction[]>([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getRecentTransactions(5);
            if (res.success && res.data) {
                setData(res.data);
            } else {
                setData([]);
                LoggerUtils.logError(
                    res,
                    "RecentTransactions",
                    "fetchData",
                    "API response error",
                );
                setError(t("common.no_record"));
            }
        } catch (err) {
            setData([]);
            LoggerUtils.logCatch(err, "RecentTransactions", "fetchData");
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-gray-600">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                       <Loader label={t("common.loading")} />
                    </div>
                ) : error ? (
                    <div className="h-full flex items-center justify-center text-[10px] uppercase font-bold text-red-500 text-center p-4">
                        {error}
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] uppercase font-bold text-gray-400">
                        {t("common.no_record")}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-3 rounded-md border border-gray-50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20 hover:border-teal-200 dark:hover:border-teal-900 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Minimal Status Indicator */}
                                    <div
                                        className={`w-1.5 h-8 rounded-full ${getIsDangerousAction(tx.status) === true ? "bg-red-500" : "bg-teal-500"}`}
                                    />

                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight">
                                            {tx.orderNumber}
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                            <span>{tx.createdAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p
                                        className={`text-sm font-bold tabular-nums ${getIsDangerousAction(tx.status) === true ? "text-red-500 line-through" : "text-gray-900 dark:text-white"}`}
                                    >
                                        {displayPrice(tx.grandTotal)}
                                    </p>
                                    <OrderStatusLabel order={tx as IOrder} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;
