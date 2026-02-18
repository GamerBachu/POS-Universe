import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { IProductAttribute } from "@/types/product";

export class productAttributeApi {
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
            return this.createResponse(result, "Attribute retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Unknown error";
            return this.createResponse(null, msg, false, 500);
        }
    }

    static async add(payload: IProductAttribute): Promise<ServiceResponse<number>> {
        try {
            const id = await db.productAttributes.add(payload);
            return this.createResponse(id as number, "Attribute added successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to add";
            return this.createResponse(0, msg, false, 500);
        }
    }

    static async update(id: number, payload: Partial<IProductAttribute>): Promise<ServiceResponse<number>> {
        try {
            const updatedCount = await db.productAttributes.update(id, payload);
            if (updatedCount === 0) {
                return this.createResponse(0, "No record updated", false, 404);
            }
            return this.createResponse(id, "Attribute updated successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Update failed";
            return this.createResponse(0, msg, false, 500);
        }
    }

    static async delete(id: number): Promise<ServiceResponse<void>> {
        try {
            await db.productAttributes.delete(id);
            return this.createResponse(undefined, "Deleted successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Delete failed";
            return this.createResponse(undefined, msg, false, 500);
        }
    }

    static async getAll(): Promise<ServiceResponse<IProductAttribute[]>> {
        try {
            const result = await db.productAttributes.toArray();
            return this.createResponse(result, "Items retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Fetch failed";
            return this.createResponse([], msg, false, 500);
        }
    }
}