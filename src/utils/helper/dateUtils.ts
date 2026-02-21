
/**
 * 
 * Utilities for handling <input type="datetime-local"> and UTC Database storage
 */

/**
 * Converts the value from a datetime-local input to an ISO UTC string for the DB.
 * Example: "2026-01-31T13:14" -> "2026-01-31T07:44:00.000Z" (depending on local offset)
 */
export const toUTCForDB = (localDateTime: string | undefined | null): string => {
    if (!localDateTime) return "";
    const date = new Date(localDateTime);
    return date.toISOString();
};


/**
 * Converts a UTC ISO string from the DB back to the format <input type="datetime-local"> expects.
 * Format required by browser: YYYY-MM-DDThh:mm (24-hour clock)
 */
export const toLocalForInput = (utcString: string): string => {
    if (!utcString) return "";

    const date = new Date(utcString);

    // Offset conversion: Adjust UTC to Local
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);

    // Return formatted as YYYY-MM-DDThh:mm
    return localDate.toISOString().slice(0, 16);
};

/**
 * Formats a UTC string into a human-readable local string for display (not inputs).
 * Example: "Jan 31, 2026, 1:14 PM"
 */
export const toDisplayString = (utcString: string): string => {
    if (!utcString) return "N/A";
    return new Date(utcString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};




/**
 * Converts the date time now to an ISO UTC string for the DB.
 * Example: "2026-01-31T13:14" -> "2026-01-31T07:44:00.000Z" (depending on local offset)
 */

export const toUTCNowForDB = (date?: Date): string => {
    const d = date || new Date();
    return d.toISOString();
};