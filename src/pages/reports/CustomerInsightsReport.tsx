import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useLanguage } from "@/contexts/language";
import { toDisplayString } from "@/utils/helper/dateUtils";
import { reportApi } from "@/api";
import { LoggerUtils } from "@/utils";
import SummaryCard from "@/components/SummaryCard";
import { displayPrice } from "@/utils/helper/numberUtils";
import type { ICustomerInsight } from "@/types/reports";
import Loader from "@/components/Loader";
import PrintService from "@/components/PrintService";
import { TextBox } from "@/components/input";
import { Button } from "@/components/button";

const CustomerInsightsReport = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ICustomerInsight[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPrinting, setIsPrinting] = useState(false);
    const printDiv = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await reportApi.getCustomerInsights();
            if (response.success && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]);
                LoggerUtils.logError(response, "CustomerInsightsReport", "fetchData", `API error: ${response.message}`);
                setError(t("common.error"));
            }
        } catch (err) {
            setData([]);
            LoggerUtils.logCatch(err, "CustomerInsightsReport", "fetchData");
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return data;
        return data.filter(
            (c) =>
                c.name.toLowerCase().includes(term) ||
                c.phone.includes(term) ||
                c.email.toLowerCase().includes(term),
        );
    }, [data, searchTerm]);

    const metrics = useMemo(() => {
        const totalValue = data.reduce((sum, c) => sum + c.totalSpent, 0);
        const topSpender = data.length > 0 ? data[0].name : "N/A";
        return {
            count: data.length,
            avgValue: data.length > 0 ? totalValue / data.length : 0,
            topSpender,
        };
    }, [data]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h2 className="font-bold text-gray-800 dark:text-white">
                            {t("reports.customer_insights_title")}
                        </h2>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                            {t("reports.customer_insights_desc")}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <TextBox
                            placeholder={t("common.search")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                           variant="indigo"
                            onClick={() => setIsPrinting(true)}
                            disabled={isLoading || data.length === 0}
                            title={t("common.print")}
                        >
                            <span>{t("common.print")}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div ref={printDiv} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SummaryCard
                        label={t("reports.total_active_customers")}
                        value={metrics.count}
                        color="text-teal-600"
                        sub={t("reports.total_active_customers_ph")}
                    />
                    <SummaryCard
                        label={t("reports.top_spender")}
                        value={metrics.topSpender}
                        color="text-blue-500"
                        sub={t("reports.top_spender_ph")}
                    />
                    <SummaryCard
                        label={t("reports.avg_customer_value")}
                        value={displayPrice(metrics.avgValue)}
                        color="text-orange-500"
                        sub={t("reports.avg_customer_value_ph")}
                    />
                </div>

                <div className="flex-1 px-4 pb-4 overflow-hidden">
                    <div className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-[10px] font-bold sticky top-0 border-b border-gray-200 dark:border-gray-700 z-10">
                                    <tr>
                                        <th className="px-4 py-3">{t("common.name")}</th>
                                        <th className="px-4 py-3 text-center">
                                            {t("reports.col_purchase_freq")}
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            {t("reports.col_total_spent")}
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            {t("reports.avg_order_value")}
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            {t("reports.col_loyalty_score")}
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            {t("reports.col_last_order")}
                                        </th>
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
                                            <td
                                                colSpan={6}
                                                className="py-20 text-center text-gray-400 text-sm uppercase"
                                            >
                                                {error}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr
                                                key={item.customerId}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[9px] text-gray-500 uppercase">
                                                            {item.phone}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center tabular-nums font-bold text-gray-700 dark:text-gray-300">
                                                    {item.orderCount}
                                                </td>
                                                <td className="px-4 py-3 text-right tabular-nums font-black text-teal-600 dark:text-teal-400">
                                                    {displayPrice(item.totalSpent)}
                                                </td>
                                                <td className="px-4 py-3 text-right tabular-nums text-gray-500">
                                                    {displayPrice(item.avgOrderValue)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.loyaltyScore > 500
                                                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                                            : item.loyaltyScore > 100
                                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                            }`}
                                                    >
                                                        {item.loyaltyScore}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs text-gray-500 tabular-nums">
                                                    {toDisplayString(item.lastPurchaseDate)}
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

export default CustomerInsightsReport;
