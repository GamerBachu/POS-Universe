import { useEffect, useState, useCallback } from "react";
import { type IProduct } from "@/types/product";
import { productApi } from "@/api/productApi";
import { useLanguage } from "@/contexts/language";
import ProductTableRow from "./ProductTableRow";
import TableSkeleton from "@/components/TableSkeleton";
import { useSearchParams } from "react-router-dom";
import Pagination from "@/components/Pagination";
import TableNoRecord from "@/components/TableNoRecord";
import { SelectWithLabel, TextBoxWithLabel } from "@/components/input";
import { PrimaryButton, SecondaryButton } from "@/components/button";

const ProductTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  // URL States
  const name = searchParams.get("name") || "";
  const code = searchParams.get("code") || "";
  const sku = searchParams.get("sku") || "";
  const barcode = searchParams.get("barcode") || "";
  const activeFilter = searchParams.get("active") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Local UI States for Inputs
  const [localFilters, setLocalFilters] = useState({
    name,
    code,
    sku,
    barcode,
    active: activeFilter,
  });

  const [data, setData] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productApi.getFiltered(
        name,
        code,
        sku,
        barcode,
        activeFilter,
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
  }, [name, code, sku, barcode, activeFilter, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (
    field: keyof typeof localFilters,
    value: string,
  ) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
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

  return (
    <div className="space-y-2">
      <div className="bg-white dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-end gap-4 p-4">
          {/* Inputs Section: Starts from left and expands */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 flex-1 w-full">
            <TextBoxWithLabel
              label={t("product_inventory.name")}
              placeholder={t("product_inventory.ph_name")}
              value={localFilters.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
            <TextBoxWithLabel
              label={t("product_inventory.code")}
              placeholder={t("product_inventory.ph_code")}
              value={localFilters.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
            <TextBoxWithLabel
              label={t("product_inventory.sku")}
              placeholder={t("product_inventory.ph_sku")}
              value={localFilters.sku}
              onChange={(e) => handleInputChange("sku", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
            <TextBoxWithLabel
              label={t("product_inventory.barcode")}
              placeholder={t("product_inventory.ph_barcode")}
              value={localFilters.barcode}
              onChange={(e) => handleInputChange("barcode", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
            <SelectWithLabel
              label={t("common.status")}
              value={localFilters.active}
              onChange={(e) => handleInputChange("active", e.target.value)}
            >
              <option value="">{t("common.all_status")}</option>
              <option value="true">{t("common.active")}</option>
              <option value="false">{t("common.inactive")}</option>
            </SelectWithLabel>
          </div>

          {/* Actions Section: Pushed to the right */}
          <div className="flex gap-2 pb-1 w-full lg:w-auto justify-end">
            <PrimaryButton
              onClick={handleApplyFilters}
              isLoading={isLoading}
              className="px-8"
            >
              {t("common.search")}
            </PrimaryButton>
            <SecondaryButton
              onClick={handleClear}
              isLoading={isLoading}
              className="px-6" // Using Bootstrap secondary style logic
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
            <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <th className="p-3 w-16">{t("common.id")}</th>
              <th className="p-3">{t("product_inventory.name")}</th>
              <th className="p-3">{t("product_inventory.sku")}</th>
              <th className="p-3 text-right">
                {t("product_inventory.selling_price")}
              </th>
              <th className="p-3 text-center">
                {t("product_inventory.stock")}
              </th>
              <th className="p-3 text-center">{t("common.status")}</th>
              <th className="p-3 w-44 text-center">{t("common.action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
            {isLoading ? (
              <TableSkeleton rows={pageSize} column={7} />
            ) : data.length === 0 ? (
              <TableNoRecord column={8} message={t("common.no_record")} />
            ) : (
              data.map((item) => <ProductTableRow key={item.id} item={item} />)
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

export default ProductTable;
