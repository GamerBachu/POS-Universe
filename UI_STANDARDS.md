# POS-Universe UI & Logic Standards

This document defines the architectural and UI patterns for the POS-Universe project. All AI-generated code must adhere to these rules to ensure consistency across the Point of Sale system.

## 1. Visual Design Language
* **Primary Theme:** Teal-based (`teal-600` for primary actions, `teal-500` for focus).
* **Dark Mode:** Every component MUST support dark mode using Tailwind `dark:` utilities.
* **Density:** This is a POS system. Use high-density layouts:
    * Text sizes: `text-[10px]` (caps/labels), `text-xs` (secondary), `text-sm` (primary).
    * Padding/Margins: Use `p-3`, `gap-2`, or `space-y-2` as defaults to maximize screen real estate.
* **Interactive Elements:** All buttons must have `transition-all` and `active:scale-95` for tactile feedback.

## 2. Component Guidelines

### Inputs & DatePickers
* **Height Matching:** All inputs and action buttons in a row must have matching heights (default `h-10` or `h-9`).
* **DatePicker Pattern:** Use the custom `DatePicker` component. 
    * Always initialize `useState` with `getTodayDateString()` from `@/utils/date`.
    * Standard format: `YYYY-MM-DD`.
* **Labels:** Use uppercase, bold, tracking-wide labels: `text-[11px] font-bold uppercase tracking-wider text-gray-500`.

### Common Components
* **Buttons:** Standardized via `@/components/Button`. Use `bg-teal-600` for "Submit/Search" and `bg-gray-600` or `bg-red-500` for "Reset/Cancel".
* **Icons:** Use `SVGProps<SVGSVGElement>` with `stroke="currentColor"`.
    * Ensure `dark:` support by passing `text-gray-500 dark:text-gray-400` to icon instances.

## 3. Business & Filtering Logic

### Price Filtering (The "Whole Number" Rule)
* **Requirement:** When searching by price, ignore decimal places to allow quick entry.
* **Implementation:** Use `Math.trunc()` or `Math.floor()` on both the input and the stored value.
* **Logic:** `Math.trunc(item.sellingPrice) === Math.trunc(Number(fSellingPrice))`.

### Search Logic (Dexie.js / Client-side)
* **Truthiness:** Use `(!fValue)` to check for null, undefined, or empty strings to skip filters efficiently.
* **String Matching:** Use `.toLowerCase().trim().includes(filterValue)` for Name, SKU, and Barcode.
* **Ordering:** Always order by primary ID in reverse for reports/lists: `db.table.orderBy("id").reverse()`.

## 4. Date Handling
* **Storage:** Dates must be stored as ISO strings.
* **Utilities:** Use `@/utils/date` for all conversions.
    * `toISODateString(date)`: Splits at 'T' to return `YYYY-MM-DD`.
    * `getTodayDateString()`: Uses `Intl.DateTimeFormat('en-CA')` to get local `YYYY-MM-DD` without UTC offset shifts.

## 5. Layout Patterns
* **Filter Panels:** Use a sliding transition with `max-height` and `opacity` (0 to 100).
* **Action Bars:** Use `flex flex-col sm:flex-row items-end justify-end gap-3` for bottom-fixed or top-fixed action sections.