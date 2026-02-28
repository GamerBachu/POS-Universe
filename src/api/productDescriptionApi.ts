import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { IProductDescription } from "@/types/product";

export class productDescriptionApi {
    private static getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : "Operation failed";
    }

    private static createResponse<T>(
        data: T,
        message: string,
        success: boolean = true,
        status: number = 200
    ): ServiceResponse<T> {
        return { status, success, message, data };
    }

    static async getById(id: number): Promise<ServiceResponse<IProductDescription | null>> {
        try {
            const result = await db.productDescriptions.get(id);
            if (!result) {
                return this.createResponse(null, "Description not found", false, 404);
            }
            return this.createResponse(result, "Description retrieved");
        } catch (error: unknown) {
            return this.createResponse(null, this.getErrorMessage(error), false, 500);
        }
    }

    static async add(payload: IProductDescription): Promise<ServiceResponse<number>> {
        try {
            if (payload.id !== undefined && payload.id !== null && payload.id <= 0) {
                delete payload.id;
            }
            const id = await db.productDescriptions.add(payload);
            return this.createResponse(id as number, "Description added");
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }

    static async update(id: number, payload: Partial<IProductDescription>): Promise<ServiceResponse<number>> {
        try {
            const updatedCount = await db.productDescriptions.update(id, payload);
            if (updatedCount === 0) {
                return this.createResponse(0, "Description not found", false, 404);
            }
            return this.createResponse(id, "Description updated");
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }

    static async delete(id: number): Promise<ServiceResponse<void>> {
        try {
            await db.productDescriptions.delete(id);
            return this.createResponse(undefined, "Description deleted");
        } catch (error: unknown) {
            return this.createResponse(undefined, this.getErrorMessage(error), false, 500);
        }
    }

    static async getAll(): Promise<ServiceResponse<IProductDescription[]>> {
        try {
            const result = await db.productDescriptions.toArray();
            return this.createResponse(result, "Descriptions retrieved");
        } catch (error: unknown) {
            return this.createResponse([], this.getErrorMessage(error), false, 500);
        }
    }


    static async getByProductId(productId: number): Promise<ServiceResponse<IProductDescription | null>> {
        try {
            const result = await db.productDescriptions
                .where("productId")
                .equals(productId)
                .first();
            if (!result) {
                return this.createResponse(null, "Description not found", false, 404);
            }
            return this.createResponse(result, "Description retrieved");
        } catch (error: unknown) {
            return this.createResponse(null, this.getErrorMessage(error), false, 500);
        }
    }

    static async getAllByProductId(productId: number): Promise<ServiceResponse<IProductDescription[]>> {
        try {
            const result = await db.productDescriptions
                .where("productId")
                .equals(productId)
                .toArray();
            return this.createResponse(result, "Descriptions retrieved");
        } catch (error: unknown) {
            return this.createResponse([], this.getErrorMessage(error), false, 500);
        }
    }

    static async deleteByProductId(productId: number): Promise<ServiceResponse<number>> {
        try {
            const count = await db.productDescriptions
                .where("productId")
                .equals(productId)
                .delete();
            return this.createResponse(count, `Deleted ${count} description(s) successfully`);
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }
}; 
