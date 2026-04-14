import type { IOrderCancellation } from "./orders";
import type { IProduct } from "./product";

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


export interface IInventoryValuation {
    totalAssetValue: number;
    totalStock: number;
    products: IProduct[];
}




/**
 * Structure for inventory financial valuation
 */
export interface IInventoryValuation {
    totalAssetValue: number;
    totalStock: number;
    products: IProduct[];
}

/**
 * Structure for Sales Summary Report
 */
export interface ISalesSummaryData {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    growth: number; // percentage vs previous day
    salesTrend: {
        label: string;
        value: number;
    }[];
}

/**
 * Structure for Customer Insights Report
 */
export interface ICustomerInsight {
    customerId: number;
    name: string;
    email: string;
    phone: string;
    totalSpent: number;
    orderCount: number;
    avgOrderValue: number;
    lastPurchaseDate: string;
    loyaltyScore: number; // Calculated based on frequency and volume
}

export interface IWeeklySalesData {
    date: string; // YYYY-MM-DD
    dayLabel: string; // e.g., "Mon"
    totalSales: number;
}

/**
 * Structure for Sales Overview Report (e.g., for Dashboard)
 */
export interface ISalesOverviewReport {
    totalRevenueLast7Days: number;
    weeklySalesTrend: IWeeklySalesData[];
}

/**
 * Structure for Financial Overview Report
 */
export interface IFinancialOverview {
    totalRevenue: number;
    totalCogs: number;
    grossProfit: number;
    grossMargin: number;
    totalExpenses: number; 
    netIncome: number;
    cashInflow: number;
    cashOutflow: number;
}

export interface ITopSellingProduct {
    productId: number;
    name: string;
    soldCount: number;
    totalRevenue: number;
}

export interface IPaymentMixItem {
    label: string;
    val: number; // Percentage
    amount: number;
    color: string;
}

export interface IHourlyHeatmapItem {
    hour: number;
    count: number;
    revenue: number;
    intensity: number; // 0 to 1 scale
}