import { useState, useCallback } from 'react';
import { orderServiceApi } from '@/api/orderServiceApi';
import { useAuth } from '@/contexts/authorize';
import resource from '@/locales/en.json';
import type { IOrder } from '@/types/orders';

interface OrderCancellationModalProps {
    order: IOrder;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const OrderCancellationModal = ({ order, isOpen, onClose, onSuccess }: OrderCancellationModalProps) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const auth = useAuth();

    const handleCancelOrder = useCallback(async () => {
        if (!reason.trim()) {
            setError(resource.pos_t1.error_cancellation_reason_required);
            return;
        }
        setError('');
        setIsCancelling(true);

        const userId = auth.info.authUser?.userId ?? 0;
        if (!userId) {
            setError(resource.pos_t1.msg_invalid_user);
            setIsCancelling(false);
            return;
        }

        const response = await orderServiceApi.cancelOrder(order.id!, reason, userId);

        if (response.success) {
            onSuccess();
            onClose();
        } else {
            setError(response.message);
        }
        setIsCancelling(false);
    }, [reason, auth.info.authUser, order.id, onSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold mb-4">{resource.pos_t1.title_cancel_order.replace('{orderNumber}', order.orderNumber)}</h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{resource.pos_t1.confirm_cancel_order_message}</p>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder={resource.pos_t1.ph_cancellation_reason} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" rows={3} />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} disabled={isCancelling} className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">{resource.pos_t1.cancel}</button>
                    <button onClick={handleCancelOrder} disabled={isCancelling} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:bg-red-400">{isCancelling ? resource.pos_t1.cancelling : resource.pos_t1.confirm_cancellation}</button>
                </div>
            </div>
        </div>
    );
};

export default OrderCancellationModal;