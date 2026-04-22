import Dexie, { type EntityTable } from "dexie";
import {
    type IProduct,
    type IProductAttribute,
    type IProductDescription,
    type IProductImage,
    type IProductKeyWord,
    type IProductTimeStamp,
} from "@/types/product";
import { type IMasterProductAttribute } from "@/types/masters";

import type { ISystemLog } from "@/types/systemLog";

import {
    type IOrder,
    type IOrderItem,
    type IOrderAdjustment,
    type IOrderDiscount,
    type IOrderPayment,
    type IOrderCancellation
} from "@/types/orders";


import { type ICustomer } from "@/types/customer";

import { type IReport } from "@/types/reports";

import {
    type IUser,
    type IRefreshToken,
    type IUserSecurity,
    type IUserProfile,
    type IUserWorkplace,
    type IUserSettings,
    type ILoginHistory,
    type IRole
} from "@/types/user";

class POSUniversalDexie extends Dexie {
    users!: EntityTable<IUser, "id">;
    refreshTokens!: EntityTable<IRefreshToken, "id">;
    userSecurity!: EntityTable<IUserSecurity, "id">;
    loginHistory!: EntityTable<ILoginHistory, "id">;

    // User Metadata
    userProfiles!: EntityTable<IUserProfile, "id">;
    userWorkplaces!: EntityTable<IUserWorkplace, "id">;
    userSettings!: EntityTable<IUserSettings, "id">;
    roles!: EntityTable<IRole, "id">;


    // System Logs & Master Data
    systemLogs!: EntityTable<ISystemLog, "id">;
    masterProductAttributes!: EntityTable<IMasterProductAttribute, "id">;

    //product set
    products!: EntityTable<IProduct, "id">;
    productAttributes!: EntityTable<IProductAttribute, "id">;
    productImages!: EntityTable<IProductImage, "id">;
    productDescriptions!: EntityTable<IProductDescription, "id">;
    productKeywords!: EntityTable<IProductKeyWord, "id">;
    productTimeStamps!: EntityTable<IProductTimeStamp, "id">;




    // Orders set
    orders!: EntityTable<IOrder, "id">;
    orderItems!: EntityTable<IOrderItem, "id">;
    orderAdjustments!: EntityTable<IOrderAdjustment, "id">;
    orderDiscounts!: EntityTable<IOrderDiscount, "id">;
    orderPayments!: EntityTable<IOrderPayment, "id">;
    orderCancellations!: EntityTable<IOrderCancellation, "id">;
    customers!: EntityTable<ICustomer, "id">;


    reports!: EntityTable<IReport, "id">;






    constructor() {
        super("POS_UniversalDB_0012");

        this.version(1).stores({

            users: "++id, guid, name, email, username, password, isActive",

            refreshTokens: "++id, userId, token",
            userSecurity: "++id, userId, lastLoginDate, isLockedOut",
            userProfiles: "++id, userId, phoneNumber, email",
            userWorkplaces: "++id, userId, roleId",
            userSettings: "++id, userId",
            loginHistory: "++id, userId, loginDate, ipAddress",
            roles: "++id, name",


            systemLogs: '++id, type, pageName, timestamp',

            masterProductAttributes: '++id, name',

            //product tables
            products: "++id, code, sku, barcode, name, isActive",
            productAttributes: "++id, productId, attributeId",
            productImages: "++id, productId",
            productDescriptions: "++id, productId",
            productKeywords: "++id, productId",
            productTimeStamps: "++id, productId",


            // Order tables - Indexing foreign keys for fast relational queries
            orders: "++id, orderNumber, customerId, status, createdAt",
            orderItems: "++id, orderId, productId",
            orderAdjustments: "++id, orderId, category",
            orderDiscounts: "++id, orderId, category",
            orderPayments: "++id, orderId, category,method",
            orderCancellations: "++id, orderId, orderNumber,createdAt",
            customers: "++id, guid, name, email, phone",

            reports: "++id, name, description, version, url",

        });
    }
}

const db = new POSUniversalDexie();

export default db;