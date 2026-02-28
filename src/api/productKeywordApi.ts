import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { IProductKeyWord } from "@/types/product";

export class productKeywordApi {
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

    static async getById(id: number): Promise<ServiceResponse<IProductKeyWord | null>> {
        try {
            const result = await db.productKeywords.get(id);
            if (!result) {
                return this.createResponse(null, "Keyword not found", false, 404);
            }
            return this.createResponse(result, "Keyword retrieved");
        } catch (error: unknown) {
            return this.createResponse(null, this.getErrorMessage(error), false, 500);
        }
    }

    static async add(payload: IProductKeyWord): Promise<ServiceResponse<number>> {
        try {
            if (payload.id !== undefined && payload.id !== null && payload.id <= 0) {
                delete payload.id;
            }
            const id = await db.productKeywords.add(payload);
            return this.createResponse(id as number, "Keyword added");
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }

    static async update(id: number, payload: Partial<IProductKeyWord>): Promise<ServiceResponse<number>> {
        try {
            const updatedCount = await db.productKeywords.update(id, payload);
            if (updatedCount === 0) {
                return this.createResponse(0, "Keyword not found", false, 404);
            }
            return this.createResponse(id, "Keyword updated");
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }

    static async delete(id: number): Promise<ServiceResponse<void>> {
        try {
            await db.productKeywords.delete(id);
            return this.createResponse(undefined, "Keyword deleted");
        } catch (error: unknown) {
            return this.createResponse(undefined, this.getErrorMessage(error), false, 500);
        }
    }

    static async getAll(): Promise<ServiceResponse<IProductKeyWord[]>> {
        try {
            const result = await db.productKeywords.toArray();
            return this.createResponse(result, "Keywords retrieved");
        } catch (error: unknown) {
            return this.createResponse([], this.getErrorMessage(error), false, 500);
        }
    }

    static async getAllByProductId(productId: number): Promise<ServiceResponse<IProductKeyWord[]>> {
        try {
            const result = await db.productKeywords
                .where("productId")
                .equals(productId)
                .toArray();
            return this.createResponse(result, "Keywords retrieved");
        } catch (error: unknown) {
            return this.createResponse([], this.getErrorMessage(error), false, 500);
        }
    }

    static async deleteByProductId(productId: number): Promise<ServiceResponse<number>> {
        try {
            const count = await db.productKeywords
                .where("productId")
                .equals(productId)
                .delete();
            return this.createResponse(count, `Deleted ${count} attribute(s) successfully`);
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }
}; 
