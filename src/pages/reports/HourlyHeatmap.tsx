import { useCallback, useEffect, useState } from "react";
import { useLanguage } from '@/contexts/language';
import { reportApi } from '@/api';
import type { IHourlyHeatmapItem } from '@/types/reports';
import Loader from '@/components/Loader';
import { LoggerUtils } from "@/utils";

const HourlyHeatmap = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IHourlyHeatmapItem[]>([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getHourlyHeatmapData();
            if (res.success && res.data) {
                setData(res.data);
            } else {
                setData([]);
                LoggerUtils.logError(res, "HourlyHeatmap", "fetchData", "API response error");
                setError(t("common.no_record"));
            }
        } catch (err) {
            setData([]);
            LoggerUtils.logCatch(err, "HourlyHeatmap", "fetchData");
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {t("reports.hourly_heatmap_title")}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.hourly_heatmap_desc")}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.hourly_heatmap_question")}
                </p>
            </div>

            <div className="grid grid-cols-6 gap-1.5 flex-1 content-center">
                {isLoading ? (
                    <div className="col-span-6 flex items-center justify-center"><Loader /></div>
                ) : error ? (
                    <div className="col-span-6 flex items-center justify-center text-[10px] uppercase font-bold text-red-500">{error}</div>
                ) : (
                    data.map((item) => (
                        <div
                            key={item.hour}
                            title={`${item.count} ${t("reports.total_orders")}`}
                            className={`h-10 rounded-sm flex items-center justify-center text-[9px] font-black tabular-nums transition-all border border-transparent
                                ${item.intensity > 0.7 ? "bg-teal-600 text-white" :
                                    item.intensity > 0.3 ? "bg-teal-400 text-white" :
                                        item.intensity > 0 ? "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300" :
                                            "bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-700"}`}
                        >
                            {item.hour.toString().padStart(2, '0')}h ({item.count})
                        </div>
                    ))
                )}
            </div>

            <p className="mt-4 text-[10px] text-gray-400 italic font-bold uppercase tracking-tight">
                {t("reports.peak_hours_hint")}
            </p>
        </div>
    );
};

export default HourlyHeatmap;