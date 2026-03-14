import type { IOrderView } from "@/types/orders";
import type { IProduct, IProductView } from "@/types/product";
import type { ITerminalState } from "@/types/terminal1";
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



export const MapPayload = (payload: ITerminalState): IOrderView => {


};