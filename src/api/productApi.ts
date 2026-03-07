import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import { type IProduct } from "@/types/product";
import { toUTCNowForDB } from "@/utils/helper/dateUtils";

export class productApi {

    private static getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : "Operation failed";
    }

    /**
     * Unified response factory
     */
    private static createResponse<T>(data: T, message: string, success: boolean = true, status: number = 200): ServiceResponse<T> {
        return { status, success, message, data };
    }

    /**
     * Optimized Duplicate Check (AND logic)
     * Checks if a DIFFERENT record already uses this specific Code + SKU pair
     */
    private static async checkDuplicate(code: string, sku: string, currentId?: number): Promise<boolean> {
        const existing = await db.products
            .where("code")
            .equalsIgnoreCase(code)
            .and(item => item.sku.toLowerCase() === sku.toLowerCase())
            .first();

        // Return true if found and it's not the same product we are editing
        return !!(existing && existing.id !== currentId);
    }

    static async getAll(): Promise<IProduct[]> {
        return db.products.where("isActive").equals(1).toArray();
    }

    static async getById(id: number): Promise<ServiceResponse<IProduct | null>> {
        const product = await db.products.get(id);
        return product
            ? this.createResponse(product, "Product retrieved.")
            : this.createResponse(null, "Product not found.", false, 404);
    }

    static async add(payload: IProduct, userId: number): Promise<ServiceResponse<number | undefined | null>> {

        if (payload.id !== undefined && payload.id !== null && payload.id <= 0) {
            delete payload.id;
        }


        // Validation: Trimming and empty check combined
        if (!payload.name?.trim() || !payload.sku?.trim()) {
            return this.createResponse(null, "Name and SKU are required.", false, 400);
        }

        // 1. Generate unique code
        payload.code = await this.generateUniqueCode(payload);

        // 2. Duplicate Check (AND logic)
        if (await this.checkDuplicate(payload.code, payload.sku)) {
            return this.createResponse(null, "This Code and SKU combination is already registered.", false, 409);
        }

        const newId = await db.products.add({
            ...payload,
            stock: payload.stock || 0
        });

        db.productTimeStamps.add({ productId: newId ? newId : 0, lastUpdatedBy: userId, lastUpdatedAt: toUTCNowForDB() });


        return this.createResponse(newId, "Product created successfully.", true, 201);
    }

    static async update(id: number, payload: Partial<IProduct>, userId: number): Promise<ServiceResponse<boolean>> {
        const existingRecord = await db.products.get(id);
        if (!existingRecord) return this.createResponse(false, "Product not found.", false, 404);

        // Security: Lock the code so it cannot be changed via update
        payload.code = existingRecord.code;

        if (!payload.name?.trim() || !payload.sku?.trim()) {
            return this.createResponse(false, "Name and SKU are required.", false, 400);
        }

        // Duplicate Check (AND logic) - Excluding current ID
        if (await this.checkDuplicate(payload.code, payload.sku, id)) {
            return this.createResponse(false, "Conflict: Another product already uses this Code + SKU pair.", false, 409);
        }

        await db.products.update(id, payload);

        db.productTimeStamps.add({ productId: id, lastUpdatedBy: userId, lastUpdatedAt: toUTCNowForDB() }); // log

        return this.createResponse(true, "Product updated successfully.");
    }

    static async delete(id: number, userId: number): Promise<ServiceResponse<boolean>> {
        try {
            await db.products.delete(id);
            await db.productTimeStamps.add({ productId: id, lastUpdatedBy: userId, lastUpdatedAt: toUTCNowForDB() }); // Log the deletion
            return this.createResponse(true, "Product deleted successfully.");
        } catch (error: unknown) {
            return this.createResponse(false, this.getErrorMessage(error), false, 500);
        }
    };


    static async getFiltered(
        name: string,
        code: string,
        sku: string,
        barcode: string,
        isActive: string,
        page: number,
        pageSize: number
    ): Promise<ServiceResponse<{ items: IProduct[]; totalCount: number; }>> {
        try {
            const fName = name.toLowerCase().trim();
            const fCode = code.toLowerCase().trim();
            const fSku = sku.toLowerCase().trim();
            const fBarcode = barcode.toLowerCase().trim();

            // 1. Initiate collection using the 'id' index in reverse (DESC)
            // This ensures the newest products (higher IDs) are processed first
            const collection = db.products.orderBy("id").reverse().filter(item => {
                const matchesName = fName === "" || item.name.toLowerCase().includes(fName);
                const matchesCode = fCode === "" || item.code.toLowerCase().includes(fCode);
                const matchesSku = fSku === "" || item.sku.toLowerCase().includes(fSku);
                const matchesBarcode = fBarcode === "" || item.barcode.toLowerCase().includes(fBarcode);
                const matchesStatus = isActive === "" || String(item.isActive) === isActive;

                return matchesName && matchesCode && matchesSku && matchesBarcode && matchesStatus;
            });

            // 2. Get Total Count for Pagination
            // We must await this to tell the UI how many pages exist in total
            const totalCount = await collection.count();

            // 3. Apply Pagination (Offset and Limit)
            // This is much more memory-efficient than .toArray().slice()
            const items = await collection
                .offset((page - 1) * pageSize)
                .limit(pageSize)
                .toArray();

            return this.createResponse(
                { items, totalCount },
                "Products retrieved successfully."
            );
        } catch (error) {
            return this.createResponse(
                { items: [], totalCount: 0 },
                error instanceof Error ? error.message : "An unexpected error occurred",
                false,
                500
            );
        }
    }

    static async generateUniqueCode(product: IProduct): Promise<string> {
        // Helper: Convert char to 2-digit string (A->01, B->02). Non-letters -> 00.
        const getPos = (char: string | undefined): string => {
            if (!char) return "00";
            const code = char.toUpperCase().charCodeAt(0);
            return (code >= 65 && code <= 90) ? (code - 64).toString().padStart(2, '0') : "00";
        };

        const words = product.name?.trim().split(/\s+/) || [];
        let namePart = "";

        // Build 6-digit suffix from name
        if (words.length >= 3) {
            namePart = getPos(words[0][0]) + getPos(words[1][0]) + getPos(words[2][0]);
        } else if (words.length === 2) {
            namePart = getPos(words[0][0]) + getPos(words[1][0]) + getPos(words[1][1]);
        } else if (words.length === 1) {
            const w = words[0];
            namePart = getPos(w[0]) + getPos(w[1]) + getPos(w[2]);
        } else {
            namePart = "000000";
        }

        // Ensure it's exactly 6 digits
        namePart = namePart.padEnd(6, '0').slice(0, 6);

        // Sequence Check (01-99)`
        const count = await db.products.filter(p => p.code.endsWith(namePart)).count();
        let seq = count + 1;

        // Find next available sequence
        while (seq <= 99) {
            const finalCode = `${seq.toString().padStart(2, '0')}${namePart}`;
            const exists = await db.products.where("code").equals(finalCode).first();

            if (!exists) return finalCode;
            seq++;
        }

        return `99${namePart}`; // Safety fallback
    }
}