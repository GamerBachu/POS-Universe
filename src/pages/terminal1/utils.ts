import type { IOrder, IOrderAdjustment, IOrderDiscount, IOrderItem, IOrderPayment, IOrderView } from "@/types/orders";
import type { IProduct, IProductView } from "@/types/product";
import { TOrderStatus, type ITerminalState } from "@/types/terminal1";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";
import { roundNumber } from "@/utils/helper/numberUtils";
import resource from "@/locales/en.json";



/** 
 *  newOrderState
 * 
 * 
 * **/

export const newOrderState: ITerminalState = {
    alert: undefined,
    cart: [],
    customer: null,
    paymentCategory: null,
    adjustment: [],
    paymentMethod: null,
    isPaid: false,

};




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


//NUMPAD_KEYS -2= Enter / Apply Button 
//NUMPAD_KEYS -1 = Backspace Button
export const NUMPAD_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "-1", "-2"];

export const WALK_IN_CUSTOMER_TEXT = resource.pos_t1.walk_in_customer;

/**
 * Maps the frontend Terminal State into a structured relational order format.
 * Note: 'id' fields are omitted or handled as undefined to allow Dexie auto-increment.
 */
export const mapTerminalStateToOrder = (state: ITerminalState, userId: number): IOrderView => {
    const { cart, customer, paymentCategory, paymentMethod, adjustment } = state;

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

    // 2. Apply Adjustments (Discounts, Surcharges) Construct Sub-tables (Only if values exist)

    const adjustments: IOrderAdjustment[] = [];

    const discounts: IOrderDiscount[] = [];
    adjustment.forEach((adj) => {
        // Calculate the actual numeric amount based on the valueType
        const amount = adj.valueType === 'PERCENT'
            ? roundNumber((subtotal * adj.value) / 100)
            : adj.value;

        if (adj.category === 'DISCOUNT') {
            totalDiscount += amount;

            // Push to discounts sub-table
            discounts.push({
                orderId: 0,
                category: adj.category,
                label: adj.label,
                value: adj.value,
                valueType: adj.valueType,
            });
        } else {
            // Handle Charges / Taxes
            totalTax += amount;

            // Push to adjustments/charges sub-table
            adjustments.push({
                orderId: 0,
                category: adj.category,
                label: adj.label,
                value: adj.value,
                valueType: adj.valueType,
            });
        }
    });

    // 3. Final Financial Snapshot
    // Subtract discounts and add taxes/charges
    const grandTotal = roundNumber(subtotal - totalDiscount + totalTax);

    // 4. Construct Order Header
    // 'orderNumber' is set to empty string here; OrderService.saveFullOrder will replace it.
    const order: IOrder = {
        orderNumber: "",
        customerId: customer?.id ?? 0, //link in transaction
        cashierId: userId,
        subtotal: roundNumber(subtotal),
        totalDiscount: roundNumber(totalDiscount),
        totalTax: roundNumber(totalTax),
        grandTotal: grandTotal,
        status: TOrderStatus.COMPLETED,
        createdAt: toUTCNowForDB()
    };


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