
type OrderItemProps = {
    id: string; name: string; quantity: number; price: string;
};

const OrderItem = (
    {
        id,
        name,
        quantity,
        price,
    }
        : OrderItemProps) => {
    return (
        <tr>
            <td className="p-2 text-gray-400">{id}</td>
            <td className="p-2 font-bold">{name}</td>
            <td className="p-2">
                <div className="flex items-center justify-center gap-2">
                    <button className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700">-</button>
                    <span className="font-bold">{quantity}</span>
                    <button className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                </div>
            </td>
            <td className="p-2 text-right font-black">{price}</td>
        </tr>
    );
};

export default OrderItem;