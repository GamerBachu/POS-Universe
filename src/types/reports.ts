import type { IOrderCancellation } from "./orders";

export interface IReport {
    id?: number;
    name: string;
    description: string;
    version: string;
    url: string;
}
export interface IZReportData {
    sales: {
        gross: number;
        discounts: number;
        tax: number;
        net: number;// (Gross + Tax) - Discounts - Voids
    };
    payments: {
        cash: number;
        card: number;
        digital: number;
    };
    counters: {
        totalOrders: number;
        completedOrders: number;
        voidedOrders: number;
        refundCount: number;
    };
}

export interface IVoidReport extends IOrderCancellation {

    username: string;

}

