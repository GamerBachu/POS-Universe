import Dexie, { type EntityTable } from "dexie";
import {
    type IProduct,
    type IProductAttribute,
    type IProductImage,
} from "@/types/product";
import { type IMasterProductAttribute } from "@/types/masters";
import { type User, type UserToken } from "@/types/user";

class POSUniversalDexie extends Dexie {
    users!: EntityTable<User, "id">;
    userTokens!: EntityTable<UserToken, "id">;

    masterProductAttributes!: EntityTable<IMasterProductAttribute, "id">;

    products!: EntityTable<IProduct, "id">;
    productAttributes!: EntityTable<IProductAttribute, "id">;
    productImages!: EntityTable<IProductImage, "id">;

    constructor() {
        super("POS_UniversalDB_0012");
        this.version(1).stores({
            users: "++id,guid,name,email,username,password,isActive",
            userTokens: "++id,userId,token,validTill",

            masterProductAttributes: "++id,name",

            products: "++id,code,sku,name,price,stock",
            productAttributes: "++id,productId,attributeId",
            productImages: "++id,productId",
        });
    }
}

const db = new POSUniversalDexie();

export default db;
