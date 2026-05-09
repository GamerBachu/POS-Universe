import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { reportApi } from "@/api";
import { displayPrice } from "@/utils/helper/numberUtils";
import PrintService from "@/components/PrintService";
import { useLanguage } from "@/contexts/language";
import SummaryCard from "@/components/SummaryCard";

import Loader from "@/components/Loader";
import { LoggerUtils } from "@/utils";
import type { IInventoryValuation } from "@/types/reports";
import { TextBox } from "@/components/input";
import { Button } from "@/components/button";

const InventoryValuationReport = () => {
    const { t } = useLanguage();

    // 1. State Management
    const [data, setData] = useState<IInventoryValuation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPrinting, setIsPrinting] = useState(false);
    const printDiv = useRef<HTMLDivElement>(null);

    // 2. Fetch Logic
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getInventoryValuation();
            if (res.success && res.data) {
                setData(res.data);
            } else {
                setError(res.message || t("common.no_record"));
            }
        } catch (err) {
            LoggerUtils.logCatch(err, "InventoryValuationReport", "fetchData");
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 3. Derived State & Filtering
    const filteredProducts = useMemo(() => {
        if (!data?.products) return [];
        if (!searchTerm.trim()) return data.products;

        const term = searchTerm.toLowerCase().trim();
        return data.products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.sku?.toLowerCase().includes(term) ||
            p.code?.toLowerCase().includes(term)
        );
    }, [data, searchTerm]);

    const avgCost = useMemo(() => {
        if (!data || data.totalStock === 0) return 0;
        return data.totalAssetValue / data.totalStock;
    }, [data]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h2 className="font-bold text-gray-800 dark:text-white">
                            {t("reports.inventory_valuation_title")}
                        </h2>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                            {t("reports.inventory_valuation_desc")}
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
                            disabled={isLoading || !data}
                            title={t("common.print")}
                        >
                            <span>{t("common.print")}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div ref={printDiv} className="flex-1 flex flex-col overflow-hidden">
                {/* Summary Cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SummaryCard
                        label={t("reports.total_asset_value")}
                        value={displayPrice(data?.totalAssetValue || 0)}
                        color="text-teal-600"
                        sub={t("reports.total_asset_value_desc")}
                    />
                    <SummaryCard
                        label={t("reports.total_stock_count")}
                        value={data?.totalStock || 0}
                        color="text-blue-500"
                        sub={t("reports.total_stock_count_desc")}
                    />
                    <SummaryCard
                        label={t("product_inventory.cost_price")}
                        value={displayPrice(avgCost)}
                        color="text-orange-500"
                        sub={t("common.all") + " Avg."}
                    />
                </div>

                {/* Table Section */}
                <div className="flex-1 px-4 pb-4 overflow-hidden">
                    <div className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-[10px] font-bold sticky top-0 border-b border-gray-200 dark:border-gray-700 z-10">
                                    <tr>
                                        <th className="px-4 py-3">{t("product_inventory.name")}</th>
                                        <th className="px-4 py-3">{t("product_inventory.sku")}</th>
                                        <th className="px-4 py-3 text-right">{t("product_inventory.cost_price")}</th>
                                        <th className="px-4 py-3 text-center">{t("product_inventory.stock")}</th>
                                        <th className="px-4 py-3 text-right">{t("common.id")} Extension</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="py-20 text-center"><Loader /></td></tr>
                                    ) : error ? (
                                        <tr><td colSpan={5} className="py-20 text-center text-red-500 text-xs uppercase font-bold">{error}</td></tr>
                                    ) : filteredProducts.length === 0 ? (
                                        <tr><td colSpan={5} className="py-20 text-center text-gray-400 text-xs uppercase">{t("common.no_result")}</td></tr>
                                    ) : (
                                        filteredProducts.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                    <div className="flex flex-col">
                                                        <span>{item.name}</span>
                                                        <span className="text-[9px] text-gray-500 uppercase">{item.code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono">{item.sku || "N/A"}</td>
                                                <td className="px-4 py-3 text-right tabular-nums">{displayPrice(item.costPrice)}</td>
                                                <td className="px-4 py-3 text-center tabular-nums">{item.stock}</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-teal-600 dark:text-teal-400">
                                                    {displayPrice(item.stock * (item.costPrice || 0))}
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

export default InventoryValuationReport;
