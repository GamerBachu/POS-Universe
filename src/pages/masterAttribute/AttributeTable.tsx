import { useEffect, useState, useCallback } from "react";
import { type IMasterProductAttribute } from "@/types/masters";
import { masterProductAttributeApi } from "@/api";
import resource from "@/locales/en.json";
import AttributeTableRow from "./AttributeTableRow";
import TableSkeleton from "./TableSkeleton";
import { useSearchParams } from "react-router-dom";

const AttributeTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const searchTerm = searchParams.get("q") || "";
    const activeFilter = searchParams.get("active") || "";
    const currentPage = Number(searchParams.get("page")) || 1;

    const [localSearch, setLocalSearch] = useState(searchTerm);
    const [localActive, setLocalActive] = useState(activeFilter);

    const [data, setData] = useState<IMasterProductAttribute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await masterProductAttributeApi.getFiltered(
                searchTerm,
                activeFilter,
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
    }, [searchTerm, currentPage, activeFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApplyFilters = () => {
        setSearchParams({ q: localSearch, active: localActive, page: "1" });
    };

    const handleClear = () => {
        setLocalSearch("");
        setLocalActive("");
        setSearchParams({ q: "", active: "", page: "1" });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ q: searchTerm, active: activeFilter, page: newPage.toString() });
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    const formatString = (template: string, ...args: (string | number)[]) => {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== 'undefined' ? String(args[number]) : match;
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 bg-gray-50/50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                <input
                    type="text"
                    placeholder={resource.common.search_name}
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                    className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-blue-500"
                />

                <select
                    value={localActive}
                    onChange={(e) => setLocalActive(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">{resource.common.all_status}</option>
                    <option value="true">{resource.common.active}</option>
                    <option value="false">{resource.common.inactive}</option>
                </select>

                <div className="flex gap-2 ml-auto">
                    <button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium shadow-sm transition-all active:scale-95">
                        {resource.common.search}
                    </button>
                    <button onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-sm font-medium shadow-sm transition-all active:scale-95">
                        {resource.common.reset}
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left border-collapse table-auto sm:table-fixed">
                    <thead>
                        <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                            <th className="p-3 w-15">{resource.common.id}</th>
                            <th className="p-3 ">{resource.common.name}</th>
                            <th className="p-3 w-22 text-center">{resource.common.status}</th>
                            <th className="p-3 w-44 text-center">{resource.common.action}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoading ? (
                            <TableSkeleton />
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-sm text-gray-500 italic bg-gray-50/30">
                                    {resource.common.no_record}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => <AttributeTableRow key={item.id} item={item} />)
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
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

export default AttributeTable;