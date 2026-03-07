import type { CartItem } from "@/types/terminal1";

type OrderItemProps = {
    item: CartItem;
};

const OrderItem = ({ item }: OrderItemProps) => {
    return (
        <tr>
            <td className="p-2 font-bold">{item.product.name}</td>
            <td className="p-2">
                <div className="flex items-center justify-center gap-2">
                    <button className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
                    <span className="font-bold">{item.quantity}</span>
                    <button className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                </div>
            </td>
            <td className="p-2 text-right font-black">{item.product.sellingPrice}</td>
        </tr>
    );
};

export default OrderItem;