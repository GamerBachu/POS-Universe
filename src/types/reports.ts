import type { IOrderCancellation } from "./orders";

export interface IReport {
    id?: number;
    name: string;
    description: string;
    version: string;
    url: string;
}



export interface IZReportData {
    businessDate: string;
    cashierName: string;
    sales: {
        gross: number;
        discounts: number;
        tax: number;
        net: number;
    };
    payments: {
        cash: number;
        card: number;
        digital: number;
    };
    counters: {
        totalOrders: number;
        voidedOrders: number;
        refundCount: number;
    };
}

export interface IVoidReport extends IOrderCancellation {

    username: string;

}