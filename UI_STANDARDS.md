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

### Inputs & Forms (React 19 Pattern)
* **Standard Input:** Use `TextBoxWithLabel` from `@/components/input` for all text-based fields (text, email, password).
    * **Integration:** Connect `disabled` to `isPending` and `error` to the specific field error from `useActionState` (e.g., `state.errors?.field?.[0]`).
    * **Usage Example:**
    ```tsx
    <TextBoxWithLabel
        label={t("common.email")}
        name="email"
        type="email"
        disabled={isPending}
        error={state.errors?.email?.[0]}
        required
    />
    ```
* **DatePicker Pattern:** Use the custom `DatePicker` component. 
    * Always initialize `useState` with `getTodayDateString()` from `@/utils/date`.
    * Standard format: `YYYY-MM-DD`.
* **Height Matching:** All inputs and action buttons in a row must have matching heights (default `h-10`).

### Buttons & Actions
* **Form Submission:** Use `SubmitButton` from `@/components/button` for all form actions.
    * **Props:** Must pass `isLoading={isPending}` and `disabled={isPending}` to handle React 19 transition states.
* **General Buttons:** Standardized via `@/components/Button`. Use `bg-teal-600` for primary actions and `bg-gray-600` for secondary/cancel actions.
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