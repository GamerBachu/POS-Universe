import Header from "@/components/Header";
import OrderItem from "./OrderItem";
import ProductCard from "./ProductCard";
import NumpadButton from "./NumpadButton";
import PaymentMethodButton from "./PaymentMethodButton";

const Main = () => {
    return (
        <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans text-gray-800 dark:text-gray-200">
            <Header label={"h1"}></Header>

            <div className="flex flex-1 overflow-hidden border border-gray-200 dark:border-gray-700">

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
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                                <OrderItem id="01" name="Wireless Mouse" quantity={2} price="$50.00" />
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-teal-600 text-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold opacity-80 uppercase">Total Payable</span>
                            <span className="text-xl font-black">$125.50</span>
                        </div>
                    </div>
                </section>

                <section className="flex-1 flex flex-col min-w-0 bg-gray-100/50 dark:bg-gray-900/50">
                    <div className="p-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-y-auto content-start">
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                        <ProductCard name="Product Name" price="$12.00" />
                    </div>
                </section>

                <section className="w-72 flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative group">
                            <input type="text" placeholder="Search item..." className="w-full pl-8 pr-2 py-2 text-xs bg-gray-100 dark:bg-gray-700 border-none rounded-sm focus:ring-1 focus:ring-teal-500 transition-all" />
                            <svg className="absolute left-2 top-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="p-3 grid grid-cols-3 gap-2 flex-1 content-center">
                        <NumpadButton>1</NumpadButton>
                        <NumpadButton>2</NumpadButton>
                        <NumpadButton>3</NumpadButton>
                        <NumpadButton>4</NumpadButton>
                        <NumpadButton>5</NumpadButton>
                        <NumpadButton>6</NumpadButton>
                        <NumpadButton>7</NumpadButton>
                        <NumpadButton>8</NumpadButton>
                        <NumpadButton>9</NumpadButton>
                        <NumpadButton className="bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center">⌫</NumpadButton>
                        <NumpadButton>0</NumpadButton>
                        <NumpadButton className="bg-teal-600 text-white flex items-center justify-center">↵</NumpadButton>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Subtotal</span><span className="font-medium text-gray-800 dark:text-gray-200">$120.00</span></div>
                            <div className="flex justify-between text-gray-500 dark:text-gray-400"><span>Tax (5%)</span><span className="font-medium text-gray-800 dark:text-gray-200">$5.50</span></div>
                        </div>
                        <div className="flex gap-2">
                            <PaymentMethodButton active>Cash</PaymentMethodButton>
                            <PaymentMethodButton>Card</PaymentMethodButton>
                            <PaymentMethodButton>Split</PaymentMethodButton>
                        </div>
                        <button className="w-full py-3 bg-teal-600 text-white font-black rounded-sm shadow-md active:scale-95 transition-all uppercase tracking-widest">
                            Complete Order
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Main;