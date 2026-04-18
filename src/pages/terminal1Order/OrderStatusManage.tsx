import { useState, useCallback, useMemo } from "react";
import { orderServiceApi } from "@/api/orderServiceApi";
import { useAuth } from "@/contexts/authorize";
import { useLanguage } from "@/contexts/language";
import type { IOrder } from "@/types/orders";
import { OrderStatusList } from "@/types/terminal1";
import Button from "@/components/Button";
import { LoggerUtils } from "@/utils";
import { getIsDangerousAction } from "./utils";
import { AlertError } from "@/components/ActionStatusMessage";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import Modal from "@/components/Modal";

interface OrderStatusManageProps {
    order: IOrder;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const OrderStatusManage = ({
    order,
    isOpen,
    onClose,
    onSuccess,
}: OrderStatusManageProps) => {
    const auth = useAuth();
    const { t } = useLanguage();

    const [reason, setReason] = useState("");
    const [status, setStatus] = useState(String(order.status));
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusOptions = useMemo(() => {
        return OrderStatusList.map((item) => ({
            key: item,
            value: item,
        }));
    }, []);

    const isDangerousAction = useMemo(
        () => getIsDangerousAction(status),
        [status],
    );

    const handleUpdateStatus = useCallback(async () => {
        const trimmedReason = reason.trim();
        if (status === "-1" || !status) {
            setError(t("product_inventory.select_attribute"));
            return;
        }
        if (!trimmedReason) {
            setError(t("pos_t1.error_cancellation_reason_required"));
            return;
        }

        const userId = auth.info.authUser?.userId ?? 0;
        if (!userId) {
            setError(t("common.session_expired"));
            return;
        }

        try {
            setError("");
            setIsSubmitting(true);
            const response = await orderServiceApi.updateStatus(
                order.id!,
                status,
                trimmedReason,
                userId,
            );
            if (response.success) {
                onSuccess();
                onClose();
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError(t("common.error"));
            LoggerUtils.logCatch(
                err,
                "OrderCancellationModal",
                "handleUpdateStatus",
                JSON.stringify({ orderId: order.id }),
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [
        reason,
        status,
        auth.info.authUser?.userId,
        order.id,
        onSuccess,
        onClose,
        t
    ]);

    if (!isOpen) return null;

    return (
        <Modal
            className="w-full max-w-sm"
            title={t("pos_t1.manage_title").replace("{orderNumber}", order.orderNumber,)}
            onClose={onClose}
        >
            <div className="p-5 space-y-4">
                {/* Informational Hint */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                        {t("pos_t1.manage_desc")}
                    </p>
                </div>

                {/* Status Selection */}
                <div className="space-y-1">
                    <label
                        className="text-xs font-bold uppercase text-gray-500"
                        htmlFor="status"
                    >
                        {t("common.status")}
                    </label>

                    <Select
                        name="status"
                        value={status}
                        disabled={false}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="-1">{t("common.select")}</option>
                        {statusOptions.map((opt) => (
                            <option key={opt.key} value={opt.value}>
                                {opt.value}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Reason Textarea */}
                <div className="space-y-1">
                    <TextArea
                        name="descContent"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        onKeyDown={(e) =>
                            (e.ctrlKey || e.metaKey) &&
                            e.key === "Enter" &&
                            handleUpdateStatus()
                        }
                        placeholder={t("pos_t1.manage_ph_reason")}
                        rows={3}
                    />
                </div>

                {error && <AlertError message={error} />}
            </div>

            <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                <Button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="bg-gray-600 hover:bg-gray-700 py-2"
                    title={t("common.cancel")}
                >
                    {t("common.cancel")}
                </Button>
                <Button
                    type="button"
                    title={t("common.update")}
                    onClick={handleUpdateStatus}
                    isLoading={isSubmitting}
                    className={` ${isDangerousAction
                        ? "bg-red-600 hover:bg-red-700 py-2"
                        : "bg-teal-600 hover:bg-teal-700 py-2"
                        }`}
                >
                    {t("common.update")}
                </Button>
            </div>
        </Modal>
    );
};

export default OrderStatusManage;
