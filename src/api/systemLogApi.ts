import db from "@/libs/db/appDb";
import type { IPaginationResponse, ServiceResponse } from "@/types/serviceResponse";
import type { ISystemLog } from "@/types/systemLog";

export class systemLogApi {

    private static createResponse<T>(
        data: T,
        message: string,
        success: boolean = true,
        status: number = 200
    ): ServiceResponse<T> {
        return { status, success, message, data };
    }

    static async getById(id: number): Promise<ServiceResponse<ISystemLog | null>> {
        try {
            const result = await db.systemLogs.get(id);
            if (!result) {
                return this.createResponse(null, "System log not found", false, 404);
            }
            return this.createResponse(result, "System log retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Unknown error";
            return this.createResponse(null, msg, false, 500);
        }
    }

    static async add(payload: Partial<ISystemLog>): Promise<ServiceResponse<number>> {

        try {
            if (payload.id !== undefined && payload.id !== null && payload.id <= 0) {
                delete payload.id;
            }
            const id = await db.systemLogs.add({
                type: payload.type ?? '',
                pageName: payload.pageName ?? '',
                functionName: payload.functionName ?? '',
                data: payload.data ?? '',
                timestamp: payload.timestamp ?? new Date().toISOString(),
                message: payload.message ?? '',
                stackTrace: payload.stackTrace ?? ''
            });
            return this.createResponse(id as number, "System log added successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to add";
            return this.createResponse(0, msg, false, 500);
        }
    }

    static async update(id: number, payload: Partial<ISystemLog>): Promise<ServiceResponse<number>> {
        try {
            const updatedCount = await db.systemLogs.update(id, payload);
            if (updatedCount === 0) {
                return this.createResponse(0, "No record updated", false, 404);
            }
            return this.createResponse(id, "System log updated successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Update failed";
            return this.createResponse(0, msg, false, 500);
        }
    }

    static async delete(id: number): Promise<ServiceResponse<void>> {
        try {
            await db.systemLogs.delete(id);
            return this.createResponse(undefined, "Deleted successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Delete failed";
            return this.createResponse(undefined, msg, false, 500);
        }
    }

    static async getAll(): Promise<ServiceResponse<ISystemLog[]>> {
        try {
            const result = await db.systemLogs.toArray();
            return this.createResponse(result, "Items retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Fetch failed";
            return this.createResponse([], msg, false, 500);
        }
    }

    static async getFiltered(
        type: string = "",
        pageName: string = "",
        page: number = 1,
        pageSize: number = 10,
    ): Promise<ServiceResponse<IPaginationResponse<ISystemLog>>> {
        try {
            let collection;

            if (type.trim() && pageName.trim()) {
                // Filter by both Type and PageName
                collection = db.systemLogs
                    .where("type")
                    .equals(type)
                    .and(item => item.pageName === pageName);
            }
            else if (type.trim()) {
                // Filter by Type only
                collection = db.systemLogs
                    .where("type")
                    .equals(type);
            }
            else if (pageName.trim()) {
                // Filter by PageName only
                collection = db.systemLogs
                    .where("pageName")
                    .equals(pageName);
            }
            else {
                // No filters applied
                collection = db.systemLogs.toCollection();
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