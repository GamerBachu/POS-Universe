import { useEffect, useState, useCallback } from "react";
import { type IOrder } from "@/types/orders";
import { orderServiceApi } from "@/api/orderServiceApi";
import { useLanguage } from "@/contexts/language";
import OrderTableRow from "./OrderTableRow";
import TableSkeleton from "@/components/TableSkeleton";
import { useSearchParams } from "react-router-dom";

import { TextBoxWithLabel } from "@/components/input";
import { PrimaryButton, SecondaryButton, } from "@/components/button";

import Pagination from "@/components/Pagination";
import TableNoRecord from "@/components/TableNoRecord";

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

            <div className="bg-white dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                <div className="flex flex-col lg:flex-row items-end gap-4 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 w-full">
                        <TextBoxWithLabel
                            label={t("common.name")}
                            placeholder={t("pos_t1.col_order_no")}
                            value={localFilters.orderNumber}
                            onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                            name="orderNumber"
                        />
                    </div>
                    <div className="flex gap-2 pb-0.5 w-full lg:w-auto justify-end">
                        <PrimaryButton
                            onClick={handleApplyFilters}
                            isLoading={isLoading}
                            title={t("common.search")}
                            className="px-6"
                        >
                            {t("common.search")}
                        </PrimaryButton>
                        <SecondaryButton
                            onClick={handleClear}
                            isLoading={isLoading}
                            title={t("common.reset")}
                            className="px-8"
                        >
                            {t("common.reset")}
                        </SecondaryButton>
                    </div>
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
                            <TableNoRecord column={6} message={t("common.no_record")} />
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