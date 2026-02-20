import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { IProductImage } from "@/types/product";

export class productImageApi {

    static async get(id: number) {
        return db.productImages.get(id);
    }

    static async post(payload: Partial<IProductImage>) {
        return db.productImages.add(payload as IProductImage);
    }

    static async put(payload: Partial<IProductImage>, id: number) {
        return db.productImages.update(id, payload as IProductImage);
    }

    static async delete(id: number) {
        return db.productImages.delete(id);
    }

    static async getAll(): Promise<ServiceResponse<IProductImage[]>> {

        const result = await db.productImages.toArray();
        return {
            status: 200,
            success: true,
            message: "Get all products completed successfully",
            data: result
        };
    }
}