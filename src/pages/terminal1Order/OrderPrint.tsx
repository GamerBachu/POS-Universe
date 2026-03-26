import React, { useEffect } from "react";
import { type IOrderView } from "@/types/orders";
import { displayPrice } from "@/utils/helper/numberUtils";
import { toDisplayString, toUTCNowForDB } from "@/utils/helper/dateUtils";
import resource from "@/locales/en.json";
import { calculateRowAmount } from "../terminal1/utils";

interface OrderPrintProps {
    orderView: IOrderView;
    autoPrint?: boolean;
}

/**
 * OrderPrint component designed for thermal printer output (80mm).
 * Uses a monospace font and dashed borders for a standard receipt look.
 */
const OrderPrint: React.FC<OrderPrintProps> = ({ orderView, autoPrint = false }) => {
    const { order, items, discounts, adjustments, payments, customer, cashierName } = orderView;

    useEffect(() => {
        if (autoPrint) {
            // Short delay to ensure the browser has rendered the content before printing
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [autoPrint]);

    return (
        <div className="bg-white p-4 text-black font-mono text-[11px] leading-tight w-[80mm] mx-auto print:w-full print:m-0 print:shadow-none shadow-lg border border-gray-100">
            {/* Header / Store Info */}
            <div className="text-center mb-4">
                <h1 className="text-sm font-bold uppercase tracking-tighter">{resource.pos_t1.print_title}</h1>
                <p className="text-[9px] uppercase">{resource.pos_t1.order_details_title}</p>
                <div className="border-b border-black border-dashed my-2" />
            </div>

            {/* Transaction Info */}
            <div className="space-y-1 mb-3">
                <div className="flex justify-between">
                    <span className="uppercase">{resource.pos_t1.col_order_no}:</span>
                    <span className="font-bold">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="uppercase">{resource.pos_t1.col_date}:</span>
                    <span>{toDisplayString(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="uppercase">{resource.pos_t1.cashier}:</span>
                    <span>{(cashierName) ? cashierName : order.cashierId}</span>
                </div>

                {customer && (
                    <div className="mt-2 pt-2 border-t border-black border-dotted">
                        <div className="font-bold uppercase text-[9px]">{resource.pos_t1.lbl_customer}</div>
                        <div className="uppercase">{customer.name}</div>
                        {customer.phone && <div>{customer.phone}</div>}
                    </div>
                )}
            </div>

            <div className="border-b border-black border-dashed my-2" />

            {/* Items Table */}
            <table className="w-full text-[10px] border-collapse mb-3">
                <thead>
                    <tr className="border-b border-black">
                        <th className="text-left py-1 uppercase">{resource.pos_t1.col_item}</th>
                        <th className="text-right py-1 uppercase w-8">{resource.pos_t1.col_qty}</th>
                        <th className="text-right py-1 uppercase w-16">{resource.pos_t1.col_price}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={`${item.productId}-${idx}`}>
                            <td className="py-1 align-top">{item.productName}({displayPrice(item.unitPrice)})</td>
                            <td className="py-1 text-right align-top">{item.quantity}</td>
                            <td className="py-1 text-right align-top">{displayPrice(item.rowTotal)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Financial Summary */}
            <div className="border-t border-black border-dashed pt-2 space-y-1 mb-3">
                <div className="flex justify-between">
                    <span className="uppercase">{resource.pos_t1.subtotal}</span>
                    <span>{displayPrice(order.subtotal)}</span>
                </div>
                {discounts?.map((d, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span className="italic">{d.label}</span>
                        <span>-{displayPrice(calculateRowAmount(order, d))}</span>
                    </div>
                ))}
                {adjustments?.map((a, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span>{a.label}</span>
                        <span>+{displayPrice(calculateRowAmount(order, a))}</span>
                    </div>
                ))}
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-black mt-1">
                    <span className="uppercase">{resource.pos_t1.grand_total}</span>
                    <span>{displayPrice(order.grandTotal)}</span>
                </div>
            </div>

            {/* Payments */}
            <div className="mb-4">
                <div className="text-[9px] font-bold uppercase mb-1">{resource.pos_t1.payment_details}</div>
                {payments?.map((p, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span className="uppercase">{p.category} {p.method && `(${p.method})`}</span>
                        <span>{displayPrice(p.amount)}</span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-black border-dotted">
                <p className="font-bold uppercase">{resource.pos_t1.print_greeting}</p>
                <p className="">{resource.pos_t1.print_phone}</p>
                <p className="text-[px] text-gray-500 italic">{resource.pos_t1.print_address}</p>
                <div className="text-[8px] text-gray-400">{toDisplayString(toUTCNowForDB())}</div>
            </div>
        </div>
    );
};

export default OrderPrint;