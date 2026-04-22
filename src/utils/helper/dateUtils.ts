/**
 *
 * Utilities for handling <input type="datetime-local"> and UTC Database storage
 */

/**
 * Converts the value from a datetime-local input to an ISO UTC string for the DB.
 * Example: "2026-01-31T13:14" -> "2026-01-31T07:44:00.000Z" (depending on local offset)
 */
export const toUTCForDB = (
    localDateTime: string | undefined | null,
): string => {
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
 * Formats a UTC string into a human-readable local string for display without time (not inputs).
 * Example: "Jan 31, 2026"
 */
export const toDisplayStringWithoutTime = (utcString: string): string => {
    if (!utcString) return "N/A";
    return new Date(utcString).toLocaleString(undefined, {
        dateStyle: "medium",

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

export const toISODateString = (
    date: Date | string | number | null | undefined,
): string => {
    if (!date) return "";

    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return "";
    }

    // Returns YYYY-MM-DD
    return d.toISOString();
};

/**
 * Gets today's date in YYYY-MM-DD format for default value in date inputs.
 * The Format: HTML <input type="date"> strictly requires the format YYYY-MM-DD.
 * If you pass a full JS Date object or a differently formatted string (like 10-04-2026),
 * the input will appear empty or show "mm/dd/yyyy".
 * Intl.DateTimeFormat('en-CA'): While you can use .toISOString().split('T')[0],
 * that method sometimes shifts the date by one day if you are in a late timezone (like India) 
 * because it converts to UTC first. Using Intl with en-CA stays in the user's local time,
 *  which is much safer for a POS system.
 */
export const getTodayDateString = (): string => {
    // We use the 'en-CA' (Canada) locale because it conveniently
    // outputs YYYY-MM-DD which matches the date input requirements.
    return new Intl.DateTimeFormat("en-CA").format(new Date());
};
