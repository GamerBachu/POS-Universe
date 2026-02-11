import Dexie, { type EntityTable } from "dexie";
import { type Product } from "@/types/product";
import { type User } from "@/types/user";

class POSUniversalDexie extends Dexie {
    products!: EntityTable<Product, "id">;
    users!: EntityTable<User, "id">;
    constructor() {
        super("POS_UniversalDB_0012");
        this.version(1).stores({
            products: "++id,name,price,stock",
            users: "++id,guid,name,email,username,password,isActive",
        });
    }
}

const db = new POSUniversalDexie();

export default db;