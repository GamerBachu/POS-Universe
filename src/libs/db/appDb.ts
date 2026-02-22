import Dexie, { type EntityTable } from "dexie";
import {
    type IProduct,
    type IProductAttribute,
    type IProductImage,
} from "@/types/product";
import { type IMasterProductAttribute } from "@/types/masters";
import { type IUser, type IRefreshToken } from "@/types/user";
import type { ISystemLog } from "@/types/systemLog";

class POSUniversalDexie extends Dexie {
    users!: EntityTable<IUser, "id">;
    refreshTokens!: EntityTable<IRefreshToken, "id">;
    systemLogs!: EntityTable<ISystemLog, "id">;
    masterProductAttributes!: EntityTable<IMasterProductAttribute, "id">;
    products!: EntityTable<IProduct, "id">;
    productAttributes!: EntityTable<IProductAttribute, "id">;
    productImages!: EntityTable<IProductImage, "id">;

    constructor() {
        super("POS_UniversalDB_0012");

        this.version(1).stores({
            // Only index fields used in .where(), .orderBy(), or .filter()
            users: "++id, &guid, &email, &username, isActive",

            refreshTokens: "++id, userId, token",

            systemLogs: '++id, type, pageName, timestamp',

            masterProductAttributes: '++id, &name',

            // Added '&' for unique constraints on identifiers
            // Removed non-searchable fields like prices/rates to save index memory
            products: "++id, &code, sku, barcode, name, isActive",

            productAttributes: "++id, productId, attributeId",

            productImages: "++id, productId",
        });
    }
}

const db = new POSUniversalDexie();

export default db;