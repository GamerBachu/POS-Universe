import React, { useEffect, useRef, useState } from "react";
import { CalendarIcon, UserIcon } from "@/libs/icons";
import { reportApi, type IZReportData } from "@/api/reportApi";
import { displayPrice } from "@/utils/helper/numberUtils";
import PrintService from "@/components/PrintService";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/language";

const ZReportView: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<IZReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const printDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await reportApi.getZReportData();
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
        Generating Z-Report...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500 text-xs uppercase font-bold">
        Error loading report data.
      </div>
    );
  }

  const { sales, payments, counters, businessDate, cashierName } = data;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden font-sans">
      <div ref={printDiv}>
        <div className="p-6 text-center border-b border-dashed border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-100">
            Z-Report Summary
          </h1>
          <p className="text-[10px] text-gray-500 uppercase mt-1 font-bold">
            Daily Financial Reconciliation
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" /> {businessDate}
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" /> {cashierName}
            </div>
          </div>
        </div>
        <div className="p-5 space-y-6">
          <section>
            <h2 className="text-[10px] font-black uppercase text-teal-600 mb-2 tracking-wider">
              Revenue Breakdown
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Gross Sales</span>
                <span className="font-mono">{displayPrice(sales.gross)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discounts/Promos</span>
                <span className="font-mono">
                  ({displayPrice(sales.discounts)})
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax Collected</span>
                <span className="font-mono">{displayPrice(sales.tax)}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between font-black text-gray-900 dark:text-white">
                <span className="uppercase text-xs">Net Sales</span>
                <span className="text-base">{displayPrice(sales.net)}</span>
              </div>
            </div>
          </section>
          <section className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-md border border-gray-100 dark:border-gray-700">
            <h2 className="text-[10px] font-black uppercase text-gray-400 mb-2">
              Collection Methods
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">CASH IN DRAWER</span>
                <span className="font-black text-gray-800 dark:text-gray-200">
                  {displayPrice(payments.cash)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>CREDIT/DEBIT CARD</span>
                <span>{displayPrice(payments.card)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>DIGITAL PAYMENTS</span>
                <span>{displayPrice(payments.digital)}</span>
              </div>
            </div>
          </section>
          <div className="grid grid-cols-3 gap-2 border-t border-dashed border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase">
                Orders
              </p>
              <p className="text-sm font-black dark:text-white">
                {counters.totalOrders}
              </p>
            </div>
            <div className="text-center border-x border-gray-100 dark:border-gray-700">
              <p className="text-[9px] font-bold text-gray-400 uppercase">
                Voids
              </p>
              <p className="text-sm font-black text-red-500">
                {counters.voidedOrders}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-gray-400 uppercase">
                Refunds
              </p>
              <p className="text-sm font-black text-orange-500">
                {counters.refundCount}
              </p>
            </div>
          </div>
        </div>
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
