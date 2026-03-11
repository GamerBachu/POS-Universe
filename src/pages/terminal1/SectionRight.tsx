import NumpadButton from "./NumpadButton";
import PaymentMethodButton from "./PaymentMethodButton";
import { useCallback } from "react";
import { useTerminalState, useTerminalDispatch } from "./TerminalContext";
import type { IProductFilter } from "@/types/product";

type Props = {
    inputCode: string;
    onInputType: (val: string) => void;

    onNumpad: (val: string) => void;

    filter: IProductFilter;
    setFilter: (val: IProductFilter) => void;
};

const SectionRight = ({
    inputCode,
    onInputType,
    onNumpad,
    filter,
    setFilter
}: Props) => {
    const state = useTerminalState();
    const dispatch = useTerminalDispatch();

    const setPaymentMethod = useCallback(
        (method: string) => {
            dispatch({ type: "SET_PAYMENT_METHOD", method });
        },
        [dispatch],
    );

    const cartTotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const onSetPayment = (method: string) => {
        setPaymentMethod(method);
    };



    return (
        <section className="w-72 flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search item..."
                        value={inputCode}
                        onChange={(e) => onInputType(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 text-xs bg-gray-100 dark:bg-gray-700 border-none rounded-sm focus:ring-1 focus:ring-teal-500 transition-all"
                        
                    />
                    <svg
                        className="absolute left-2 top-2 h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            <div className="p-3 grid grid-cols-3 gap-2 flex-1 content-center">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "↵"].map(
                    (val) => (
                        <NumpadButton
                            key={val}
                            className={
                                val === "⌫"
                                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center"
                                    : val === "↵"
                                        ? "bg-teal-600 text-white flex items-center justify-center"
                                        : ""
                            }
                            onClick={() => onNumpad(val)}
                        >
                            {val}
                        </NumpadButton>
                    ),
                )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                            ${cartTotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Tax (5%)</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                            ${(cartTotal * 0.05).toFixed(2)}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <PaymentMethodButton active onClick={() => onSetPayment("Cash")}>
                        Cash
                    </PaymentMethodButton>
                    <PaymentMethodButton onClick={() => onSetPayment("Card")}>
                        Card
                    </PaymentMethodButton>
                    <PaymentMethodButton>Split</PaymentMethodButton>
                </div>
                <button
                    onClick={() => {
                        dispatch({ type: "SET_ALERT", alert: { type: "success", message: "complete order" } });
                    }}
                    className="w-full py-3 bg-teal-600 text-white font-black rounded-sm shadow-md active:scale-95 transition-all uppercase tracking-widest"
                >
                    Complete Order
                </button>
            </div>
        </section>
    );
};

export default SectionRight;
