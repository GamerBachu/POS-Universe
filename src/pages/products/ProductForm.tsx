import { useCallback, useActionState, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommonLayout from "@/layouts/CommonLayout";
import resource from "@/locales/en.json";
import { PATHS } from "@/routes/paths";
import { productApi } from "@/api/productApi";
import { type IProduct } from "@/types/product";
import { LoggerUtils } from "@/utils";
import type { IActionState } from "@/types/actionState";

const initialState = { success: false, message: "", status: 0 };

const ProductForm = () => {
  const { id: rawId, action: rawAction } = useParams();
  const navigate = useNavigate();
  const id = Number(rawId);
  const action = rawAction?.toLowerCase() || "add";

  const [item, setItem] = useState<IProduct>({
    id: 0,
    code: "",
    sku: "",
    barcode: "",
    name: "",

    costPrice: 0,
    sellingPrice: 0,
    taxRate: 0,

    stock: 0,
    reorderLevel: 5,

    isActive: true,
  });

  const onSendBack = useCallback(() => {
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(PATHS.PRODUCT_LIST);
    }
  }, [navigate]);

  useEffect(() => {
    if (id && action !== "add") {
      productApi.getById(id).then((res) => {
        if (res.success && res.data) setItem(res.data);
      });
    }
  }, [id, action]);

  const handleAction = async (_: IActionState | null, formData: FormData) => {
    try {
      const payload = Object.fromEntries(formData) as Record<string, string>;

      // 1. Delete Logic
      if (action === "delete") {
        const res = await productApi.delete(id);
        if (res.success) {
          onSendBack();
          return { success: true, message: resource.common.success_delete };
        }
        return { success: false, message: resource.common.fail_delete };
      }

      // 2. Add/Edit Logic
      const formattedPayload: IProduct = {
        id: action === "edit" ? id : 0,
        code: payload.code || "",
        sku: payload.sku || "",
        barcode: payload.barcode || "",
        name: payload.name || "",

        costPrice: Number(payload.costPrice),
        sellingPrice: Number(payload.sellingPrice),
        taxRate: Number(payload.taxRate),

        stock: Number(payload.stock),
        reorderLevel: Number(payload.reorderLevel),

        isActive: payload.isActive === "on",
      };
      setItem(formattedPayload);
      // 1.1 Basic Validation
      if (payload.name.trim() === "" || payload.sku.trim() === "") {
        return {
          success: false,
          message: resource.product_inventory.required_fields,
        };
      }

      const response =
        action === "edit"
          ? await productApi.update(id, formattedPayload)
          : await productApi.add(formattedPayload);

      if (response.status === 400) {
        return {
          success: false,
          message: resource.product_inventory.required_fields,
        };
      }
      if (response.status === 409) {
        return {
          success: false,
          message: resource.product_inventory.already_exists,
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          message: resource.product_inventory.product_not_found,
        };
      }

      if ((response.status === 200 || response.status === 201) && response.success) {
        setItem(formattedPayload);
        return { success: true, message: resource.common.success_save };
      }
      // Handle errors
      LoggerUtils.logError(
        response,
        "AttributeForm",
        "handleAction",
        JSON.stringify(payload),
      );
      return {
        success: false,
        message: resource.common.error,
      };
    } catch (error) {
      LoggerUtils.logCatch(error, "ProductForm", "handleAction");
      return { success: false, message: "System error", status: 500 };
    }
  };

  const [state, formAction, isPending] = useActionState(handleAction, initialState);
  const isReadOnly = action === "view" || action === "delete";

  return (
    <CommonLayout h1={resource.navigation.product_list_label}>
      <div className="flex justify-between items-center mb-4 px-1">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white capitalize">
          {action} {resource.product_inventory.name}
        </h1>
        <button
          type="button"
          onClick={() => navigate(PATHS.PRODUCT_LIST)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-all active:scale-95"
        >
          {resource.common.back_page}
        </button>
      </div>

      <form
        key={item.id}
        action={formAction}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6"
      >
        {/* SECTION 1: General Identifiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.code}
            </label>
            <input
              name="code"
              defaultValue={item.code}
              readOnly
              placeholder={resource.common.system_generated}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed outline-none"
            />
          </div>
          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.name}
            </label>
            <input
              name="name"
              defaultValue={item.name}
              required
              readOnly={isReadOnly}
              placeholder={resource.product_inventory.ph_name}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.sku}
            </label>
            <input
              name="sku"
              defaultValue={item.sku}
              readOnly={isReadOnly}
              placeholder={resource.product_inventory.ph_sku}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none"
            />
          </div>
          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.barcode}
            </label>
            <input
              name="barcode"
              defaultValue={item.barcode}
              readOnly={isReadOnly}
              placeholder={resource.product_inventory.ph_barcode}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none"
            />
          </div>
        </div>

        <hr className="dark:border-gray-700" />

        {/* SECTION 2: Financial & Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.cost_price}
            </label>
            <input
              name="costPrice"
              type="number"
              step="1"
              defaultValue={item.costPrice}
              readOnly={isReadOnly}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none text-right"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.selling_price}
            </label>
            <input
              name="sellingPrice"
              type="number"
              step="1"
              defaultValue={item.sellingPrice}
              readOnly={isReadOnly}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none text-right font-semibold text-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.tax_rate}
            </label>
            <input
              name="taxRate"
              type="number"
              step="1"
              defaultValue={item.taxRate}
              readOnly={isReadOnly}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none text-right"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.stock}
            </label>
            <input
              name="stock"
              type="number"
              defaultValue={item.stock}
              readOnly={isReadOnly}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">
              {resource.product_inventory.reorder_level}
            </label>
            <input
              name="reorderLevel"
              type="number"
              defaultValue={item.reorderLevel}
              readOnly={isReadOnly}
              className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none"
            />
          </div>
        </div>

        {/* State Toggle */}
        <label
          htmlFor="isActive"
          className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 ${!isReadOnly ? "cursor-pointer" : ""}`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {resource.common.active}
            </span>
            <span className="text-sm text-gray-500">
              {resource.common.toggle_active}
            </span>
          </div>

          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              disabled={isReadOnly}
              defaultChecked={item.isActive}
              key={`active-${item.isActive}`}
              className="sr-only peer"
            />
            <div className="w-11 h-6 rounded-full peer bg-red-200 dark:bg-red-900/40 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none disabled:opacity-50"></div>
          </div>
        </label>
        {state?.message && (
          <div
            role="alert"
            className={`p-2 rounded text-sm text-center font-medium border ${state.success
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900"
              }`}
          >
            {state.message}
          </div>
        )}
        {/* Action Footer */}
        <div className="flex justify-end gap-2 border-t pt-4 dark:border-gray-700">
          <button
            type="button"
            onClick={onSendBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-all"
          >
            {resource.common.back_page}
          </button>

          {!isReadOnly ? (
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded text-sm font-medium shadow-sm active:scale-95 transition-all"
            >
              {isPending
                ? "..."
                : action === "add"
                  ? resource.common.save
                  : resource.common.update}
            </button>
          ) : (
            action === "delete" && (
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-1.5 rounded text-sm font-medium shadow-sm active:scale-95 transition-all"
              >
                {resource.common.delete}
              </button>
            )
          )}
        </div>
      </form>
    </CommonLayout>
  );
};

export default ProductForm;
