import React from 'react';
import OrderItem from './OrderItem';

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

type Props = {
    cart: CartItem[];
    total: number;
};

const SectionLeft = ({ cart, total }: Props) => {
    return (
        <section className="w-80 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700 font-bold text-xs uppercase tracking-wider text-gray-500">
                Order Detail
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm">
                        <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            <th className="p-2 font-medium w-8">#</th>
                            <th className="p-2 font-medium">Item</th>
                            <th className="p-2 font-medium text-center">Qty</th>
                            <th className="p-2 font-medium text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {cart.length === 0 ? (
                            <tr><td colSpan={4} className="p-2 text-center text-gray-400">No items</td></tr>
                        ) : (
                            cart.map((item, idx) => (
                                <OrderItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    quantity={item.quantity}
                                    price={"$" + item.price.toFixed(2)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-teal-600 text-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-80 uppercase">Total Payable</span>
                    <span className="text-xl font-black">${total.toFixed(2)}</span>
                </div>
            </div>
        </section>
    );
};

export default SectionLeft;