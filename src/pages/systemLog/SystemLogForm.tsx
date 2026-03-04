import { useActionState, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import resource from "@/locales/en.json";
import { systemLogApi } from "@/api";
import { type ISystemLog } from "@/types/systemLog";
import type { IActionState } from "@/types/actionState";
import CommonLayout from "@/layouts/CommonLayout";
import { PATHS } from "@/routes/paths";
import { toLocalForInput, toUTCForDB } from "@/utils/helper/dateUtils";
import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/Button";

const SystemLogForm = () => {
  // Directly extract and normalize params
  const { id: rawId, action: rawAction } = useParams();
  const navigate = useNavigate();

  const id = Number(rawId);
  const action = rawAction?.toLowerCase() || "";

  const [initialData, setInitialData] = useState<ISystemLog>({
    id: 0,
    type: "",
    pageName: "",
    functionName: "",
    data: "",
    timestamp: "",
    message: "",
    stackTrace: "",
  });

  const onSendBack = useCallback(
    () => {
      if (window.history.length > 1 && window.history.state?.idx > 0) {
        navigate(-1);
      } else {
        navigate(PATHS.SYSTEM_LOG_LIST);
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
      systemLogApi
        .getById(id)
        .then((res) => {
          if (res.success && res.data) {
            setInitialData(res.data);
          } else {
            onSendBack();
          }
        })
        .catch(() => onSendBack());
    }
  }, [id, action, onSendBack]);

  const handleAction = async (
    prevState: IActionState | null,
    formData: FormData,
  ): Promise<IActionState> => {
    try {
      // 1. Delete Logic
      if (action === "delete") {
        const res = await systemLogApi.delete(id);
        if (res.success) {
          onSendBack();
          return { success: true, message: resource.common.success_delete };
        }
        return { success: false, message: resource.common.fail_delete };
      }

      // 2. Add/Edit Logic

      const type = formData.get("type") as string;
      const pageName = formData.get("pageName") as string;
      const functionName = formData.get("functionName") as string;
      const timestamp = formData.get("timestamp") as string;
      const data = formData.get("data") as string;
      const message = formData.get("message") as string;
      const stackTrace = formData.get("stackTrace") as string;

      if (!type?.trim() || !pageName?.trim() || !functionName?.trim()) {
        return {
          success: false,
          message: resource.common.req_name,
        };
      }

      const payload: ISystemLog = {
        id: action === "edit" ? id : 0,
        type: type.trim(),
        pageName: pageName.trim(),
        functionName: functionName.trim(),
        data: data.trim(),
        timestamp: toUTCForDB(timestamp.trim()),
        message: message.trim(),
        stackTrace: stackTrace.trim(),
      };

      const response =
        action === "edit"
          ? await systemLogApi.update(id, payload)
          : await systemLogApi.add(payload);

      if (response.success) {
        setInitialData(payload);
        // Optional: you could navigate back here automatically
        // onSendBack("0");
        return { success: true, message: resource.common.success_save };
      }

      return {
        success: false,
        message: resource.common.error,
      };
    } catch {
      return {
        success: false,
        message: resource.common.error,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleAction, null);

  const isReadOnly = action === "view" || action === "delete";

  return (
    <CommonLayout h1={resource.navigation.system_log_list_label}>

      <PageHeader
        subtitle={`${action} ${resource.navigation.system_log_list_label}`}
        btnClass="bg-gray-600 hover:bg-gray-700"
        btnLabel={resource.common.back_page}
        onClick={onSendBack}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <form action={formAction} className="p-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {resource.system_log.type} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="type"
                disabled={isReadOnly}
                defaultValue={initialData.type}
                placeholder={resource.system_log.ph_type}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
              />
            </div>


            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {resource.system_log.page_name} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="pageName"
                disabled={isReadOnly}
                defaultValue={initialData.pageName}
                placeholder={resource.system_log.ph_page_name}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
              />
            </div>


            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {resource.system_log.function} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="functionName"
                disabled={isReadOnly}
                defaultValue={initialData.functionName}
                placeholder={resource.system_log.ph_function}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {resource.system_log.timestamp}
              </label>
              <input
                type="datetime-local" // Changed from text to datetime-local
                name="timestamp"
                disabled={isReadOnly}
                defaultValue={toLocalForInput(initialData.timestamp)}
                key={`timestamp-${initialData.timestamp}`} // Key ensures it resets when data loads
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all cursor-pointer dark:[color-scheme:dark]"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {resource.system_log.message}
              </label>
              <input
                type="text"
                name="message"
                disabled={isReadOnly}
                defaultValue={initialData.message}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {resource.system_log.data}
              </label>
              <textarea
                name="data"
                disabled={isReadOnly}
                defaultValue={initialData.data}
                rows={3}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all font-mono"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {resource.system_log.stack_trace}
              </label>
              <textarea
                name="stackTrace"
                disabled={isReadOnly}
                defaultValue={initialData.stackTrace}
                rows={5}
                className="w-full px-3 py-2 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-60 transition-all font-mono"
              />
            </div>
          </div>

          {(state?.success === true) && <AlertSuccess message={state?.message} />}
          {(state?.success === false) && <AlertError message={state?.message} />}


          <div className="flex items-center justify-end gap-2 pt-4 border-t dark:border-gray-700">
            <Button
              type="button"
              onClick={onSendBack}
              className="bg-gray-600 hover:bg-gray-700"
            >
              {resource.common.back_page}
            </Button>
            {action !== "view" && (
              <Button
                type="submit"
                disabled={isPending}
                className={`${action === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} disabled:opacity-50 `}
              >
                {isPending ? "..." : action === "delete" ? resource.common.delete : resource.common.save}
              </Button>
            )}
          </div>
        </form>
      </div >
    </CommonLayout >
  );
};
export default SystemLogForm;