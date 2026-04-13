import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/language";
import DatePicker from "@/components/DatePicker";
import Button from "@/components/Button";
import SummaryCard from "@/components/SummaryCard";
import { SearchIcon, PrinterIcon, } from "@/libs/icons";
import { getTodayDateString, toISODateString } from "@/utils/helper/dateUtils";
import { displayPrice } from "@/utils/helper/numberUtils";
import { reportApi, } from "@/api";
import { LoggerUtils } from "@/utils";
import Loader from "@/components/Loader";
import { AlertError } from "@/components/ActionStatusMessage";
import PrintService from "@/components/PrintService";
import type { ISalesSummaryData } from "@/types/reports";

const SalesSummary = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reportDate, setReportDate] = useState(getTodayDateString());
    const [data, setData] = useState<ISalesSummaryData | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const printDiv = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        if (!reportDate) return;
        setError(null);
        setIsLoading(true);

        try {
            const response = await reportApi.getSalesSummary(toISODateString(reportDate));
            if (response.success && response.data) {
                setData(response.data);
            } else {
                setData(null);
                LoggerUtils.logError(response, "SalesSummary", "fetchData", `API error: ${response.message}`);
                setError(t("common.error"));
            }
        } catch (err) {
            setData(null);
            LoggerUtils.logCatch(err, "SalesSummary", "fetchData", `date: ${reportDate}`);
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [reportDate, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header Actions */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3">
                <div>
                    <h2 className="font-bold text-gray-800 dark:text-white">
                        {t("reports.sales_summary_title")}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                        {t("reports.sales_summary_desc")}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <DatePicker
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        classInput="h-9"
                    />
                    <Button
                        onClick={fetchData}
                        isLoading={isLoading}
                        className="bg-teal-600 h-9 px-4 gap-2 text-xs font-bold uppercase"
                    >
                        <SearchIcon className="w-4 h-4" />
                        {t("common.search")}
                    </Button>
                    <Button
                        onClick={() => setIsPrinting(true)}
                        disabled={!data || isLoading}
                        className="bg-gray-600 h-9 px-4 gap-2 text-xs font-bold uppercase"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        {t("common.print")}
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center p-10">
                    <Loader />
                </div>
            ) : error ? (
                <div className="p-10">
                    <AlertError message={error} />
                </div>
            ) : data && (
                <div ref={printDiv} className="flex-1 flex flex-col overflow-hidden">
                    {/* Metrics Grid */}
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard
                            label={t("reports.total_revenue")}
                            value={displayPrice(data.totalRevenue)}
                            color="text-teal-600"
                            sub={t("reports.revenue_vs_yesterday")}
                        />
                        <SummaryCard
                            label={t("reports.total_orders")}
                            value={data.totalSales.toString()}
                            color="text-blue-600"
                            sub={t("reports.order_count_ph")}
                        />
                        <SummaryCard
                            label={t("reports.avg_order_value")}
                            value={displayPrice(data.averageOrderValue)}
                            color="text-orange-500"
                            sub={t("reports.aov_ph")}
                        />
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{t("reports.growth_trend")}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className={`text-2xl font-bold tabular-nums ${data.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {data.growth >= 0 ? '+' : ''}{data.growth}%
                                </p>
                                <span className="text-xs">{data.growth >= 0 ? "▲" : "▼"}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">{t("reports.growth_period_ph")}</p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 px-4 pb-4 overflow-auto">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                                    {t("reports.hourly_sales_breakdown")}
                                </h4>
                            </div>

                            {/* Table-based Breakdown (Simplified Trend) */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-[10px] font-bold sticky top-0 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-3">{t("reports.col_time_period")}</th>
                                            <th className="px-6 py-3 text-right">{t("reports.col_sales_volume")}</th>
                                            <th className="px-6 py-3 text-right">{t("reports.col_contribution")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {data.salesTrend.length === 0 ? (
                                            <tr><td colSpan={3} className="py-10 text-center text-gray-400 text-xs uppercase">{t("common.no_result")}</td></tr>
                                        ) : (
                                            data.salesTrend.map((item: { label: string; value: number; }, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white tabular-nums">
                                                        {item.label}
                                                    </td>
                                                    <td className="px-6 py-4 text-right tabular-nums text-gray-700 dark:text-gray-300 font-bold">
                                                        {displayPrice(item.value)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                <div
                                                                    className="bg-teal-500 h-full"
                                                                    style={{ width: `${(item.value / data.totalRevenue) * 100}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] tabular-nums text-gray-400">
                                                                {((item.value / data.totalRevenue) * 100).toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isPrinting && (
                <PrintService
                    contentRef={printDiv}
                    onComplete={() => setIsPrinting(false)}
                />
            )}
        </div>
    );
};

export default SalesSummary;