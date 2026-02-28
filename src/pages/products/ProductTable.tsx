import { useEffect, useState, useCallback } from "react";
import { type IProduct } from "@/types/product";
import { productApi } from "@/api/productApi";
import resource from "@/locales/en.json";
import ProductTableRow from "./ProductTableRow";
import TableSkeleton from "@/components/TableSkeleton";
import { useSearchParams } from "react-router-dom";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";

const ProductTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL States
  const name = searchParams.get("name") || "";
  const code = searchParams.get("code") || "";
  const sku = searchParams.get("sku") || "";
  const barcode = searchParams.get("barcode") || "";
  const activeFilter = searchParams.get("active") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Local UI States for Inputs
  const [localFilters, setLocalFilters] = useState({
    name, code, sku, barcode, active: activeFilter
  });

  const [data, setData] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getFiltered(
        name, code, sku, barcode, activeFilter, currentPage, pageSize
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
  }, [name, code, sku, barcode, activeFilter, currentPage]);

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
    const cleared = { name: "", code: "", sku: "", barcode: "", active: "" };
    setLocalFilters(cleared);
    setSearchParams({ ...cleared, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ ...localFilters, page: newPage.toString() });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const formatString = (template: string, ...args: (string | number)[]) => {
    return template.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] !== 'undefined' ? String(args[number]) : match;
    });
  };

  return (
    <div className="space-y-4">

      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2  p-3 border border-gray-200 dark:border-gray-700">
        <Input
          type="text"
          placeholder={resource.product_inventory.ph_name}
          value={localFilters.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}

        />
        <Input
          type="text"
          placeholder={resource.product_inventory.ph_code}
          value={localFilters.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}

        />
        <Input
          type="text"
          placeholder={resource.product_inventory.ph_sku}
          value={localFilters.sku}
          onChange={(e) => handleInputChange('sku', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}

        />
        <Input
          type="text"
          placeholder={resource.product_inventory.ph_barcode}
          value={localFilters.barcode}
          onChange={(e) => handleInputChange('barcode', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}

        />

        <Select
          value={localFilters.active}
          onChange={(e) => handleInputChange('active', e.target.value)}
          className="px-3 py-1.5 text-sm border rounded bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">{resource.common.all_status}</option>
          <option value="true">{resource.product_inventory.active}</option>
          <option value="false">{resource.product_inventory.inactive}</option>
        </Select>

        <div className="flex gap-1">
          <Button
            onClick={handleApplyFilters}
            isLoading={isLoading}
          >
            {resource.common.search}
          </Button>
          <Button
            onClick={handleClear}
            isLoading={isLoading}
            className="bg-gray-600 hover:bg-gray-700"
          >
            {resource.common.reset}
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left border-collapse table-auto sm:table-fixed">
          <thead>
            <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <th className="p-3 w-16">{resource.common.id}</th>
              <th className="p-3 min-w-[150px]">{resource.product_inventory.name}</th>
              <th className="p-3 w-32">{resource.product_inventory.sku}</th>
              <th className="p-3 w-24 text-right">{resource.product_inventory.selling_price}</th>
              <th className="p-3 w-24 text-center">{resource.product_inventory.stock}</th>
              <th className="p-3 w-20 text-center">{resource.common.status}</th>
              <th className="p-3 w-44 text-center">{resource.common.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
            {isLoading ? (
              <TableSkeleton rows={pageSize} column={7} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-gray-500 italic">
                  {resource.common.no_record}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <ProductTableRow key={item.id} item={item} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded text-xs font-bold uppercase disabled:opacity-30 transition-all"
            >
              {resource.common.previous}
            </button>
            <button
              disabled={currentPage === totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded text-xs font-bold uppercase disabled:opacity-30 transition-all"
            >
              {resource.common.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;