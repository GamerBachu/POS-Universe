import db from "@/libs/db/appDb";
import type { IPaginationResponse, ServiceResponse } from "@/types/serviceResponse";
import type { ICustomer } from "@/types/customer";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";

export class customerApi {

    private static createResponse<T>(
        data: T,
        message: string,
        success: boolean = true,
        status: number = 200
    ): ServiceResponse<T> {
        return { status, success, message, data };
    }

    static async getById(id: number): Promise<ServiceResponse<ICustomer | null>> {
        try {
            const result = await db.customers.get(id);
            if (!result) {
                return this.createResponse(null, "Customer not found", false, 404);
            }
            return this.createResponse(result, "Customer retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Unknown error";
            return this.createResponse(null, msg, false, 500);
        }
    }

    static async add(payload: Partial<ICustomer>): Promise<ServiceResponse<number>> {

        try {
            if (payload.id !== undefined && payload.id !== null && payload.id <= 0) {
                delete payload.id;
            }
            const id = await db.customers.add({
                name: payload.name ?? '',
                email: payload.email ?? '',
                phone: payload.phone ?? '',
                address: payload.address ?? '',
                createdAt: toUTCNowForDB(),

            });
            return this.createResponse(id as number, "Customer added successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to add";
            return this.createResponse(0, msg, false, 500);
        }
    }

    static async update(id: number, payload: Partial<ICustomer>): Promise<ServiceResponse<number>> {
        try {
            const updatedCount = await db.customers.update(id, {
                name: payload.name ?? '',
                email: payload.email ?? '',
                phone: payload.phone ?? '',
                address: payload.address ?? '',
            });
            if (updatedCount === 0) {
                return this.createResponse(0, "No record updated", false, 404);
            }
            return this.createResponse(id, "Customer updated successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Update failed";
            return this.createResponse(0, msg, false, 500);
        }
    }

    static async delete(id: number): Promise<ServiceResponse<void>> {
        try {
            await db.customers.delete(id);
            return this.createResponse(undefined, "Deleted successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Delete failed";
            return this.createResponse(undefined, msg, false, 500);
        }
    }

    static async getAll(): Promise<ServiceResponse<ICustomer[]>> {
        try {
            const result = await db.customers.toArray();
            return this.createResponse(result, "Items retrieved successfully");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Fetch failed";
            return this.createResponse([], msg, false, 500);
        }
    }

    static async getFiltered(
        phone: string = "",
        email: string = "",
        page: number = 1,
        pageSize: number = 10,
    ): Promise<ServiceResponse<IPaginationResponse<ICustomer>>> {
        try {
            let collection;

            if (email.trim() && phone.trim()) {
                // Filter by both email and phone
                collection = db.customers
                    .where("email")
                    .equals(email)
                    .and(item => item.phone === phone);
            }
            else if (email.trim()) {
                // Filter by email only
                collection = db.customers
                    .where("email")
                    .equals(email);
            }
            else if (phone.trim()) {
                // Filter by phone only
                collection = db.customers
                    .where("phone")
                    .equals(phone);
            }
            else {
                // No filters applied
                collection = db.customers.toCollection();
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