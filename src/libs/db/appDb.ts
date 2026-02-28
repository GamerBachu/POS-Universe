import Dexie, { type EntityTable } from "dexie";
import {
    type IProduct,
    type IProductAttribute,
    type IProductDescription,
    type IProductImage,
    type IProductKeyWord,
} from "@/types/product";
import { type IMasterProductAttribute } from "@/types/masters";
import { type IUser, type IRefreshToken } from "@/types/user";
import type { ISystemLog } from "@/types/systemLog";

class POSUniversalDexie extends Dexie {
    users!: EntityTable<IUser, "id">;
    refreshTokens!: EntityTable<IRefreshToken, "id">;
    systemLogs!: EntityTable<ISystemLog, "id">;
    masterProductAttributes!: EntityTable<IMasterProductAttribute, "id">;

    //product set
    products!: EntityTable<IProduct, "id">;
    productAttributes!: EntityTable<IProductAttribute, "id">;
    productImages!: EntityTable<IProductImage, "id">;
    productDescriptions!: EntityTable<IProductDescription, "id">;
    productKeywords!: EntityTable<IProductKeyWord, "id">;

    constructor() {
        super("POS_UniversalDB_0012");

        this.version(1).stores({

            users: "++id, guid, name, email, username, password, isActive",

            refreshTokens: "++id, userId, token",

            systemLogs: '++id, type, pageName, timestamp',

            masterProductAttributes: '++id, name',

            //product tables
            products: "++id, code, sku, barcode, name, isActive",
            productAttributes: "++id, productId, attributeId",
            productImages: "++id, productId",
            productDescriptions: "++id, productId",
            productKeywords: "++id, productId",
        });
    }
}

const db = new POSUniversalDexie();

export default db;