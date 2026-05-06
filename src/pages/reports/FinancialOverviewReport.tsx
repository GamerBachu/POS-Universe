import { useCallback, useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/language";
import { DatePickerWithLabel } from "@/components/input";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { PrinterIcon, SearchIcon } from "@/libs/icons";
import { getTodayDateString, toISODateString } from "@/utils/helper/dateUtils";
import { reportApi } from "@/api";
import { LoggerUtils } from "@/utils";
import SummaryCard from "@/components/SummaryCard";
import { displayPrice } from "@/utils/helper/numberUtils";
import type { IFinancialOverview } from "@/types/reports";
import Loader from "@/components/Loader";
import PrintService from "@/components/PrintService";

const FinancialOverviewReport = () => {
    const { t } = useLanguage();

    // 1. State Management
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IFinancialOverview | null>(null);
    const [fromDate, setFromDate] = useState<string>(getTodayDateString());
    const [toDate, setToDate] = useState<string>(getTodayDateString());
    const [isPrinting, setIsPrinting] = useState(false);
    const printDiv = useRef<HTMLDivElement>(null);

    // 2. Fetch Logic
    const fetchData = useCallback(async () => {
        if (!fromDate || !toDate) return;
        setError(null);
        setIsLoading(true);

        try {
            const response = await reportApi.getFinancialOverview(
                toISODateString(fromDate),
                toISODateString(toDate),
            );
            if (response.success && response.data) {
                setData(response.data);
            } else {
                setError(response.message || t("common.no_record"));
            }
        } catch (err) {
            LoggerUtils.logCatch(err, "FinancialOverviewReport", "fetchData");
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [fromDate, toDate, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h2 className="font-bold text-gray-800 dark:text-white uppercase tracking-tight">
                            {t("reports.overview_title")}
                        </h2>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">
                            {t("reports.overview_desc")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <DatePickerWithLabel
                            label=""
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}

                        />
                        <span className="text-gray-400 text-[10px] uppercase font-bold">
                            to
                        </span>
                        <DatePickerWithLabel
                            label=""
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                        <PrimaryButton
                            onClick={fetchData}
                            disabled={isLoading}
                            isLoading={isLoading}
                            title={t("common.search")}
                            className="uppercase"
                        >
                            <SearchIcon className="w-5 h-5" />
                            {t("common.search")}
                        </PrimaryButton>
                        <SecondaryButton
                            onClick={() => setIsPrinting(true)}
                            disabled={!data || isLoading}
                            title={t("common.print")}
                            className="uppercase"
                        >
                            <PrinterIcon className="w-5 h-5" />
                            {t("common.print")}
                        </SecondaryButton>
                    </div>
                </div>
            </div>

            <div ref={printDiv} className="flex-1 flex flex-col overflow-auto">
                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loader label={t("common.loading")} />
                    </div>
                ) : error ? (
                    <div className="py-20 text-center text-gray-400 text-xs uppercase font-bold">
                        {error}
                    </div>
                ) : (
                    data && (
                        <div className="p-4 space-y-4">
                            {/* Primary Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <SummaryCard
                                    label={t("reports.total_revenue")}
                                    value={displayPrice(data.totalRevenue)}
                                    color="text-teal-600"
                                    sub={t("reports.total_revenue")}
                                />
                                <SummaryCard
                                    label={t("reports.total_cogs")}
                                    value={displayPrice(data.totalCogs)}
                                    color="text-red-500"
                                    sub={t("reports.total_cogs_desc")}
                                />
                                <SummaryCard
                                    label={t("reports.gross_profit")}
                                    value={displayPrice(data.grossProfit)}
                                    color="text-blue-600"
                                    sub={t("reports.gross_profit_desc")}
                                />
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                                        {t("reports.margin")}
                                    </p>
                                    <p className="text-2xl font-bold mt-1 text-teal-600 tabular-nums">
                                        {data.grossMargin}%
                                    </p>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="bg-teal-500 h-full"
                                            style={{ width: `${Math.min(data.grossMargin, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Breakdown Section */}
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                                    <h3 className="text-[11px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest">
                                        {t("reports.cash_flow_summary")}
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            <tr className="group">
                                                <td className="py-3 font-medium text-gray-600 dark:text-gray-300 uppercase text-xs">
                                                    {t("reports.total_revenue")} (Inflow)
                                                </td>
                                                <td className="py-3 text-right font-bold text-green-600 tabular-nums">
                                                    {displayPrice(data.cashInflow)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-medium text-gray-600 dark:text-gray-300 uppercase text-xs">
                                                    {t("reports.total_cogs")} (Outflow)
                                                </td>
                                                <td className="py-3 text-right font-bold text-red-500 tabular-nums">
                                                    ({displayPrice(data.cashOutflow)})
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-medium text-gray-600 dark:text-gray-300 uppercase text-xs">
                                                    Operating Expenses
                                                </td>
                                                <td className="py-3 text-right font-bold text-gray-400 tabular-nums">
                                                    {displayPrice(0)}
                                                </td>
                                            </tr>
                                            <tr className="bg-teal-50/30 dark:bg-teal-900/10">
                                                <td className="py-4 font-black text-teal-700 dark:text-teal-400 uppercase text-xs">
                                                    {t("reports.net_income")}
                                                </td>
                                                <td className="py-4 text-right font-black text-teal-700 dark:text-teal-400 text-lg tabular-nums">
                                                    {displayPrice(data.netIncome)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>

            {isPrinting && (
                <PrintService
                    contentRef={printDiv}
                    onComplete={() => setIsPrinting(false)}
                />
            )}
        </div>
    );
};

export default FinancialOverviewReport;
