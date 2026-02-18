import { useEffect, useState, useCallback } from "react";
import { type IMasterProductAttribute } from "@/types/masters";
import { masterProductAttributeApi } from "@/api";
import resource from "@/locales/en.json";
import AttributeTableRow from "./AttributeTableRow";
import TableSkeleton from "./TableSkeleton";

const AttributeTable = () => {
    const [data, setData] = useState<IMasterProductAttribute[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await masterProductAttributeApi.getAll();
            if (res.data) setData(res.data);
        } catch {
            // console.error("Failed to fetch attributes", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left border-collapse table-auto sm:table-fixed">
                <thead>
                    <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        <th className="p-3 w-16">{resource.mst_product_attribute.lblId}</th>
                        <th className="p-3 min-w-[150px]">{resource.mst_product_attribute.lblName}</th>
                        <th className="p-3 w-24 text-center">{resource.mst_product_attribute.lblActive}</th>
                        <th className="p-3 w-32 text-right">{resource.common.btnAction}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
                        <TableSkeleton />
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-sm text-gray-500 italic bg-gray-50/30">
                                {resource.common.noData}
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <AttributeTableRow key={item.id} item={item} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttributeTable;