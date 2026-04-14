import { useCallback, useEffect, useState } from "react";
import { displayPrice } from "@/utils/helper/numberUtils";
import { useLanguage } from "@/contexts/language";
import { reportApi } from "@/api";
import type { ITopSellingProduct } from "@/types/reports";
import Loader from "@/components/Loader";
import { LoggerUtils } from "@/utils";

const TopSelling = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ITopSellingProduct[]>([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getTopSellingData(5);
            if (res.success && res.data) {
                setData(res.data);
            } else {
                setData([]);
                LoggerUtils.logError(res, "TopSelling", "fetchData", "API response error");
                setError(t("common.no_record"));
            }
        } catch (err) {
            setData([]);
            LoggerUtils.logCatch(err, "TopSelling", "fetchData");
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {t("reports.top_selling_title")}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.top_selling_desc")}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.top_selling_question")}
                </p>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 dark:hover:scrollbar-thumb-gray-600">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader />
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
                    data.map((item, i) => (
                        <div key={item.productId} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex-shrink-0 flex items-center justify-center font-black text-gray-400 text-xs group-hover:text-teal-500 transition-colors">
                                {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-800 dark:text-white truncate uppercase tracking-tight">
                                    {item.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-1.5 py-0.5 rounded uppercase">
                                        {item.soldCount} {t("reports.sold")}
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                                        {t("reports.total_volume")}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right tabular-nums text-xs font-black text-gray-700 dark:text-gray-300">
                                {displayPrice(item.totalRevenue)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopSelling;
