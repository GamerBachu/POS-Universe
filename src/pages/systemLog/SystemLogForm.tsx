import { useActionState, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/language";
import { systemLogApi } from "@/api";
import { type ISystemLog } from "@/types/systemLog";
import type { IActionState } from "@/types/actionState";
import CommonLayout from "@/layouts/CommonLayout";
import { PATHS } from "@/routes/paths";
import { toLocalForInput, toUTCForDB } from "@/utils/helper/dateUtils";
import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";
import PageHeader from "@/components/PageHeader";
import {
  DateTimePicker,
  TextAreaWithLabel,
  TextBoxWithLabel,
} from "@/components/input";
import {
  DangerButton,
  PrimaryButton,
  SecondaryButton,
} from "@/components/button";

const SystemLogForm = () => {
  const { t } = useLanguage();
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

  const onSendBack = useCallback(() => {
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(PATHS.SYSTEM_LOG_LIST);
    }
  }, [navigate]);

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
    _: IActionState | null,
    formData: FormData,
  ): Promise<IActionState> => {
    try {
      // 1. Delete Logic
      if (action === "delete") {
        const res = await systemLogApi.delete(id);
        if (res.success) {
          onSendBack();
          return { success: true, message: t("common.success_delete") };
        }
        return { success: false, message: t("common.fail_delete") };
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
          message: t("common.req_name"),
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
        return { success: true, message: t("common.success_save") };
      }

      return {
        success: false,
        message: t("common.error"),
      };
    } catch {
      return {
        success: false,
        message: t("common.error"),
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleAction, null);

  const isReadOnly = action === "view" || action === "delete";

  return (
    <CommonLayout h1={t("navigation.system_log_list_label")}>
      <PageHeader
        subtitle={`${action} ${t("navigation.system_log_list_label")}`}
        btnClass="bg-gray-600 hover:bg-gray-700"
        btnLabel={t("common.back_page")}
        onClick={onSendBack}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <form action={formAction} className="p-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1">
              <TextBoxWithLabel
                label={t("system_log.type")}
                name="type"
                required
                disabled={isReadOnly || isPending}
                defaultValue={initialData.type}
                placeholder={t("system_log.ph_type")}
              />
            </div>

            <div className="space-y-1">
              <TextBoxWithLabel
                label={t("system_log.page_name")}
                name="pageName"
                required
                disabled={isReadOnly || isPending}
                defaultValue={initialData.pageName}
                placeholder={t("system_log.ph_page_name")}
              />
            </div>

            <div className="space-y-1">
              <TextBoxWithLabel
                label={t("system_log.function")}
                name="functionName"
                required
                disabled={isReadOnly || isPending}
                defaultValue={initialData.functionName}
                placeholder={t("system_log.ph_function")}
              />
            </div>

            <div className="space-y-1">
              <DateTimePicker
                label={t("system_log.timestamp")}
                name="timestamp"
                disabled={isReadOnly}
                defaultValue={toLocalForInput(initialData.timestamp)}
                key={`timestamp-${initialData.timestamp}`} // Key ensures it resets when data loads
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <TextBoxWithLabel
                label={t("system_log.message")}
                name="message"
                required
                disabled={isReadOnly || isPending}
                defaultValue={initialData.message}
                placeholder={t("system_log.ph_message")}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <TextAreaWithLabel
                label={t("system_log.data")}
                name="data"
                disabled={isReadOnly}
                defaultValue={initialData.data}
                rows={3}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <TextAreaWithLabel
                label={t("system_log.stack_trace")}
                name="stackTrace"
                disabled={isReadOnly}
                defaultValue={initialData.stackTrace}
                rows={5}
              />
            </div>
          </div>

          {state?.success === true && <AlertSuccess message={state?.message} />}
          {state?.success === false && <AlertError message={state?.message} />}

          <div className="flex items-center justify-end gap-2 pt-4 border-t dark:border-gray-700">
            <SecondaryButton
              onClick={onSendBack}
              title={t("common.back_page")}
            >
              {t("common.back_page")}
            </SecondaryButton>
            {action === "delete" && (
              <DangerButton
                disabled={isPending}
                title={t("common.delete")}
                type="submit"
              >
                {t("common.delete")}
              </DangerButton>
            )}

            {(action === "edit" || action === "add") && (
              <PrimaryButton
                disabled={isPending}
                title={t("common.save")}
                type="submit"
              >
                {t("common.save")}
              </PrimaryButton>
            )}
          </div>
        </form>
      </div>
    </CommonLayout>
  );
};
export default SystemLogForm;
