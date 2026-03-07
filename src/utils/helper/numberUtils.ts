

export function onlyNumberAllowed(value: string): boolean {
    if (!/^\d*\.?\d*$/.test(value)) {
        return false;
    }
    return true;
}


export function displayPrice(price: number | string | undefined | null) {

    if (price === null || price === undefined || price === '') {
        return "0.00";
    }

    if (typeof price === 'string') price = parseFloat(price);

    if (isNaN(price)) return "0.00";

    return price.toFixed(2); // Always display 2 decimal places.
}