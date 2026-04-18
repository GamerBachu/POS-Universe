import { useCallback, useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language";
import { displayPrice } from "@/utils/helper/numberUtils";
import { reportApi } from "@/api";
import { LoggerUtils } from "@/utils";
import Loader from "@/components/Loader";
import { AlertError } from "@/components/ActionStatusMessage";
import type { ISalesOverviewReport } from "@/types/reports";

const SalesOverview = () => {
    const { t } = useLanguage();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ISalesOverviewReport | null>(null);

    const fetchData = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await reportApi.getSalesOverviewData();
            if (response.success && response.data) {
                setData(response.data);
            } else {
                setData(null);
                LoggerUtils.logError(response, "SalesOverview", "fetchData", `API error: ${response.message}`);
                setError(response.message || t("common.no_record"));
            }
        } catch (err) {
            setData(null);
            LoggerUtils.logCatch(err, "SalesOverview", "fetchData");
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const chartData = useMemo(() => {
        if (!data || data.weeklySalesTrend.length === 0) return [];
        const maxSales = Math.max(...data.weeklySalesTrend.map(item => item.totalSales));
        return data.weeklySalesTrend.map(item => ({ label: item.dayLabel, value: maxSales > 0 ? (item.totalSales / maxSales) * 100 : 0, price: item.totalSales }));
    }, [data]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 flex flex-col transition-colors">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {t("reports.sales_overview_title")}
                </h3>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {data ? displayPrice(data.totalRevenueLast7Days) : displayPrice(0)}
                </p>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                   <Loader label={t("common.loading")} />
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center">
                    <AlertError message={error} />
                </div>
            ) : (
                <>
                    {/* The Chart "Stage" */}
                    <div className="flex-1 flex items-end justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-2 px-1">
                        {chartData.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                                {/* Tooltip on Hover */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[9px] px-2 py-1 rounded mb-2 absolute translate-y-[-100%] pointer-events-none z-10 font-bold tabular-nums">
                                    {displayPrice(item.price)}
                                </div>
                                
                                {/* The Actual Bar */}
                                <div 
                                    className="w-full bg-teal-500 rounded-t-sm transition-all duration-500 group-hover:bg-teal-400"
                                    style={{ height: `${item.value}%` }}
                                />
                                
                                {/* Label */}
                                <span className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-tighter">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-4 text-[10px] font-bold text-gray-400 uppercase italic">
                        {t("reports.weekly_performance")}
                    </div>
                </>
            )}
        </div>
    );
};

export default SalesOverview; 