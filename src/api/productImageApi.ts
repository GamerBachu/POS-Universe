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

    static async getAllByProductId(productId: number): Promise<ServiceResponse<IProductImage[]>> {
        const result = await db.productImages
            .where("productId")
            .equals(productId)
            .toArray();
        return {
            status: 200,
            success: true,
            message: "Get product images completed successfully",
            data: result
        };
    }

    static async add(payload: Partial<IProductImage>): Promise<number | undefined> {
        return db.productImages.add(payload as IProductImage);
    }

    static async update(id: number, payload: Partial<IProductImage>): Promise<number> {
        return db.productImages.update(id, payload as IProductImage);
    }

    static async deleteByProductId(productId: number): Promise<void> {
        const images = await db.productImages
            .where("productId")
            .equals(productId)
            .toArray();
        const ids = images.map(img => img.id).filter((id): id is number => id !== undefined);
        if (ids.length > 0) {
            await db.productImages.bulkDelete(ids);
        }
    }
}