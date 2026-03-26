import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderServiceApi } from "@/api/orderServiceApi";
import type { IOrderView } from "@/types/orders";
import { displayPrice } from "@/utils/helper/numberUtils";
import { toDisplayString } from "@/utils/helper/dateUtils";
import resource from "@/locales/en.json";
import Loader from "@/components/Loader";
import OrderStatusManage from "./OrderStatusManage";
import CommonLayout from "@/layouts/CommonLayout";
import PageHeader from "@/components/PageHeader";
import { PATHS } from "@/routes/paths";
import Button from "@/components/Button";
import { LoggerUtils } from "@/utils";
import OrderStatusLabel from "./OrderStatusLabel";
import OrderPrint from "./OrderPrint";
import { calculateRowAmount } from "../terminal1/utils";

const OrderForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string; }>();

    const [orderView, setOrderView] = useState<IOrderView | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = useCallback(() => {
        setIsPrinting(true);
        // We set a timeout to allow the print component to mount 
        // and then reset the printing state after the print dialog is handled
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 500);
    }, []);

    const onSendBack = useCallback(() => {
        if (window.history.length > 1 && window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate(PATHS.PRODUCT_LIST);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchOrder = async () => {
            const rowId = Number(id);
            if (!rowId) return;

            try {
                setLoading(true);
                const response = await orderServiceApi.getFullOrderDetailsById(rowId);
                if (response.success) {
                    setOrderView(response.data || null);
                }
            } catch (err) {
                setOrderView(null);
                LoggerUtils.logCatch(err, "OrderForm", "fetchOrder", JSON.stringify({ id: id, rowId }));
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);



    // 1. Loader View (Centered)
    if (loading) return (
        <CommonLayout h1={resource.navigation.product_list_label}>
            <PageHeader
                subtitle={`${resource.pos_t1.order_details_title}`}
                btnClass="bg-gray-600 hover:bg-gray-700"
                btnLabel={resource.common.back_page}
                onClick={onSendBack}
            />
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader />
            </div>
        </CommonLayout>
    );

    // 2. Error View
    if (!orderView) {
        return (
            <CommonLayout h1={resource.navigation.product_list_label}>
                <PageHeader
                    subtitle={`${resource.pos_t1.order_details_title}`}
                    btnClass="bg-gray-600 hover:bg-gray-700"
                    btnLabel={resource.common.back_page}
                    onClick={onSendBack}
                />
                <div className="p-10 text-center text-red-500 font-bold">
                    {resource.common.error}
                </div>
            </CommonLayout>
        );
    }

    const { order, items, discounts, adjustments, payments, customer, cashierName } = orderView;



    return (
        <CommonLayout h1={resource.navigation.product_list_label}>
            {/* Hidden Print Area */}
            {isPrinting && orderView && (
                <div className="fixed inset-0 z-[5000] bg-white flex justify-center items-start overflow-auto">
                    <OrderPrint orderView={orderView} />
                </div>
            )}

            <PageHeader
                subtitle={`${resource.pos_t1.order_details_title} ${order.orderNumber}`}
                btnClass="bg-gray-600 hover:bg-gray-700"
                btnLabel={resource.common.back_page}
                onClick={onSendBack}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column: Items & Billing */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="font-bold  uppercase text-xs tracking-wider">
                                {resource.pos_t1.order_items}
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/20 ">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">{resource.pos_t1.col_item}</th>
                                        <th className="px-4 py-3 text-center font-medium">{resource.pos_t1.col_qty}</th>
                                        <th className="px-4 py-3 text-right font-medium">{resource.pos_t1.col_unit_price}</th>
                                        <th className="px-4 py-3 text-right font-medium">{resource.pos_t1.col_price}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-gray-700">
                                    {items.map((item, idx) => (
                                        <tr key={`${item.productId}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-4 font-medium ">{item.productName}</td>
                                            <td className="px-4 py-4 text-center">{item.quantity}</td>
                                            <td className="px-4 py-4 text-right ">{displayPrice(item.unitPrice)}</td>
                                            <td className="px-4 py-4 text-right font-bold ">{displayPrice(item.rowTotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
                        <div className="flex justify-between">
                            <span>{resource.pos_t1.subtotal}</span>
                            <span className="font-medium">{displayPrice(order.subtotal)}</span>
                        </div>

                        {/* FIX: Showing specific row amount instead of order.totalDiscount */}
                        {discounts?.map((d, idx) => (
                            <div key={`${d.label}-${idx}`} className="flex justify-between text-red-500 text-sm italic">
                                <span>{d.label} ({d.value}{d.valueType === "PERCENT" ? "%" : ""})</span>
                                <span>-{displayPrice(calculateRowAmount(order, d))}</span>
                            </div>
                        ))}

                        {/* FIX: Showing specific row amount instead of order.totalTax */}
                        {adjustments?.map((a, idx) => (
                            <div key={`${a.label}-${idx}`} className="flex justify-between text-teal-600 dark:text-teal-400 text-sm">
                                <span>{a.label} ({a.value}{a.valueType === "PERCENT" ? "%" : ""})</span>
                                <span>+{displayPrice(calculateRowAmount(order, a))}</span>
                            </div>
                        ))}

                        <div className="flex justify-between font-black text-2xl border-t pt-4 mt-4  dark:text-white border-dashed dark:border-gray-700">
                            <span className="uppercase tracking-tighter text-lg font-bold ">{resource.pos_t1.grand_total}</span>
                            <span className="font-mono">{displayPrice(order.grandTotal)}</span>
                        </div>
                    </div>

                    {/* Mini History Table */}
                    {orderView?.cancellation && orderView.cancellation.length > 0 && (
                        <div className="space-y-1 mb-4">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                                {resource.common.status}
                            </label>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden max-h-32 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-[10px] text-left">
                                    <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 text-gray-500 uppercase font-black border-b dark:border-gray-700">
                                        <tr>
                                            <th className="px-2 py-1.5">{resource.pos_t1.col_status}</th>
                                            <th className="px-2 py-1.5">{resource.pos_t1.manage_reason}</th>
                                            <th className="px-2 py-1.5 text-right">{resource.pos_t1.col_date}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-700 bg-white dark:bg-gray-800/50">
                                        {orderView.cancellation.map((log, idx) => (
                                            <tr key={log.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-2 py-2">
                                                    <span className="font-bold text-red-600 dark:text-red-400">{log.status}</span>
                                                </td>
                                                <td className="px-2 py-2 text-gray-600 dark:text-gray-300 truncate max-w-[100px]" title={log.reason}>
                                                    {log.reason}
                                                </td>
                                                <td className="px-2 py-2 text-right text-gray-400 font-mono">
                                                    {toDisplayString(log.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}



                </div>

                {/* Right Column: Meta Info */}
                <div className="space-y-6">
                    {/* Order Meta */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 font-bold text-xs uppercase ">
                            {resource.pos_t1.order_information}
                        </div>
                        <div className="p-4 space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="">{resource.pos_t1.col_order_no}</span>
                                <span className="font-medium">{order.orderNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="">{resource.pos_t1.col_status}</span>
                                <OrderStatusLabel order={order} />
                            </div>
                            <div className="flex justify-between">
                                <span className="">{resource.pos_t1.col_date}</span>
                                <span className="font-medium">{toDisplayString(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="">{resource.pos_t1.cashier}</span>
                                <span className="font-medium">{(cashierName) ? cashierName : order.cashierId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Payment */}
                    {customer && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <h4 className="text-xs font-bold uppercase  mb-3 tracking-widest">{resource.pos_t1.customer_profile}</h4>
                            <p className="font-bold ">{customer.name}</p>
                            {customer.phone && (<p className="text-xs ">{customer.phone}</p>)}
                            {customer.email && (<p className="text-xs ">{customer.email}</p>)}
                            {customer.address && (<p className="text-xs ">{customer.address}</p>)}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <h4 className="text-xs font-bold uppercase  mb-3 tracking-widest">{resource.pos_t1.payment_details}</h4>
                        {payments?.map((p, idx) => (
                            <div key={`${p.category}-${idx}`} className="flex justify-between items-center">
                                <span className="text-sm font-medium">{p.category} {p.method ? `(${p.method})` : ""}</span>
                                <span className="text-sm font-black text-teal-600">{displayPrice(p.amount)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Actions Area */}
                    <div className="grid grid-cols-2 gap-2 items-stretch">
                        <Button
                            type="button"
                            onClick={onSendBack}
                            className="bg-gray-600 hover:bg-gray-700 py-2"
                            title={resource.common.back_page}
                            isLoading={loading}
                        >
                            {resource.common.back_page}
                        </Button>
                        <Button
                            type="button"
                            className="bg-teal-600 hover:bg-teal-700 text-white  py-2"
                            onClick={handlePrint}
                            title={resource.common.print}
                            isLoading={loading}
                        >
                            {resource.common.print}
                        </Button>

                        <Button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700  py-2"
                            title={resource.common.manage_status}
                            isLoading={loading}
                        >
                            {resource.common.manage_status}
                        </Button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <OrderStatusManage
                    order={order}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={onSendBack}
                />
            )}
        </CommonLayout>
    );
};

export default OrderForm;