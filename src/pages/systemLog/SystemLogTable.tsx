import { useEffect, useState, useCallback } from "react";
import { type ISystemLog } from "@/types/systemLog";
import { systemLogApi } from "@/api";
import resource from "@/locales/en.json";
import SystemLogTableRow from "./SystemLogTableRow";

import { useSearchParams } from "react-router-dom";
import TableSkeleton from "@/components/TableSkeleton";
import TableNoRecord from "@/components/TableNoRecord";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Input from "@/components/Input";

const SystemLogTable = () => {
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
        pageSize
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
    setSearchParams({ type: typeTerm, pageName: pageName, page: newPage.toString() });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const formatString = (template: string, ...args: (string | number)[]) => {
    return template.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] !== 'undefined' ? String(args[number]) : match;
    });
  };

  return (
    <div className="space-y-2">
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-center p-3 border border-gray-200 dark:border-gray-700">
        <Input
          type="text"
          placeholder={resource.system_log.ph_type}
          value={localType}
          onChange={(e) => setLocalType(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
        />

        <Select
          value={localPageName}
          onChange={(e) => setLocalPageName(e.target.value)}
        >
          <option value="">{resource.common.all_status}</option>
          <option value="true">{resource.common.active}</option>
          <option value="false">{resource.common.inactive}</option>
        </Select>

        <div className="flex gap-1 lg:justify-end">
          <Button
            onClick={handleApplyFilters}
            className="bg-blue-600 hover:bg-blue-700 py-1.5"
            isLoading={isLoading}
          >
            {resource.common.search}
          </Button>
          <Button
            onClick={handleClear}
            className="bg-gray-600 hover:bg-gray-700 py-1.5"
            isLoading={isLoading}
          >
            {resource.common.reset}
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-[700px] text-left border-collapse table-auto">
          <thead>
            <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <th className="p-3 w-20 text-left font-bold">{resource.common.id}</th>
              <th className="p-3 w-32 text-left font-bold">{resource.system_log.type}</th>
              <th className="p-3 text-left font-bold">{resource.system_log.page_name}</th>
              <th className="p-3 text-left font-bold">{resource.system_log.function}</th>
              <th className="p-3 w-48 text-left font-bold">{resource.system_log.timestamp}</th>
              <th className="p-3 w-48 text-center font-bold">{resource.common.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <TableSkeleton rows={5} column={6} />
            ) : data.length === 0 ? (
              <TableNoRecord column={6} message={resource.common.no_record} />
            ) : (
              data.map((item) => <SystemLogTableRow key={item.id} item={item} />)
            )}
          </tbody>
        </table>
      </div>
      {totalPages >= 1 && (
        <div className="flex items-center justify-between px-1 py-2">
          <span className="text-xs font-mono text-gray-500">
            {formatString(
              resource.common.pagination_info,
              (currentPage - 1) * pageSize + 1,
              Math.min(currentPage * pageSize, totalCount),
              totalCount
            )}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1 || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-xs font-bold uppercase disabled:opacity-30 transition-all"
            >
              {resource.common.previous}
            </button>
            <button
              disabled={currentPage === totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-xs font-bold uppercase disabled:opacity-30 transition-all"
            >
              {resource.common.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default SystemLogTable;