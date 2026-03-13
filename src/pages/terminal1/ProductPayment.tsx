import PaymentMethodButton from "./PaymentMethodButton";
import { useCallback, useMemo } from "react";
import { useTerminalState, useTerminalDispatch } from "./TerminalContext";
type ProductPaymentProps = {};

const ProductPayment = (props: ProductPaymentProps) => {
    const state = useTerminalState();
    const dispatch = useTerminalDispatch();

    const setPaymentMethod = useCallback(
        (method: string) => {
            dispatch({ type: "SET_PAYMENT_METHOD", method });
        },
        [dispatch],
    );

    const totals = useMemo(() => {
        const lineTotal = state.cart.reduce(
            (sum, item) => sum + item.product.sellingPrice * item.quantity,
            0,
        );
        const taxTotal = state.cart.reduce(
            (sum, item) => sum + item.product.taxRate * item.quantity,
            0,
        );

        const cartTotal = lineTotal + taxTotal;

        return {
            lineTotal,
            taxTotal,
            cartTotal,
        };
    }, [state.cart]);




    const onSetPayment = (method: string) => {
        setPaymentMethod(method);
    };
    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                        ${totals.lineTotal.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Tax (5%)</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                        ${totals.taxTotal.toFixed(2)}
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
    );
};

export default ProductPayment;