import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { IProductAttribute } from "@/types/product";

export class productAttributeApi {
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

    static async getById(id: number): Promise<ServiceResponse<IProductAttribute | null>> {
        try {
            const result = await db.productAttributes.get(id);
            if (!result) {
                return this.createResponse(null, "Attribute not found", false, 404);
            }
            return this.createResponse(result, "Attribute retrieved");
        } catch (error: unknown) {
            return this.createResponse(null, this.getErrorMessage(error), false, 500);
        }
    }

    static async add(payload: IProductAttribute): Promise<ServiceResponse<number>> {
        try {
            if (payload.id !== undefined && payload.id !== null && payload.id <= 0) {
                delete payload.id;
            }
            const id = await db.productAttributes.add(payload);
            return this.createResponse(id as number, "Attribute added");
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }

    static async update(id: number, payload: Partial<IProductAttribute>): Promise<ServiceResponse<number>> {
        try {
            const updatedCount = await db.productAttributes.update(id, payload);
            if (updatedCount === 0) {
                return this.createResponse(0, "Attribute not found", false, 404);
            }
            return this.createResponse(id, "Attribute updated");
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }

    static async delete(id: number): Promise<ServiceResponse<void>> {
        try {
            await db.productAttributes.delete(id);
            return this.createResponse(undefined, "Attribute deleted");
        } catch (error: unknown) {
            return this.createResponse(undefined, this.getErrorMessage(error), false, 500);
        }
    }

    static async getAll(): Promise<ServiceResponse<IProductAttribute[]>> {
        try {
            const result = await db.productAttributes.toArray();
            return this.createResponse(result, "Attributes retrieved");
        } catch (error: unknown) {
            return this.createResponse([], this.getErrorMessage(error), false, 500);
        }
    }

    static async getAllByProductId(productId: number): Promise<ServiceResponse<IProductAttribute[]>> {
        try {
            const result = await db.productAttributes
                .where("productId")
                .equals(productId)
                .toArray();
            return this.createResponse(result, "Attributes retrieved");
        } catch (error: unknown) {
            return this.createResponse([], this.getErrorMessage(error), false, 500);
        }
    }

    static async deleteByProductId(productId: number): Promise<ServiceResponse<number>> {
        try {
            const count = await db.productAttributes
                .where("productId")
                .equals(productId)
                .delete();
            return this.createResponse(count, `Deleted ${count} Attribute(s) successfully`);
        } catch (error: unknown) {
            return this.createResponse(0, this.getErrorMessage(error), false, 500);
        }
    }
}; 
