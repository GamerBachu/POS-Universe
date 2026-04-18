import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language";
import { reportApi } from "@/api";
import type { IProduct } from "@/types/product";
import Loader from "@/components/Loader";
import { LoggerUtils } from "@/utils";
import { InventoryStatus } from "@/components/badge";

const InventoryAlerts = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IProduct[]>([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getInventoryAlertsData();
            if (res.success && res.data) {
                setData(res.data);
            } else {
                setData([]);
                LoggerUtils.logError(
                    res,
                    "InventoryAlerts",
                    "fetchData",
                    "API response error",
                );
                setError(t("common.no_record"));
            }
        } catch (err) {
            setData([]);
            LoggerUtils.logCatch(err, "InventoryAlerts", "fetchData");
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
                    {t("reports.inventory_alerts_title")}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.inventory_alerts_desc")}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.inventory_alerts_question")}
                </p>
            </div>

            <div className="space-y-2 flex-1 overflow-auto">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                       <Loader label={t("common.loading")} />
                    </div>
                ) : error ? (
                    <div className="h-full flex items-center justify-center text-[10px] uppercase font-bold text-red-500">
                        {error}
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[10px] uppercase font-bold text-gray-400 italic">
                        {t("common.no_record")}
                    </div>
                ) : (
                    data.map((item) => (
                        <div
                            key={item.id}
                            className="p-3 bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 rounded-r flex justify-between items-center"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase leading-none">
                                    {item.name}
                                </span>
                                <div className=" flex items-center gap-2">
                                    <span className="text-[10px] uppercase ">{item.code}</span>
                                    <span className="text-[10px] uppercase ">{t("product_inventory.sku")}: {item.sku}</span>
                                </div>
                            </div>
                            <InventoryStatus
                                isActive={item.isActive}
                                stock={item.stock}
                                reorderLevel={item.reorderLevel}
                                showCount={true}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InventoryAlerts;
