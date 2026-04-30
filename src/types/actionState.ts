export interface IActionState {
    success: boolean | null;
    message: string;
}






export type TStatusType = "success" | "error" | "warning" | "info";


export interface IFormState<T = unknown> {
    success: boolean;
    message: string | null;
    errors: Record<string, string[]> | null;
    data?: T; // Holds the typed object (e.g., IUserProfile)
    formVersion?: number; // Used to sync with the form instance
}