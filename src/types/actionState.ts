export interface IActionState {
    success: boolean | null;
    message: string;
}


export type TStatusType = "success" | "error" | "warning" | "info";