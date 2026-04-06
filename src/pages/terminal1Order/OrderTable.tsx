import { useEffect, useState, useCallback } from "react";
import { type IOrder } from "@/types/orders";
import { orderServiceApi } from "@/api/orderServiceApi";
import { useLanguage } from "@/contexts/language";
import OrderTableRow from "./OrderTableRow";
import TableSkeleton from "@/components/TableSkeleton";
import { useSearchParams } from "react-router-dom";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Pagination from "@/components/Pagination";

const OrderTable: React.FC = () => {
    const { t } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();

    // URL States
    const orderNumber = searchParams.get("orderNumber") || "";

    const currentPage = Number(searchParams.get("page")) || 1;

    // Local UI States for Inputs
    const [localFilters, setLocalFilters] = useState({ orderNumber });

    const [data, setData] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await orderServiceApi.getFilteredOrders({ orderNumber: localFilters.orderNumber, currentPage, pageSize });
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
    }, [localFilters.orderNumber, currentPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (field: keyof typeof localFilters, value: string) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = () => {
        setSearchParams({ ...localFilters, page: "1" });
    };

    const handleClear = () => {
        const cleared = { orderNumber: "", };
        setLocalFilters(cleared);
        setSearchParams({ ...cleared, page: "1" });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ ...localFilters, page: newPage.toString() });
    };


    return (
        <div className="space-y-2">

            <div
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-center p-3 border border-gray-200 dark:border-gray-700">
                <Input
                    type="text"
                    placeholder={t("pos_t1.col_order_no")}
                    value={localFilters.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                    name="orderNumber"
                />
                <div className="flex gap-1 lg:justify-end">
                    <Button
                        onClick={handleApplyFilters}
                        isLoading={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 py-1.5"
                    >
                        {t("common.search")}
                    </Button>
                    <Button
                        onClick={handleClear}
                        isLoading={isLoading}
                        className="bg-gray-600 hover:bg-gray-700 py-1.5"
                    >
                        {t("common.reset")}
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
                <table className="w-full min-w-[700px] text-left border-collapse table-auto">
                    <thead>
                        <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                            <th className="p-3 w-16">{t("common.id")}</th>
                            <th className="p-3">{t("pos_t1.col_order_no")}</th>
                            <th className="p-3 text-center">{t("pos_t1.col_date")}</th>
                            <th className="p-3 text-right">{t("pos_t1.col_total")}</th>
                            <th className="p-3 text-center">{t("common.status")}</th>
                            <th className="p-3 w-44 text-center">{t("common.action")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
                        {isLoading ? (
                            <TableSkeleton rows={pageSize} column={6} />
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-sm text-gray-500 italic">
                                    {t("common.no_record")}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <OrderTableRow key={item.id} item={item} />
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

export default OrderTable; 