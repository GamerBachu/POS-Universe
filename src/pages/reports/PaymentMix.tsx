import { useCallback, useEffect, useState } from "react";
import { useLanguage } from '@/contexts/language';
import { reportApi } from '@/api';
import type { IPaymentMixItem } from '@/types/reports';
import Loader from '@/components/Loader';
import { displayPrice } from '@/utils/helper/numberUtils';
import { LoggerUtils } from "@/utils";

const PaymentMix = () => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<IPaymentMixItem[]>([]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await reportApi.getPaymentMixData();
            if (res.success && res.data) {
                setData(res.data);
            } else {
                setData([]);
                LoggerUtils.logError(res, "PaymentMix", "fetchData", "API response error");
                setError(t("common.no_record"));
            }
        } catch (err) {
            setData([]);
            LoggerUtils.logCatch(err, "PaymentMix", "fetchData");
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
                    {t("reports.payment_mix_title")}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.payment_mix_desc")}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-tight">
                    {t("reports.payment_mix_question")}
                </p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-5">
                {isLoading ? (
                    <div className="flex items-center justify-center"><Loader /></div>
                ) : error ? (
                    <div className="flex items-center justify-center text-[10px] uppercase font-bold text-red-500">{error}</div>
                ) : data.map((item) => (
                    <div key={item.label} className="group">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                            <span className="text-gray-500 tracking-wider">{item.label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 tabular-nums">{displayPrice(item.amount)}</span>
                                <span className="text-teal-600 dark:text-teal-400 tabular-nums">{item.val}%</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`${item.color} h-full transition-all duration-1000 ease-out group-hover:brightness-110`}
                                style={{ width: `${item.val === 0 && item.amount > 0 ? 1 : item.val}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMix;