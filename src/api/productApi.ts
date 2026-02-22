import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import { type IProduct } from "@/types/product";

export class productApi {
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

    static async add(payload: IProduct): Promise<ServiceResponse<number | undefined | null>> {

        // always delete the id from payload to prevent any accidental overwriting of existing records        
        // always delete the id from payload to prevent any accidental overwriting of existing records        
        if (payload.id !== undefined) {
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

        return this.createResponse(newId, "Product created successfully.", true, 201);
    }

    static async update(id: number, payload: Partial<IProduct>): Promise<ServiceResponse<boolean>> {
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
        return this.createResponse(true, "Product updated successfully.");
    }

    static async delete(id: number): Promise<ServiceResponse<boolean>> {
        const count = await db.products.where("id").equals(id).modify({ isActive: false });
        return count
            ? this.createResponse(true, "Product deleted.")
            : this.createResponse(false, "Product not found.", false, 404);
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
        const nameParts = product.name?.trim().split(/\s+/) || [];
        const prefix = (nameParts.length >= 2 ? nameParts[0][0] + nameParts[1][0] : product.name?.substring(0, 2) || 'XX').toUpperCase().padEnd(2, 'X');
        const mid = (product.sku?.[0] || '0').toUpperCase();
        const base = `${prefix}${mid}`;

        // Optimization: Get the count once
        const count = await db.products.where("code").startsWithIgnoreCase(base).count();
        let sequence = count + 1;

        while (true) {
            const code = `${base}${sequence.toString(36).toUpperCase().padStart(3, '0')}`;
            const exists = await db.products.where("code").equalsIgnoreCase(code).first();
            if (!exists) return code;
            sequence++;
        }
    }
}