import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useLanguage } from "@/contexts/language";
import { DatePickerWithLabel } from "@/components/input";
import { Button } from "@/components/button";
import { PrinterIcon, SearchIcon } from "@/libs/icons";
import { getTodayDateString, toDisplayString, toISODateString } from "@/utils/helper/dateUtils";
import { reportApi } from "@/api";
import { LoggerUtils } from "@/utils";
import SummaryCard from "@/components/SummaryCard";
import { displayPrice } from "@/utils/helper/numberUtils";
import type { IVoidReport } from "@/types/reports";
import Loader from "@/components/Loader";
import PrintService from "@/components/PrintService";

const VoidCancellationReport = () => {
    const { t } = useLanguage();

    // 1. State Management
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IVoidReport[]>([]);
    const [fromDate, setFromDate] = useState<string>(getTodayDateString());
    const [toDate, setToDate] = useState<string>(getTodayDateString());
    const [isPrinting, setIsPrinting] = useState(false);
    const printDiv = useRef<HTMLDivElement>(null);


    // 2. Fetch Logic
    const fetchData = useCallback(async () => {
        if (!fromDate || !toDate) return;

        setError(null);
        setIsLoading(true);
        setData([]); // Clear old data while loading new

        try {
            const response = await reportApi.getVoidReportData(
                toISODateString(fromDate),
                toISODateString(toDate)
            );

            if (response.success && Array.isArray(response.data)) {
                if (response.data.length > 0) {
                    setData(response.data);
                } else {
                    setError(t("reports.no_voids_found"));
                }
            } else {
                setError(response.message || t("reports.no_voids_found"));
            }
        } catch (err) {
            LoggerUtils.logCatch(
                err,
                "VoidCancellationReport",
                "fetchData",
                `fromDate: ${fromDate}, toDate: ${toDate}`,
            );
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [fromDate, toDate, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 3. Derived State (Dynamic Metrics)
    const metrics = useMemo(() => {
        const totalAmount = data.reduce((sum, item) => sum + item.refundedAmount, 0);
        // Get unique users who authorized voids
        const uniqueUsers = Array.from(new Set(data.map(item => item.username))).join(", ");

        return {
            totalAmount,
            totalCount: data.length,
            users: uniqueUsers || ""
        };
    }, [data]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h2 className="font-bold text-gray-800 dark:text-white">
                        {t("reports.void_cancellation_title")}
                    </h2>
                    <div className="flex items-center gap-2">
                        <DatePickerWithLabel
                            label=""
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                        <span className="text-gray-400 text-xs">to</span>
                        <DatePickerWithLabel
                            label=""
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                        <Button
                            variant="primary"
                            onClick={fetchData}
                            disabled={isLoading}
                            isLoading={isLoading}
                            title={t("common.search")}
                            className="uppercase"
                        >
                            <SearchIcon className="w-5 h-5" />
                            {t("common.search")}
                        </Button>
                        <Button
                            variant="indigo"
                            onClick={() => setIsPrinting(true)}
                            disabled={!data || isLoading}
                            title={t("common.print")}
                            className="uppercase"
                        >
                            <PrinterIcon className="w-5 h-5" />
                            {t("common.print")}
                        </Button>
                    </div>
                </div>
            </div>
            <div ref={printDiv}>
                {/* Summary Cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SummaryCard
                        label={t("reports.total_void")}
                        value={metrics.totalCount}
                        color="text-red-500"
                        sub={t("reports.total_void_ph")}
                    />
                    <SummaryCard
                        label={t("reports.total_void_amount")}
                        value={displayPrice(metrics.totalAmount)}
                        color="text-orange-500"
                        sub={t("reports.total_void_amount_ph")}
                    />
                    <SummaryCard
                        label={t("reports.total_void_users")}
                        value={metrics.users}
                        color="text-blue-500"
                        sub={t("reports.total_void_users_ph")}
                    />
                </div>

                {/* Detailed Log Table */}
                <div className="flex-1 px-4 pb-4 overflow-hidden">
                    <div className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-[10px] font-bold sticky top-0 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">{t("reports.col_order_no")}</th>
                                        <th className="px-4 py-3">{t("common.date")}</th>
                                        <th className="px-4 py-3">{t("common.status")}</th>
                                        <th className="px-4 py-3">{t("reports.col_reason")}</th>
                                        <th className="px-4 py-3">{t("reports.col_authorized_by")}</th>
                                        <th className="px-4 py-3 text-right">{t("reports.col_refund_amount")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="py-20 text-center">
                                                <Loader label={t("common.loading")} />
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-16 text-center">
                                                <div className="flex flex-col items-center text-gray-400 gap-1">
                                                    <span className="text-sm">{error}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.orderNumber}
                                                </td>
                                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                    {toDisplayString(item.createdAt)}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{item.status}</span>
                                                        <span className="text-[9px] uppercase text-gray-500">{item.refundMethod}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm italic text-gray-600 dark:text-gray-400">
                                                    <div className="max-h-16 w-48 overflow-y-auto pr-2 break-words scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                                        {item.reason}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">{item.username}</td>
                                                <td className="px-4 py-4 text-sm text-right font-bold text-red-600 dark:text-red-400 tabular-nums">
                                                    {displayPrice(item.refundedAmount)}
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
            {isPrinting && (
                <PrintService
                    contentRef={printDiv}
                    onComplete={() => setIsPrinting(false)}
                />
            )}
        </div>
    );
};

export default VoidCancellationReport;