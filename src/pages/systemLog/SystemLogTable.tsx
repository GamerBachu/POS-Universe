import { useEffect, useState, useCallback } from "react";
import { type ISystemLog } from "@/types/systemLog";
import { systemLogApi } from "@/api";
import { useLanguage } from "@/contexts/language";
import SystemLogTableRow from "./SystemLogTableRow";

import { useSearchParams } from "react-router-dom";
import TableSkeleton from "@/components/TableSkeleton";
import TableNoRecord from "@/components/TableNoRecord";

import Pagination from "@/components/Pagination";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { SelectWithLabel, TextBoxWithLabel } from "@/components/input";

const SystemLogTable = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeTerm = searchParams.get("type") || "";
  const pageName = searchParams.get("pageName") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [localType, setLocalType] = useState(typeTerm);
  const [localPageName, setLocalPageName] = useState(pageName);

  const [data, setData] = useState<ISystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await systemLogApi.getFiltered(
        typeTerm,
        pageName,
        currentPage,
        pageSize,
      );
      if (res.success && res.data) {
        setData(res.data.items);
        setTotalCount(res.data.totalCount);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [typeTerm, currentPage, pageName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApplyFilters = () => {
    setSearchParams({ type: localType, pageName: localPageName, page: "1" });
  };

  const handleClear = () => {
    setLocalType("");
    setLocalPageName("");
    setSearchParams({ type: "", pageName: "", page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      type: typeTerm,
      pageName: pageName,
      page: newPage.toString(),
    });
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2 items-end p-3 border border-gray-200 dark:border-gray-700">
        <TextBoxWithLabel
          label={t("system_log.type")}
          placeholder={t("system_log.ph_type")}
          value={localType}
          onChange={(e) => setLocalType(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
        />
        <SelectWithLabel
          label={t("common.status")}
          value={localPageName}
          onChange={(e) => setLocalPageName(e.target.value)}
        >
          <option value="">{t("common.all_status")}</option>
          <option value="true">{t("common.active")}</option>
          <option value="false">{t("common.inactive")}</option>
        </SelectWithLabel>

        <div className="flex gap-1 md:justify-end">
          <PrimaryButton onClick={handleApplyFilters} isLoading={isLoading}>
            {t("common.search")}
          </PrimaryButton>
          <SecondaryButton onClick={handleClear} isLoading={isLoading}>
            {t("common.reset")}
          </SecondaryButton>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-[700px] text-left border-collapse table-auto">
          <thead>
            <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <th className="p-3 w-20 text-left font-bold">{t("common.id")}</th>
              <th className="p-3 w-32 text-left font-bold">
                {t("system_log.type")}
              </th>
              <th className="p-3 text-left font-bold">
                {t("system_log.page_name")}
              </th>
              <th className="p-3 text-left font-bold">
                {t("system_log.function")}
              </th>
              <th className="p-3 w-48 text-left font-bold">
                {t("system_log.timestamp")}
              </th>
              <th className="p-3 w-48 text-center font-bold">
                {t("common.action")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
            {isLoading ? (
              <TableSkeleton rows={5} column={6} />
            ) : data.length === 0 ? (
              <TableNoRecord column={6} message={t("common.no_record")} />
            ) : (
              data.map((item) => (
                <SystemLogTableRow key={item.id} item={item} />
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      ></Pagination>
    </div>
  );
};
export default SystemLogTable;
