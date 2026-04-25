import { useActionState } from "react";
import { useLanguage } from "@/contexts/language";
import { userApi } from "@/api";
import { LoggerUtils } from "@/utils";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";

import InputWithLabel from "@/components/InputWithLabel";
import type { IActionState } from "@/types/actionState";

/**
 * UserPasswordChangeModal Component
 * Specialized modal for password changes using React 19 Action State.
 */
interface UserPasswordChangeModalProps {
    isOpen: boolean;
    userId: number;
    onClose: () => void;
}

interface FormPayload {
    password: string;
    newPassword: string;
    confirmPassword: string;
}

const UserPasswordChangeModal = ({
    isOpen,
    userId,
    onClose,
}: UserPasswordChangeModalProps) => {
    const { t } = useLanguage();

    /**
     * Server-side style action for handling password updates
     */
    const updatePasswordAction = async (
        _: IActionState | null,
        formData: FormData,
    ): Promise<IActionState> => {
        try {
            // Mapping FormData to our interface
            const data: FormPayload = {
                password: formData.get("password") as string,
                newPassword: formData.get("newPassword") as string,
                confirmPassword: formData.get("confirmPassword") as string,
            };

            if (!data.password || !data.newPassword || !data.confirmPassword) {
                return {
                    success: false,
                    message: t("login.invalid_credentials"),
                };
            }

            if (data.newPassword !== data.confirmPassword) {
                return {
                    success: false,
                    message: t("profile.password_mismatch"),
                };
            }

            const response = await userApi.updatePassword(
                userId,
                data.password,
                data.newPassword,
            );

            if (!response) {
                return { success: false, message: t("common.error") };
            }

            // Handling statuses based on our ServiceResponse structure
            switch (response.status) {
                case 201:
                    return { success: true, message: t("profile.password_changed") };
                case 400:
                    return { success: false, message: t("login.invalid_credentials") };
                default:
                    return { success: false, message: t("common.error") };
            }
        } catch (error: unknown) {
            LoggerUtils.logCatch(
                error,
                "UserPasswordChangeModal",
                "updatePasswordAction",
            );
            return { success: false, message: t("common.error") };
        }
    };

    // Hook into React 19 Action State
    const [state, formAction, isPending] = useActionState(
        updatePasswordAction,
        null,
    );

    if (!isOpen) return null;
    return (
        <Modal
            className="w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl"
            title={t("profile.updatePassword")}
            onClose={onClose}
        >
            <form
                action={formAction}
                className="flex flex-col bg-white dark:bg-gray-900 p-6 gap-4"
            >
                <InputWithLabel
                    label={t("common.password")}
                    type="password"
                    name="password"
                    placeholder={t("common.ph_password")}
                    required={true}
                />
                <InputWithLabel
                    label={t("common.new_password")}
                    type="password"
                    name="newPassword"
                    placeholder={t("common.ph_new_password")}
                    required={true}
                />
                <InputWithLabel
                    label={t("common.confirm_password")}
                    type="password"
                    name="confirmPassword"
                    placeholder={t("common.ph_confirm_password")}
                    required={true}
                />
                {state?.success === true && <AlertSuccess message={state?.message} />}
                {state?.success === false && <AlertError message={state?.message} />}

                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <Button
                        type="reset"
                        onClick={onClose}
                        className="flex-1 bg-gray-600 hover:bg-gray-700"
                        title={t("common.cancel")}
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button
                        type="submit"
                        className="flex-[2] bg-teal-600 hover:bg-teal-700"
                        title={t("common.update")}
                        isLoading={isPending}
                    >
                        {t("common.update")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UserPasswordChangeModal;
