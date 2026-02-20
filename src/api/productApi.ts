import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import type { IProduct } from "@/types/product";

export class productApi {

    static async get(id: number) {
        return db.products.get(id);
    }

    static async post(payload: Partial<IProduct>) {
        return db.products.add(payload as IProduct);
    }

    static async put(payload: Partial<IProduct>, id: number) {
        return db.products.update(id, payload as IProduct);
    }

    static async delete(id: number) {
        return db.products.delete(id);
    }

    static async getAll(): Promise<ServiceResponse<IProduct[]>> {

        const products = await db.products.toArray();
        return {
            status: 200,
            success: true,
            message: "Get all products completed successfully",
            data: products
        };
    }

    /**
     * Search products with multi-word matching and pagination
     * @param queryModel - The criteria to filter by
     * @param page - Current page number (starting at 1)
     * @param pageSize - Items per page
     */
    static async search(
        queryModel: Partial<IProduct>,
        page: number = 1,
        pageSize: number = 20
    ): Promise<ServiceResponse<{ items: IProduct[], total: number; }>> {
        try {
            const currentPage = Math.max(1, page);

            // 1. Pre-process filters to avoid repeated checks inside the loop
            const activeFilters = (Object.keys(queryModel) as Array<keyof IProduct>)
                .filter((key) => {
                    const value = queryModel[key];
                    return value !== undefined && value !== null && value !== "";
                })
                .map((key) => {
                    const value = queryModel[key];
                    const isString = typeof value === 'string';
                    return {
                        key,
                        value: isString ? (value as string).toLowerCase() : value,
                        isString
                    };
                });

            // 2. Start with the full collection
            let collection = db.products.toCollection();

            // 3. Apply filters
            if (activeFilters.length > 0) {
                collection = collection.filter((product) => {
                    return activeFilters.every((filter) => {
                        const productValue = product[filter.key];

                        if (filter.isString) {
                            return typeof productValue === 'string' &&
                                productValue.toLowerCase().includes(filter.value as string);
                        }

                        return productValue === filter.value;
                    });
                });
            }

            // 4. Handle Pagination
            const total = await collection.count();
            const items = await collection
                .reverse() // Show newest first by default
                .offset((currentPage - 1) * pageSize)
                .limit(pageSize)
                .toArray();

            return {
                status: 200,
                success: true,
                message: "Search completed successfully",
                data: { items, total }
            };

        } catch (error) {
            console.error("Search error:", error);
            return {
                status: 500,
                success: false,
                message: "Error processing search query",
                data: { items: [], total: 0 }
            };
        }
    }
}