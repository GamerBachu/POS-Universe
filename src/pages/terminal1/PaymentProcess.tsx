import PaymentMethodButton from "./PaymentMethodButton";
import { useCallback, } from "react";
import { useTerminalState, useTerminalDispatch } from "./TerminalContext";
import { TPaymentCategory } from "@/types/terminal1";
import { orderServiceApi } from "@/api/orderServiceApi";
import { mapTerminalStateToOrder } from "./utils";
import { LoggerUtils } from "@/utils";
import { useAuth } from "@/contexts/authorize";
import AdjustmentButtons from "./AdjustmentButtons";
import { useTranslation } from "@/contexts/language";

type PaymentProcessProps = {
    resetFilter: () => void;
};



const PaymentProcess = ({ resetFilter }: PaymentProcessProps) => {
    const auth = useAuth();
    const state = useTerminalState();
    const dispatch = useTerminalDispatch();
    const { t } = useTranslation();


    const setPaymentMethod = useCallback(
        (paymentCategory: TPaymentCategory | null) => {
            dispatch({ type: "SET_PAYMENT_CATEGORY", paymentCategory });
        },
        [dispatch],
    );


    const onCompletingOrder = useCallback(async () => {

        const userId = auth.info.authUser?.userId ? auth.info.authUser?.userId : 0;

        if (!userId || userId === 0) {
            dispatch({
                type: "SET_ALERT",
                alert: { type: "warning", message: t("common.session_expired") },
            });
            return;
        }

        // 1. Validate Cart
        if (state.cart.length === 0) {
            dispatch({
                type: "SET_ALERT",
                alert: { type: "warning", message: t("pos_t1.msg_cart_empty") },
            });
            return;
        }

        // 2. Validate Payment Selection
        if (!state.paymentCategory) {
            dispatch({
                type: "SET_ALERT",
                alert: { type: "warning", message: t("pos_t1.msg_select_payment") },
            });
            return;
        }

        // 3. Validate Payment Status (Non-Cash Check)
        // Assuming paymentType[0].name is "CASH"
        //-----// 1. Ensure state.paymentCategory is not null/undefined
        //-----// 2. Ensure paymentType[0] exists before accessing .name
        //-----// 3. Fallback to empty strings to avoid "toLowerCase of null" errors

        const isCash = state.paymentCategory === TPaymentCategory.CASH;
        if (!isCash && !state.isPaid) {
            dispatch({
                type: "SET_ALERT",
                alert: { type: "warning", message: t("pos_t1.msg_payment_pending") },
            });
            return;
        }

        try {
            // 4. Map and Send to API
            // Mapping happens here to keep the API call clean
            const payload = mapTerminalStateToOrder(state, userId);


            const response = await orderServiceApi.addFullOrder(payload);

            if (response.success && response.data) {
                // 5. Success Flow: Show Order Number and Reset
                dispatch({
                    type: "SET_ALERT",
                    alert: {
                        type: "success",
                        message: t("pos_t1.msg_order_saved").replace("{orderNumber}", response.data.orderNumber),
                        duration: 10000,
                    },
                });
                //Note :add logic to show Order Number till user close it.
                // Trigger the clear/complete action to reset terminal state
                dispatch({ type: "COMPLETE" });
                resetFilter();

            } else {
                // 6. API Logical Failure (e.g., validation in service)
                dispatch({
                    type: "SET_ALERT",
                    alert: {
                        type: "error",
                        message: response.message || t("pos_t1.msg_save_failed")
                    },
                });
                LoggerUtils.logError(response, "PaymentProcess", "onCompletingOrder");
            }
        } catch (error: unknown) {
            // 7. Critical Failure (e.g., DB crash)
            dispatch({
                type: "SET_ALERT",
                alert: {
                    type: "error",
                    message: t("pos_t1.msg_critical_error")
                },
            });
            LoggerUtils.logCatch(error, "PaymentProcess", "onCompletingOrder");
        }
    }, [state, dispatch, auth.info.authUser?.userId, resetFilter, t]);

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <AdjustmentButtons></AdjustmentButtons>
            <div className="flex gap-2">

                <PaymentMethodButton
                    onClick={() => setPaymentMethod(TPaymentCategory.CASH)}
                    active={state.paymentCategory === TPaymentCategory.CASH}
                >
                    {TPaymentCategory.CASH}
                </PaymentMethodButton>

                <PaymentMethodButton
                    onClick={() => setPaymentMethod(TPaymentCategory.ELECTRONIC)}
                    active={state.paymentCategory === TPaymentCategory.ELECTRONIC}
                >
                    {TPaymentCategory.ELECTRONIC}
                </PaymentMethodButton>
            </div>
            <button
                onClick={onCompletingOrder}
                className="w-full py-3 bg-teal-600 text-white font-black rounded-sm shadow-md active:scale-95 transition-all uppercase tracking-widest hover:bg-teal-700"
            >
                {t("pos_t1.complete_order")}
            </button>
        </div>
    );
};

export default PaymentProcess;
