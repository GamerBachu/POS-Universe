export interface IActionState {
    success: boolean | null;
    message: string;
}


export type IStatusType = "success" | "error" | "warning" | "info";