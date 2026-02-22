import { useActionState, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import resource from "@/locales/en.json";
import { masterProductAttributeApi } from "@/api";
import { type IMasterProductAttribute } from "@/types/masters";
import type { IActionState } from "@/types/actionState";
import CommonLayout from "@/layouts/CommonLayout";
import { PATHS } from "@/routes/paths";
import LoggerUtils from "@/utils/logger";
 

const AttributeForm = () => {
  // Directly extract and normalize params
  const { id: rawId, action: rawAction } = useParams();
  const navigate = useNavigate();

  const id = Number(rawId);
  const action = rawAction?.toLowerCase() || "";

  const [initialData, setInitialData] = useState<IMasterProductAttribute>({
    id: 0,
    isActive: true,
    name: "",
  });

  const onSendBack = useCallback(
    () => {
      if (window.history.length > 1 && window.history.state?.idx > 0) {
        navigate(-1);
      } else {
        navigate(PATHS.MASTER_ATTRIBUTE_LIST);
      }
    },
    [navigate],
  );

  useEffect(() => {
    // Validate ID and Action early
    if (isNaN(id) || !action) {
      onSendBack();
      return;
    }

    // Only fetch if we aren't adding a new record
    if (action !== "add") {
      masterProductAttributeApi
        .getById(id)
        .then((res) => {
          if (res.success && res.data) {
            setInitialData(res.data);
          } else {
            onSendBack();
          }
        })
        .catch((error: unknown) => {
          LoggerUtils.logCatch(error, "AttributeForm", "getById", "55");
          onSendBack();
        });
    }
  }, [id, action, onSendBack]);

  const handleAction = async (
    prevState: IActionState | null,
    formData: FormData,
  ): Promise<IActionState> => {
    try {
      // 1. Delete Logic
      if (action === "delete") {
        const res = await masterProductAttributeApi.delete(id);
        if (res.success) {
          onSendBack();
          return { success: true, message: resource.common.success_delete };
        }
        return { success: false, message: resource.common.fail_delete };
      }

      // 2. Add/Edit Logic
      const name = formData.get("name") as string;
      const isActive = formData.get("isActive") === "on";

      if (!name?.trim()) {
        return {
          success: false,
          message: resource.common.req_name,
        };
      }

      const payload: IMasterProductAttribute = {
        id: action === "edit" ? id : 0,
        name: name.trim(),
        isActive: isActive,
      };

      const response =
        action === "edit"
          ? await masterProductAttributeApi.update(id, payload)
          : await masterProductAttributeApi.add(payload);


      if (response.status === 400) {
        return {
          success: false,
          message: resource.common.req_name,
        };
      }
      if (response.status === 409) {
        return {
          success: false,
          message: resource.mst_product_attribute.already_exists,
        };
      }

      if ((response.status === 200 || response.status === 201) && response.success) {
        setInitialData(payload);
        return { success: true, message: resource.common.success_save };
      }
      // Handle errors


      LoggerUtils.logError(response, "AttributeForm", "handleAction", JSON.stringify(payload));
      return {
        success: false,
        message: resource.common.error,
      };
    } catch (error: unknown) {
      LoggerUtils.logCatch(error, "AttributeForm", "handleAction", "107");
      return {
        success: false,
        message: resource.common.error,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleAction, null);

  const isReadOnly = action === "view" || action === "delete";

  // useEffect(() => {

  //   const d = new SeedData();
  //   d.masterProductAttribute.forEach(item => {
  //     masterProductAttributeApi.add({
  //       name: item.name,
  //       isActive: true
  //     });
  //   });

  // }, []);


  return (
    <CommonLayout h1={resource.navigation.master_pro__attr_label}>

      <div className="flex justify-between items-center mb-4 px-1">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white capitalize">
          {action} {resource.navigation.master_pro__attr_label}
        </h1>
        <button
          onClick={onSendBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-all"
        >
          {resource.common.back_page}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <form
          key={initialData.id}
          action={formAction}
          className="p-5 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {resource.common.name}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                disabled={isReadOnly}
                defaultValue={initialData.name}
                key={`name-${initialData.name}`}
                placeholder={resource.common.ph_name}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
              />
            </div>
            <label
              htmlFor="isActive"
              className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 ${!isReadOnly ? 'cursor-pointer' : ''}`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {resource.common.active}
                </span>
                <span className="text-sm text-gray-500">
                  {resource.mst_product_attribute.toggle_active}
                </span>
              </div>

              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  disabled={isReadOnly}
                  defaultChecked={initialData.isActive}
                  key={`active-${initialData.isActive}`}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 rounded-full peer bg-red-200 dark:bg-red-900/40 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none disabled:opacity-50"></div>
              </div>
            </label>
          </div>
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
          <div className="flex items-center justify-end gap-2 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onSendBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-all"
            >
              {resource.common.back_page}
            </button>
            {action !== "view" && (
              <button
                type="submit"
                disabled={isPending}
                className={`${action === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm active:scale-95 transition-all`}
              >
                {isPending ? "..." : action === "delete" ? resource.common.delete : resource.common.save}
              </button>
            )}
          </div>
        </form>
      </div >
    </CommonLayout >
  );
};

export default AttributeForm;