import { NavLink } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { type IProduct } from "@/types/product";
import resource from "@/locales/en.json";
import useCurrencySymbol from "@/hooks/useCurrencySymbol";

interface Props {
  item: IProduct;
}

const ProductTableRow = ({ item }: Props) => {
  const currencySymbol = useCurrencySymbol();
  // Logic to determine stock health
  const isLowStock = item.stock <= item.reorderLevel;

  return (
    <tr className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
      {/* ID - Small and Dimmed */}
      <td className="p-3 text-xs font-mono text-gray-400 dark:text-gray-500">
        {item.id}
      </td>

      {/* Product Name & Code */}
      <td className="p-3">
        <div className="flex flex-col">
          <span
            className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px]"
            title={item.name}
          >
            {item.name}
          </span>
          <span className="text-[10px] font-mono uppercase ">{item.code}</span>
        </div>
      </td>

      {/* SKU & Barcode Info */}
      <td className="p-3 text-sm text-gray-600 dark:text-gray-300 font-mono">
        <div className="flex flex-col">
          <span>{item.sku}</span>
          <span className="text-[10px] font-mono uppercase">
            {item.barcode}
          </span>
        </div>
      </td>

      {/* Selling Price - Formatted */}
      <td className="p-3 text-sm text-right font-medium text-gray-700 dark:text-gray-200">
        {currencySymbol}
        {item.sellingPrice.toFixed(2)}
      </td>

      {/* Stock Status Badge */}
      <td className="p-3 text-center">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase ${isLowStock
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}
        >
          {item.stock}
        </span>
      </td>

      {/* Active/Inactive Status */}
      <td className="p-3 text-center">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${item.isActive
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20"
            : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20"
            }`}
        >
          {item.isActive ? resource.common.active : resource.common.inactive}
        </span>
      </td>

      {/* Small Action Button Group */}
      <td className="p-3 text-right">
        <div className="inline-flex items-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <NavLink
            to={`${PATHS.PRODUCT_VIEW}/${item.id}`}
            className="px-2 py-1 text-[11px] font-bold uppercase text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors"
          >
            {resource.common.view}
          </NavLink>

          <NavLink
            to={`${PATHS.PRODUCT_EDIT}/${item.id}`}
            className="px-2 py-1 text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-r border-gray-200 dark:border-gray-700 transition-colors"
          >
            {resource.common.edit}
          </NavLink>

          <NavLink
            to={`${PATHS.PRODUCT_DELETE}/${item.id}`}
            className="px-2 py-1 text-[11px] font-bold uppercase text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            {resource.common.delete}
          </NavLink>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
