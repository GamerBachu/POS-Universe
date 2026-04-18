import type { IProduct, IProductView } from "@/types/product";
import { roundNumber } from "@/utils/helper/numberUtils";

/**
 * Calculates the final price after applying discount and then tax.
 * Follows standard government regulation: Discount -> Taxable Amount -> Tax.
 */
export const calculateFinalPrice = (product: IProductView | IProduct): number => {
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