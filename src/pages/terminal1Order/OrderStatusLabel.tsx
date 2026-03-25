import type { IOrder } from '@/types/orders';
import { getIsDangerousAction } from './utils';

type OrderStatusLabelProps = {
    order: IOrder;
};

const OrderStatusLabel = ({ order }: OrderStatusLabelProps) => {

    const isDangerousAction = getIsDangerousAction(order.status);
    return (
        <span
            title={order.status}
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${isDangerousAction
                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20"
                }`}
        >
            {order.status}
        </span>
    );
};

export default OrderStatusLabel;