import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import { type IProductFilter, type IProductView } from "@/types/product";
import { productAttributeApi } from "./productAttributeApi";
import { productImageApi } from "./productImageApi";
import { productDescriptionApi } from "./productDescriptionApi";
import { productKeywordApi } from "./productKeywordApi";

export class productsApi {
    private static getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : "Operation failed";
    }

    /**
     * Unified response factory
     */
    private static createResponse<T>(
        data: T,
        message: string,
        success: boolean = true,
        status: number = 200,
    ): ServiceResponse<T> {
        return { status, success, message, data };
    }

    static async getById(
        id: number,
    ): Promise<ServiceResponse<IProductView | undefined>> {
        try {
            const product = await db.products.get(id);

            if (!product)
                return this.createResponse(undefined, "Product not found.", false, 404);

            const attributes = await productAttributeApi.getAllByProductId(id);

            const images = await productImageApi.getAllByProductId(id);

            const description = await productDescriptionApi.getByProductId(id);

            const keywords = await productKeywordApi.getAllByProductId(id);

            //get last entry only
            const timeStamp = await db.productTimeStamps
                .where("productId")
                .equals(id)
                .last();

            const combine: IProductView = {
                ...product,
                productAttributes: attributes.data,
                productImages: images.data,
                productDescription: description.data,
                productKeywords: keywords.data,
                productTimeStamp: timeStamp || undefined,
            };
            return this.createResponse(combine, "Product retrieved.");
        } catch (error) {
            return this.createResponse(
                undefined,
                this.getErrorMessage(error),
                false,
                500,
            );
        }
    }


    static async getFiltered(payload: IProductFilter): Promise<ServiceResponse<{ items: IProductView[]; totalCount: number; }>> {
        try {
            const fCode = payload.code?.toLowerCase().trim() ?? "";
            const fSku = payload.sku?.toLowerCase().trim() ?? "";
            const fBarcode = payload.barcode?.toLowerCase().trim() ?? "";
            const fName = payload.name?.toLowerCase().trim() ?? "";
            const fSellingPrice = payload.sellingPrice;
            const fTaxRate = payload.taxRate;
            const fStock = payload.stock;
            const fReorderLevel = payload.reorderLevel;
            const fIsActive = payload.isActive;
            const fCurrentPage = payload.currentPage;
            const fPageSize = payload.pageSize;
            console.log(payload);

            // 1. Initiate collection using the 'id' index in reverse (DESC)
            // This ensures the newest products (higher IDs) are processed first
            const collection = db.products.orderBy("id").reverse().filter(item => {
                const matchesName = !fName || item.name.toLowerCase().includes(fName);
                const matchesCode = !fCode || item.code.toLowerCase().includes(fCode);
                const matchesSku = !fSku || item.sku.toLowerCase().includes(fSku);
                const matchesBarcode = !fBarcode || item.barcode.toLowerCase().includes(fBarcode);

                const itemIsActive = !!item.isActive;
                const matchesStatus = !fIsActive || (fIsActive === "true" && itemIsActive) || (fIsActive === "false" && !itemIsActive);

                const matchesSellingPrice = fSellingPrice === undefined || fSellingPrice === null || item.sellingPrice === fSellingPrice;
                const matchesTaxRate = fTaxRate === undefined || fTaxRate === null || item.taxRate === fTaxRate;
                const matchesStock = fStock === undefined || fStock === null || item.stock === fStock;
                const matchesReorderLevel = fReorderLevel === undefined || fReorderLevel === null || item.reorderLevel === fReorderLevel;

                return matchesName && matchesCode && matchesSku && matchesBarcode && matchesStatus && matchesSellingPrice && matchesTaxRate && matchesStock && matchesReorderLevel;
            });

            // 2. Get Total Count for Pagination
            // We must await this to tell the UI how many pages exist in total
            const totalCount = await collection.count();

            // 3. Apply Pagination (Offset and Limit)
            // This is much more memory-efficient than .toArray().slice()
            const products = await collection
                .offset((fCurrentPage - 1) * fPageSize)
                .limit(fPageSize)
                .toArray();

            const items: IProductView[] = await Promise.all(products.map(async (product) => {
                if (!product.id) return product as IProductView;

                const [attributes, images, description, keywords, timeStamp] = await Promise.all([
                    productAttributeApi.getAllByProductId(product.id),
                    productImageApi.getAllByProductId(product.id),
                    productDescriptionApi.getByProductId(product.id),
                    productKeywordApi.getAllByProductId(product.id),
                    db.productTimeStamps.where("productId").equals(product.id).last()
                ]);

                return {
                    ...product,
                    productAttributes: attributes.data,
                    productImages: images.data,
                    productDescription: description.data,
                    productKeywords: keywords.data,
                    productTimeStamp: timeStamp || undefined,
                };
            }));

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
}
