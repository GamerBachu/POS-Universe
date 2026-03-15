import type { IOrder, IOrderAdjustment, IOrderDiscount, IOrderItem, IOrderPayment, IOrderView } from "@/types/orders";
import type { IProduct, IProductView } from "@/types/product";
import { TOrderStatus, type ITerminalState } from "@/types/terminal1";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";
import { roundNumber } from "@/utils/helper/numberUtils";

/**
 * Calculates the final price after applying discount and then tax.
 * Follows standard government regulation: Discount -> Taxable Amount -> Tax.
 */
const calculateFinalPrice = (product: IProductView | IProduct): number => {
    const {
        sellingPrice = 0,
        taxRate = 0,
        discountInPercent = 0
    } = product;

    // 1. Calculate Taxable Amount (Price after discount)
    const discountAmount = sellingPrice * (discountInPercent / 100);
    const taxableAmount = sellingPrice - discountAmount;

    // 2. Calculate Tax on the discounted amount
    const taxAmount = taxableAmount * (taxRate / 100);

    // 3. Final Price
    const finalPrice = taxableAmount + taxAmount;

    // 4. Precision Rounding to 2 decimal places
    return roundNumber(finalPrice, 2);
};

export { calculateFinalPrice };



// import { calculateFinalPrice } from "@/utils/priceUtils"; // Using the function we optimized

// // Inside your OrderItem component logic:

// const getPriceBreakdown = (item: CartItem) => {
//     const { product, quantity } = item;
//     const basePrice = product.sellingPrice ?? 0;
//     const discountPercent = product.discountInPercent ?? 0;
//     const taxRate = product.taxRate ?? 0;

//     // 1. Price after discount (Taxable amount per unit)
//     const taxableUnit = basePrice * (1 - discountPercent / 100);

//     // 2. Tax amount per unit
//     const taxAmountUnit = taxableUnit * (taxRate / 100);

//     // 3. Totals for the whole row
//     const rowTaxableTotal = taxableUnit * quantity;
//     const rowTaxTotal = taxAmountUnit * quantity;
//     const rowFinalTotal = (taxableUnit + taxAmountUnit) * quantity;

//     return {
//         taxableUnit: taxableUnit.toFixed(2),
//         rowTaxTotal: rowTaxTotal.toFixed(2),
//         rowFinalTotal: rowFinalTotal.toFixed(2)
//     };
// };

// // Example usage in your Table Row:
// const breakdown = getPriceBreakdown(item);

// return (
//     <tr>
//         {/* ... name and quantity columns ... */}

//         <td className="p-2 text-right">
//             <div className="flex flex-col">
//                 <span className="font-black text-gray-700 dark:text-gray-200 tabular-nums">
//                     ${breakdown.rowFinalTotal}
//                 </span>
//                 {item.product.discountInPercent > 0 && (
//                     <span className="text-[9px] text-teal-600 font-bold uppercase">
//                         Taxable: ${breakdown.taxableUnit}
//                     </span>
//                 )}
//             </div>
//         </td>
//     </tr>
// );


export const NUMPAD_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "⌫", "↵"];
export const WALK_IN_CUSTOMER_TEXT = "Walk-in Customer";

/**
 * Maps the frontend Terminal State into a structured relational order format.
 * Note: 'id' fields are omitted or handled as undefined to allow Dexie auto-increment.
 */
export const mapTerminalStateToOrder = (state: ITerminalState, userId: number): IOrderView => {
    const { cart, customer, paymentCategory, paymentMethod, } = state;

    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    // 1. Map Line Items and Calculate Totals
    const items: IOrderItem[] = cart.map((item) => {

        const { product, quantity } = item;
        const unitPrice = calculateFinalPrice(product);
        const rowTotal = roundNumber(unitPrice * quantity);

        // Accumulate Subtotal
        subtotal += rowTotal;

        return {
            orderId: 0, // Placeholder, will be filled by OrderService transaction
            productId: product.id!,
            productName: `${product.name} ${product.code ? `(${product.code})` : ""}`,
            quantity: quantity,
            unitPrice: unitPrice,
            rowTotal: rowTotal,
        };
    });

    // 2. Final Financial Snapshot
    const grandTotal = roundNumber(subtotal - totalDiscount + totalTax);

    // 3. Construct Order Header
    // 'orderNumber' is set to empty string here; OrderService.saveFullOrder will replace it.
    const order: IOrder = {
        orderNumber: "",
        customerId: customer?.id ?? 0, //link in transaction
        cashierId: userId,
        subtotal: roundNumber(subtotal),
        totalDiscount: roundNumber(totalDiscount),
        totalTax: roundNumber(totalTax),
        totalCharge: 0,
        grandTotal: grandTotal,
        status: TOrderStatus.COMPLETED,
        createdAt: toUTCNowForDB()
    };

    // 4. Construct Sub-tables (Only if values exist)
    const adjustments: IOrderAdjustment[] = [];

    const discounts: IOrderDiscount[] = [];

    // Map Payment Method safely
    const payments: IOrderPayment[] = paymentCategory ? [{
        orderId: 0,
        category: paymentCategory,
        method: paymentMethod!, // paymentMethod will be present if paymentCategory is present
        amount: grandTotal,
        reference: ''
    }] : [];

    return { order, items, adjustments, discounts, payments, customer: customer ?? undefined };
};