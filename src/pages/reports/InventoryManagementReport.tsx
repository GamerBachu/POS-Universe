import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useLanguage } from "@/contexts/language";
import Button from "@/components/Button";
import { PrinterIcon, SearchIcon } from "@/libs/icons";
import { reportApi } from "@/api";
import { LoggerUtils } from "@/utils";
import SummaryCard from "@/components/SummaryCard";
import type { IProduct } from "@/types/product";
import Loader from "@/components/Loader";
import PrintService from "@/components/PrintService";

const InventoryManagementReport = () => {
    const { t } = useLanguage();

    // 1. State Management
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPrinting, setIsPrinting] = useState(false);
    const printDiv = useRef<HTMLDivElement>(null);

    // 2. Fetch Logic
    const fetchData = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await reportApi.getInventoryManagementData();
            if (response.success && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]);
                LoggerUtils.logError(response, "InventoryManagementReport", "fetchData", `API error: ${response.message}`);
                setError(t("common.error"));
            }
        } catch (err) {
            setData([]);
            LoggerUtils.logCatch(err, "InventoryManagementReport", "fetchData");
            setError(t("common.error"));
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 3. Derived State & Filtering
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const term = searchTerm.toLowerCase().trim();
        return data.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.sku?.toLowerCase().includes(term) ||
            item.code?.toLowerCase().includes(term)
        );
    }, [data, searchTerm]);

    const metrics = useMemo(() => {
        const lowStock = data.filter(i => i.stock > 0 && i.stock <= i.reorderLevel).length;
        const outOfStock = data.filter(i => i.stock <= 0).length;
        const inactive = data.filter(i => !i.isActive).length;
        return {
            inactive,
            lowStock,
            outOfStock
        };
    }, [data]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h2 className="font-bold text-gray-800 dark:text-white">
                            {t("reports.inventory_management_title")}
                        </h2>
                        <p className="text-[10px] text-gray-500 uppercase font-medium">
                            {t("reports.inventory_management_desc")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t("common.ph_search")}
                                className="pl-9 pr-3 h-9 text-xs border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 focus:ring-1 focus:ring-teal-500 outline-none w-48 md:w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => setIsPrinting(true)}
                            className="bg-gray-600 h-9 px-4 gap-2 text-xs font-bold uppercase transition-all active:scale-95"
                            disabled={isLoading || data.length === 0}
                        >
                            <PrinterIcon className="w-4 h-4" />
                            {t("common.print")}
                        </Button>
                    </div>
                </div>
            </div>

            <div ref={printDiv} className="flex-1 flex flex-col overflow-hidden">
                {/* Summary Cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SummaryCard
                        label={t("reports.inventory_inactive")}
                        value={metrics.inactive}
                        color="text-teal-600"
                        sub={t("common.all") + " SKU"}
                    />
                    <SummaryCard
                        label={t("reports.inventory_status_low")}
                        value={metrics.lowStock}
                        color="text-orange-500"
                        sub={t("product_inventory.reorder_level")}
                    />
                    <SummaryCard
                        label={t("reports.inventory_status_out")}
                        value={metrics.outOfStock}
                        color="text-red-500"
                        sub={t("common.action") + " Required"}
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
                                        <th className="px-4 py-3 text-center">{t("product_inventory.stock")}</th>
                                        <th className="px-4 py-3 text-center">{t("product_inventory.reorder_level")}</th>
                                        <th className="px-4 py-3 text-right">{t("common.status")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="py-20 text-center"><Loader /></td></tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr><td colSpan={5} className="py-20 text-center text-gray-400 text-xs uppercase">{error || t("common.no_result")}</td></tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                    <div className="flex flex-col">
                                                        <span>{item.name}</span>
                                                        <span className="text-[9px] text-gray-500 uppercase">{item.code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono">{item.sku || "N/A"}</td>
                                                <td className="px-4 py-3 text-center font-bold tabular-nums">{item.stock}</td>
                                                <td className="px-4 py-3 text-center text-gray-500 tabular-nums">{item.reorderLevel}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                                                        ${!item.isActive ? "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400" :
                                                            item.stock <= 0 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                                                item.stock <= item.reorderLevel ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                                                                    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                                                        }`}>
                                                        {!item.isActive ? t("common.inactive") :
                                                            item.stock <= 0 ? t("reports.inventory_status_out") :
                                                                item.stock <= item.reorderLevel ? t("reports.inventory_status_low") : t("reports.inventory_status_ok")}
                                                    </span>
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

export default InventoryManagementReport;