import React, { useEffect, useRef, useState } from "react";
import { reportApi } from "@/api/reportApi";
import { displayPrice } from "@/utils/helper/numberUtils";
import PrintService from "@/components/PrintService";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/language";


interface InventoryValuationData {
    totalAssetValue: number;
    totalStock: number;
}

const InventoryValuationReport: React.FC = () => {
    const { t } = useLanguage();
    const [data, setData] = useState<InventoryValuationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPrinting, setIsPrinting] = useState(false);
    const printDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const res = await reportApi.getInventoryValuation();
            if (res.success && res.data) {
                setData(res.data);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center animate-pulse text-gray-400 font-mono text-xs uppercase tracking-widest">
                {t("reports.inventory_valuation_title")} {t("common.loading")}...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-10 text-center text-red-500 text-xs uppercase font-bold">
                {t("common.error")} {t("common.loading")} {t("reports.inventory_valuation_title")} {t("common.data")}.
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden font-sans">
            <div ref={printDiv}>
                <div className="p-6 text-center border-b border-dashed border-gray-200 dark:border-gray-700">
                    <h1 className="text-lg font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-100">
                        {t("reports.inventory_valuation_title")}
                    </h1>
                    <p className="text-[10px] text-gray-500 uppercase mt-1 font-bold">
                        {t("reports.inventory_valuation_desc")}
                    </p>
                </div>
                <div className="p-5 space-y-6">
                    <section>
                        <h2 className="text-[10px] font-black uppercase text-teal-600 mb-2 tracking-wider">
                            {t("reports.valuation_summary")}
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-2">
                                    {t("reports.total_asset_value")}
                                </span>
                                <span className="font-mono text-base font-black">
                                    {displayPrice(data.totalAssetValue)}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-2">
                                    {t("reports.total_stock_count")}
                                </span>
                                <span className="font-mono text-base font-black">
                                    {data.totalStock}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border-t dark:border-gray-700">
                {isPrinting && <PrintService contentRef={printDiv} onComplete={() => setIsPrinting(false)} />}
                <Button type="button" className="bg-blue-600 hover:bg-blue-700 p-2 w-100" disabled={isPrinting} onClick={() => setIsPrinting(true)} title={t("common.print")} isLoading={loading}>
                    {t("common.print")}
                </Button>
            </div>
        </div>
    );
};

export default InventoryValuationReport;
