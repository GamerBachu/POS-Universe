import React, { useEffect, useRef, useState } from "react";
import { reportApi } from "@/api";
import { displayPrice } from "@/utils/helper/numberUtils";
import PrintService from "@/components/PrintService";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/language";
import { getTodayDateString, toISODateString } from "@/utils/helper/dateUtils";
import DatePicker from "@/components/DatePicker";
import type { IZReportData } from "@/types/reports";

const ZReportView: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<IZReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const printDiv = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await reportApi.getZReportData(toISODateString(selectedDate));
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    };
    if (selectedDate && selectedDate !== "") {
      loadData();
    }
  }, [selectedDate]);



  if (!data) {
    return (
      <div className="p-10 text-center text-red-500 text-xs uppercase font-bold">
        {t("common.error")}
      </div>
    );
  }

  const { sales, payments, counters, cashierName } = data;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden font-sans">
      <div ref={printDiv}>
        <div className="p-6 text-center border-b border-dashed border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-100">
            {t("reports.z_report_title")}
          </h1>
          <p className="text-[10px] text-gray-500 uppercase mt-1 font-bold">
            {t("reports.z_report_desc")}
          </p>
          <div className="mt-2 flex flex-wrap justify-center text-sm">
            <div className="flex items-center gap-1">
              {cashierName}
            </div>
            <div className="flex items-center gap-1">
              <DatePicker
                name="date-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min="2024-01-01"
                classInput="border-0 bg-transparent dark:bg-transparent focus:ring-0 focus:border-0 cursor-pointer hover:none "
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="p-10 text-center animate-pulse font-mono text-xs uppercase tracking-widest">
            {t("reports.generating_z_report")}
          </div>
        ) : (
          <div className="px-5 py-2 space-y-2">
            <section>
              <h2 className="text-[10px] font-black uppercase text-teal-600 mb-2 tracking-wider">
                {t("reports.revenue_breakdown")}
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between ">
                  <span>{t("reports.gross_sales")}</span>
                  <span className="font-mono">{displayPrice(sales.gross)}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>{t("reports.discounts_promos")}</span>
                  <span className="font-mono">
                    ({displayPrice(sales.discounts)})
                  </span>
                </div>
                <div className="flex justify-between ">
                  <span>{t("reports.tax_collected")}</span>
                  <span className="font-mono">{displayPrice(sales.tax)}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between font-black text-gray-900 dark:text-white">
                  <span className="uppercase text-xs">{t("reports.net_sales")}</span>
                  <span className="text-base">{displayPrice(sales.net)}</span>
                </div>
              </div>
            </section>
            <section className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-md border border-gray-100 dark:border-gray-700">
              <h2 className="text-[10px] font-black uppercase mb-2">
                {t("reports.collection_methods")}
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">{t("reports.cash_in_drawer")}</span>
                  <span className="font-black text-gray-800 dark:text-gray-200">
                    {displayPrice(payments.cash)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{t("reports.card_payment")}</span>
                  <span>{displayPrice(payments.card)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{t("reports.digital_payments")}</span>
                  <span>{displayPrice(payments.digital)}</span>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-3 gap-2 border-t border-dashed border-gray-200 dark:border-gray-700 pt-4">
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase">
                  {t("reports.orders_count")}
                </p>
                <p className="text-sm font-black dark:text-white">
                  {counters.totalOrders}
                </p>
              </div>
              <div className="text-center border-x border-gray-100 dark:border-gray-700">
                <p className="text-[9px] font-bold uppercase">
                  {t("reports.voids_count")}
                </p>
                <p className="text-sm font-black text-red-500">
                  {counters.voidedOrders}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase">
                  {t("reports.refunds_count")}
                </p>
                <p className="text-sm font-black text-orange-500">
                  {counters.refundCount}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border-t dark:border-gray-700">
        {isPrinting && (
          <PrintService
            contentRef={printDiv}
            onComplete={() => setIsPrinting(false)}
          />
        )}
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 p-2 w-100"
          disabled={isPrinting}
          onClick={() => setIsPrinting(true)}
          title={t("common.print")}
          isLoading={loading}
        >
          {t("common.print")}
        </Button>
      </div>
    </div>
  );
};
export default ZReportView;
