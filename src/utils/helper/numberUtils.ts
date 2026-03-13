/**
 * Optimized for React 19 / POS Systems
 */

/**
 * Validates if a string is a valid positive decimal.
 * Optimized with a simpler regex.
 */
export const onlyNumberAllowed = (value: string): boolean =>
    /^\d*\.?\d*$/.test(value);

/**
 * Rounds a number to a specific precision using Epsilon to avoid binary rounding errors.
 * Defaulting to 2 decimal places for POS standard.
 */
export const roundNumber = (val: number, decimals: number = 2): number => {
    const multiplier = Math.pow(10, decimals);
    return Math.round((val + Number.EPSILON) * multiplier) / multiplier;
};

/**
 * Displays price with 2 decimal places. 
 * Optimized to handle nullish values and string conversion in one pass.
 */
export function displayPrice(price: number | string | undefined | null): string {
    // Treat null, undefined, empty string, or non-numeric strings as 0
    const num = typeof price === 'string' ? parseFloat(price) : price;

    if (!num || isNaN(num)) {
        return "0.00";
    }

    return roundNumber(num).toFixed(2);
}