import { useEffect, useState, useCallback } from "react";
import { type IMasterProductAttribute } from "@/types/masters";
import { masterProductAttributeApi } from "@/api";
import { useLanguage } from "@/contexts/language";
import AttributeTableRow from "./AttributeTableRow";
import TableSkeleton from "@/components/TableSkeleton";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Pagination from "@/components/Pagination";

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


    const { t } = useLanguage();
    return (
        <div className="space-y-2">
            <div
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-center p-3 border border-gray-200 dark:border-gray-700">
                <Input
                    type="text"
                    placeholder={t("common.search_name")}
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />

                <Select
                    value={localActive}
                    onChange={(e) => setLocalActive(e.target.value)}
                >
                    <option value="">{t("common.all_status")}</option>
                    <option value="true">{t("common.active")}</option>
                    <option value="false">{t("common.inactive")}</option>
                </Select>

                <div className="flex gap-1 lg:justify-end">
                    <Button
                        onClick={handleApplyFilters}
                        className="bg-blue-600 hover:bg-blue-700 py-1.5"
                        isLoading={isLoading}
                    >
                        {t("common.search")}
                    </Button>
                    <Button
                        onClick={handleClear}
                        className="bg-gray-600 hover:bg-gray-700 py-1.5"
                        isLoading={isLoading}
                    >
                        {t("common.reset")}
                    </Button>
                </div>
            </div>

            <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
                <table className="w-full min-w-[700px] text-left border-collapse table-auto">
                    <thead>
                        <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                            <th className="p-3 w-15">{t("common.id")}</th>
                            <th className="p-3 ">{t("common.name")}</th>
                            <th className="p-3 w-22 text-center">{t("common.status")}</th>
                            <th className="p-3 w-44 text-center">{t("common.action")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoading ? (
                            <TableSkeleton rows={5} column={4} />
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-sm text-gray-500 italic bg-gray-50/30">
                                    {t("common.no_record")}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => <AttributeTableRow key={item.id} item={item} />)
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

export default AttributeTable;