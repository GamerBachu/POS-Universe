import type { IPaginationResponse, ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { IMasterProductAttribute } from "@/types/masters";


export class masterProductAttributeApi {

    private static createResponse<T>(
        data: T,
        message: string,
        success: boolean = true,
        status: number = 200
    ): ServiceResponse<T> {
        return { status, success, message, data };
    }

    static async getById(id: number): Promise<ServiceResponse<IMasterProductAttribute | null>> {
        try {
            const result = await db.masterProductAttributes.get(id);
            if (!result) {
                return this.createResponse(null, "Attribute not found", false, 404);
            }
            return this.createResponse(result, "Attribute retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Unknown error";
            return this.createResponse(null, msg, false, 500);
        }
    }

    static async add(payload: Partial<IMasterProductAttribute>): Promise<ServiceResponse<number>> {
        try {
            if (payload?.id !== undefined) {
                delete payload.id;
            }

            //check name is required
            if (!payload.name) {
                return this.createResponse(0, "Name is required", false, 400);
            }

            // check for duplicate name and active status true
            const existing = await db.masterProductAttributes
                .where("name")
                .equalsIgnoreCase(payload.name)
                .and(item => item.isActive === true)
                .first();
            if (existing) {
                return this.createResponse(0, "Attribute with this name already exists", false, 409);
            }

            const id = await db.masterProductAttributes.add({
                name: payload.name ?? '',
                isActive: payload.isActive ?? true
            });
            return this.createResponse(id as number, "Attribute added successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to add";
            return this.createResponse(0, msg, false, 500);
        }
    }

    static async update(id: number, payload: Partial<IMasterProductAttribute>): Promise<ServiceResponse<number>> {
        try {
            const updatedCount = await db.masterProductAttributes.update(id, payload);
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
            await db.masterProductAttributes.delete(id);
            return this.createResponse(undefined, "Deleted successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Delete failed";
            return this.createResponse(undefined, msg, false, 500);
        }
    }

    static async getAll(): Promise<ServiceResponse<IMasterProductAttribute[]>> {
        try {
            const result = await db.masterProductAttributes.toArray();
            return this.createResponse(result, "Items retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Fetch failed";
            return this.createResponse([], msg, false, 500);
        }
    }
    static async getAllActive(): Promise<ServiceResponse<IMasterProductAttribute[]>> {
        try {
            const result = await db.masterProductAttributes
                .filter(item => item.isActive === true)
                .toArray();
            return this.createResponse(result, "Items retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Fetch failed";
            return this.createResponse([], msg, false, 500);
        }
    }
    static async getFiltered(

        searchTerm: string = "",
        activeFilter: string = "",
        page: number = 1,
        pageSize: number = 10,
    ): Promise<ServiceResponse<IPaginationResponse<IMasterProductAttribute>>> {
        try {
            let collection;

            if (searchTerm.trim() && activeFilter !== "") {
                // Filter by both Name and Status
                const isActive = activeFilter === "true";
                collection = db.masterProductAttributes
                    .where("name")
                    .startsWithIgnoreCase(searchTerm)
                    .filter(item => item.isActive === isActive);
            }
            else if (searchTerm.trim()) {
                // Filter by Name only
                collection = db.masterProductAttributes
                    .where("name")
                    .startsWithIgnoreCase(searchTerm);
            }
            else if (activeFilter !== "") {
                // Filter by Status only
                const isActive = activeFilter === "true";
                collection = db.masterProductAttributes
                    .filter(item => item.isActive === isActive);
            }
            else {
                // No filters applied
                collection = db.masterProductAttributes.toCollection();
            }

            // 2. Get Total Count for Pagination
            const totalCount = await collection.count();

            // 3. Apply Pagination (Sorting by ID descending to show newest first)
            const items = await collection
                .reverse()
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .toArray();

            return this.createResponse(
                { items, totalCount },
                "Retrieved successfully"
            );
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Fetch failed";
            return this.createResponse({ items: [], totalCount: 0 }, msg, false, 500);
        }
    }
}
