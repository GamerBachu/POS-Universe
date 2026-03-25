import { useState, useCallback, useMemo } from "react";
import { orderServiceApi } from "@/api/orderServiceApi";
import { useAuth } from "@/contexts/authorize";
import resource from "@/locales/en.json";
import type { IOrder } from "@/types/orders";
import { OrderStatusList } from "@/types/terminal1";
import Button from "@/components/Button";
import { LoggerUtils } from "@/utils";
import { getIsDangerousAction } from "./utils";
import { AlertError } from "@/components/ActionStatusMessage";
import { CloseIcon } from "@/libs/icons";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";

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
            setError(resource.product_inventory.select_attribute);
            return;
        }
        if (!trimmedReason) {
            setError(resource.pos_t1.error_cancellation_reason_required);
            return;
        }

        const userId = auth.info.authUser?.userId ?? 0;
        if (!userId) {
            setError(resource.pos_t1.msg_invalid_user);
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
            setError(resource.common.error);
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
    ]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[1px]"
            onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-150">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300">
                            {resource.pos_t1.manage_title.replace(
                                "{orderNumber}",
                                order.orderNumber,
                            )}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Informational Hint */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                            {resource.pos_t1.manage_desc}
                        </p>
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-1">
                        <label
                            className="text-xs font-bold uppercase text-gray-500"
                            htmlFor="status"
                        >
                            {resource.common.status}
                        </label>

                        <Select
                            name="status"
                            value={status}
                            disabled={false}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="-1">{resource.common.select}</option>
                            {statusOptions.map((opt) => (
                                <option key={opt.key} value={opt.value}>
                                    {opt.value}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Reason Textarea */}
                    <div className="space-y-1">
                        <label
                            className="text-xs font-bold uppercase text-gray-500"
                            htmlFor="descContent"
                        >
                            {resource.pos_t1.manage_reason}
                        </label>
                        <TextArea
                            name="descContent"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onKeyDown={(e) =>
                                (e.ctrlKey || e.metaKey) &&
                                e.key === "Enter" &&
                                handleUpdateStatus()
                            }
                            placeholder={resource.pos_t1.manage_ph_reason}
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
                        title={resource.common.cancel}
                    >
                        {resource.common.cancel}
                    </Button>
                    <Button
                        type="button"
                        title={resource.common.update}
                        onClick={handleUpdateStatus}
                        isLoading={isSubmitting}
                        className={` ${isDangerousAction
                            ? "bg-red-600 hover:bg-red-700 py-2"
                            : "bg-teal-600 hover:bg-teal-700 py-2"
                            }`}
                    >
                        {resource.common.update}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderStatusManage;
