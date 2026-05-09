import { useActionState, useCallback, useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";

import { masterProductAttributeApi } from "@/api";
import { type IMasterProductAttribute } from "@/types/masters";
import type { IActionState } from "@/types/actionState";
import CommonLayout from "@/layouts/CommonLayout";
import { PATHS } from "@/routes/paths";
import LoggerUtils from "@/utils/logger";
import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/language";
import { TextBoxWithLabel } from "@/components/input";
import { Button } from "@/components/button";
import RadioActiveToggle from "@/components/RadioActiveToggle";

const AttributeForm = () => {
  // Directly extract and normalize params
  const { id: rawId, action: rawAction } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const id = Number(rawId);
  const action = rawAction?.toLowerCase() || "";

  const [initialData, setInitialData] = useState<IMasterProductAttribute>({
    id: 0,
    isActive: true,
    name: "",
  });

  const onSendBack = useCallback(() => {
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(PATHS.MASTER_ATTRIBUTE_LIST);
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
    _: IActionState | null,
    formData: FormData,
  ): Promise<IActionState> => {
    try {
      // 1. Delete Logic
      if (action === "delete") {
        const res = await masterProductAttributeApi.delete(id);
        if (res.success) {
          onSendBack();
          return { success: true, message: t("common.success_delete") };
        }
        return { success: false, message: t("common.fail_delete") };
      }

      // 2. Add/Edit Logic
      const name = formData.get("name") as string;
      const isActive = formData.get("isActive") === "on";

      if (!name?.trim()) {
        return {
          success: false,
          message: t("common.req_name"),
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
          message: t("common.req_name"),
        };
      }
      if (response.status === 409) {
        return {
          success: false,
          message: t("mst_product_attribute.already_exists"),
        };
      }

      if (
        (response.status === 200 || response.status === 201) &&
        response.success
      ) {
        setInitialData(payload);
        return { success: true, message: t("common.success_save") };
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
        message: t("common.error"),
      };
    } catch (error: unknown) {
      LoggerUtils.logCatch(error, "AttributeForm", "handleAction", "107");
      return {
        success: false,
        message: t("common.error"),
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleAction, null);

  const isReadOnly = action === "view" || action === "delete";

  console.log(action, data);

  return (
    <CommonLayout h1={t("navigation.master_pro__attr_label")}>
      <PageHeader
        subtitle={`${action} ${t("navigation.master_pro__attr_label")}`}
        btnClass="bg-gray-600 hover:bg-gray-700"
        btnLabel={t("common.back_page")}
        onClick={onSendBack}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <form
          key={initialData.id}
          action={formAction}
          className="p-3 space-y-3"
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <TextBoxWithLabel
                label={t("common.name")}
                name="name"
                required
                disabled={isReadOnly || isPending}
                defaultValue={initialData.name}
                key={`name-${initialData.name}`}
                placeholder={t("common.ph_name")}
              />
            </div>

            <RadioActiveToggle
              isActive={initialData.isActive}
              isReadOnly={isReadOnly}
              title={t("common.active")}
              desc={t("mst_product_attribute.toggle_active")}
              name="isActive"
            />

          </div>
          {state?.success === true && <AlertSuccess message={state?.message} />}
          {state?.success === false && <AlertError message={state?.message} />}

          <div className="flex items-center justify-end gap-2 pt-4 border-t dark:border-gray-700">
            <Button
              variant="secondary"
              onClick={onSendBack}>
              {t("common.back_page")}
            </Button>
            {action === "delete" && (
              <Button
                variant="danger"
                disabled={isPending}
                title={t("common.delete")}
                type="submit"
              >
                {t("common.delete")}
              </Button>
            )}

            {(action === "edit" || action === "add") && (
              <Button
                variant="primary"
                disabled={isPending}
                title={t("common.save")}
                type="submit"
              >
                {t("common.save")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </CommonLayout>
  );
};

export default AttributeForm;
