import type { ServiceResponse } from "@/types/serviceResponse";
import db from "../libs/db/appDb";
import { type IProductView } from "@/types/product";
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
}
