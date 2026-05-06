import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/language";
import { DatePickerWithLabel } from "@/components/input";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { SearchIcon, PrinterIcon } from "@/libs/icons";
import {
  getTodayDateString,
  toDisplayString,
  toISODateString,
} from "@/utils/helper/dateUtils";
import { displayPrice } from "@/utils/helper/numberUtils";
import { reportApi } from "@/api";
import type { IZReportData } from "@/types/reports";
import { LoggerUtils } from "@/utils";
import PrintService from "@/components/PrintService";
import { useAuth } from "@/contexts/authorize";
import Loader from "@/components/Loader";
import { AlertError } from "@/components/ActionStatusMessage";

const ZReport = () => {
  const { t } = useLanguage();
  const { info } = useAuth();

  // Logic Optimization: Memoize display name
  const userName = info.isAuthorized
    ? info.authUser?.displayName || t("common.na")
    : "...";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportDate, setReportDate] = useState(getTodayDateString());
  const [data, setData] = useState<IZReportData | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const printDiv = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!reportDate) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await reportApi.getZReport(toISODateString(reportDate));
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setData(null);
        setError(t("common.no_record"));
      }
    } catch (err) {
      LoggerUtils.logCatch(err, "ZReport", "fetchData", `date: ${reportDate}`);
      setError(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [reportDate, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Shared Tailwind classes for rows to keep it DRY without a component
  const rowBase = "flex justify-between text-sm py-0.5 tabular-nums";
  const rowLabel = "text-gray-600 dark:text-gray-400";
  const rowValue = "text-gray-900 dark:text-white font-medium";

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header Actions */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3">
        <div>
          <h2 className="font-bold text-gray-800 dark:text-white">
            {t("reports.z_report_title")}
          </h2>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
            {t("reports.z_report_desc")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DatePickerWithLabel
            label=""
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
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

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50 p-10">
          <Loader label={t("common.loading")} />
        </div>
      ) : error ? (
        <div className="p-10">
          <AlertError message={error} />
        </div>
      ) : (
        <div className="flex-1 p-4 overflow-auto print:p-0" ref={printDiv}>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-8 max-w-xl mx-auto print:border-none print:shadow-none">
            {/* Receipt Header */}
            <div className="text-center border-b border-dashed border-gray-300 dark:border-gray-600 pb-4 mb-6">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase">
                {t("reports.z_report_title")}
              </h3>
              <div className="mt-2 text-[10px] text-gray-500 space-y-0.5 uppercase font-medium">
                <p>
                  {t("common.date")}: {toDisplayString(reportDate)}
                </p>
                <p>{userName}</p>
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="space-y-1">
              <div className={rowBase}>
                <span className={rowLabel}>{t("reports.complete_count")}</span>
                <span className={rowValue}>
                  {data?.counters.completedOrders}
                </span>
              </div>
              <div className={rowBase}>
                <span className={rowLabel}>{t("reports.voids_count")}</span>
                <span className={rowValue}>{data?.counters.voidedOrders}</span>
              </div>
              <div className={rowBase}>
                <span className={rowLabel}>{t("reports.refunds_count")}</span>
                <span className={rowValue}>{data?.counters.refundCount}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                <div className={rowBase}>
                  <span className={rowLabel}>{t("reports.gross_sales")}</span>
                  <span className={rowValue}>
                    {displayPrice(data?.sales.gross)}
                  </span>
                </div>
                <div className={rowBase}>
                  <span className={rowLabel}>{t("reports.tax_collected")}</span>
                  <span className={rowValue}>
                    {displayPrice(data?.sales.tax)}
                  </span>
                </div>
                <div className={rowBase}>
                  <span className={rowLabel}>
                    {t("reports.discounts_promos")}
                  </span>
                  <span className={rowValue}>
                    - {displayPrice(data?.sales.discounts)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-double border-gray-200 dark:border-gray-700 mt-2">
                <div className="flex justify-between text-base font-black text-gray-900 dark:text-white uppercase">
                  <span>{t("reports.net_sales")}</span>
                  <span>{displayPrice(data?.sales.net)}</span>
                </div>
              </div>

              {/* Payments Section */}
              <h4 className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 mt-8 mb-2 tracking-widest">
                {t("reports.collection_methods")}
              </h4>
              <div className="space-y-1 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md">
                <div className={rowBase}>
                  <span className={rowLabel}>
                    {t("reports.cash_in_drawer")}
                  </span>
                  <span className={rowValue}>
                    {displayPrice(data?.payments.cash)}
                  </span>
                </div>
                <div className={rowBase}>
                  <span className={rowLabel}>{t("reports.card_payment")}</span>
                  <span className={rowValue}>
                    {displayPrice(data?.payments.card)}
                  </span>
                </div>
                <div className={rowBase}>
                  <span className={rowLabel}>
                    {t("reports.digital_payments")}
                  </span>
                  <span className={rowValue}>
                    {displayPrice(data?.payments.digital)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600 text-center text-[10px] text-gray-400 uppercase font-bold tracking-[0.3em]">
              {t("common.end_of_report")}
            </div>
          </div>
        </div>
      )}

      {isPrinting && (
        <PrintService
          contentRef={printDiv}
          onComplete={() => setIsPrinting(false)}
        />
      )}
    </div>
  );
};

export default ZReport;
