import { useActionState, useEffect } from "react";
import { useTerminalDispatch, useTerminalState } from "./TerminalContext";
import type { ICustomer } from "@/types/customer";
import type { IActionState } from "@/types/actionState";
import { useLanguage } from "@/contexts/language";
import Modal from "@/components/Modal";
import { LoggerUtils } from "@/utils";
import { AlertError, AlertSuccess } from "@/components/ActionStatusMessage";
import { TextBoxWithLabel } from "@/components/input";
import { Button } from "@/components/button";

interface CustomerFormProps {
    onClose: () => void;
}


const CustomerForm = ({ onClose }: CustomerFormProps) => {
    const dispatch = useTerminalDispatch();
    const { customer: currentCustomer } = useTerminalState();
    const { t } = useLanguage();

    const handleAction = async (
        prev: IActionState | null,
        formData: FormData,
    ): Promise<IActionState> => {
        try {
            const customer: ICustomer = {
                name: (formData.get("name") as string) || "",
                phone: (formData.get("phone") as string) || "",
                email: (formData.get("email") as string) || "",
                address: (formData.get("address") as string) || "",
                createdAt: "",
                id: 0,
            };

            dispatch({ type: "SET_CUSTOMER", customer });
            dispatch({
                type: "SET_ALERT",
                alert: {
                    type: "success",
                    message: t("pos_t1.success_save"),
                },
            });

            onClose();
            return { success: true, message: t("pos_t1.msg_customer_saved") };
        } catch (error) {
            LoggerUtils.logCatch(error, "CustomerForm", "handleAction", JSON.stringify(prev));
            return { success: false, message: t("common.error") };

        }
    };
    // Keyboard Shortcuts Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // FIX: React 19 useActionState returns [state, action, isPending]
    const [state, formAction, isPending] = useActionState(handleAction, null);

    const handleClear = () => {
        dispatch({ type: "SET_CUSTOMER", customer: null });
        onClose();
    };
    return (
        <Modal className="w-full max-w-sm" title={t("pos_t1.customer_profile")} onClose={onClose}>
            <form action={formAction} className="p-4 space-y-3">
                <div className="space-y-3">
                    <TextBoxWithLabel
                        label={t("pos_t1.full_name")}

                        name="name"
                        defaultValue={currentCustomer?.name}
                        autoFocus
                        placeholder={t("pos_t1.ph_guest_walk_in")}
                    />

                    <TextBoxWithLabel
                        label={t("pos_t1.phone")}
                        name="phone"
                        defaultValue={currentCustomer?.phone}
                        placeholder={t("pos_t1.phone")}

                    />

                    <TextBoxWithLabel
                        label={t("pos_t1.email")}
                        name="email"
                        type="email"
                        defaultValue={currentCustomer?.email}
                        placeholder={t("pos_t1.email")}
                    />


                    <TextBoxWithLabel
                        label={t("pos_t1.address")}
                        name="address"
                        defaultValue={currentCustomer?.address}
                        placeholder={t("pos_t1.ph_address")}
                    />
                </div>
                {(state?.success === true) && <AlertSuccess message={state?.message} />}
                {(state?.success === false) && <AlertError message={state?.message} />}
                {/* Footer Actions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="secondary"
                        onClick={handleClear}
                        title={t("pos_t1.clear")}
                    >
                        {t("pos_t1.clear")}
                    </Button>
                    <Button
                        variant="primary"
                        disabled={isPending}
                        title={t("common.save")}
                        type="submit"
                    >
                        {isPending ? t("pos_t1.saving") : t("pos_t1.save")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CustomerForm;
