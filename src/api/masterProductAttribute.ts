import type { ServiceResponse } from "@/types/serviceResponse";
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
}
// private static async seed() {

//     const master = [
//         { "id": 1, "name": "Color" },
//         { "id": 2, "name": "Material" },
//         { "id": 3, "name": "Storage Capacity" },
//         { "id": 4, "name": "RAM" },
//         { "id": 5, "name": "Display Size" },
//         { "id": 6, "name": "Resolution" },
//         { "id": 7, "name": "Connectivity" },
//         { "id": 8, "name": "Battery Life" },
//         { "id": 9, "name": "Weight" },
//         { "id": 10, "name": "Warranty" },
//         { "id": 11, "name": "Operating System" },
//         { "id": 12, "name": "Processor" },
//         { "id": 13, "name": "Charging Port" },
//         { "id": 14, "name": "Refresh Rate" },
//         { "id": 15, "name": "Water Resistance" },
//         { "id": 16, "name": "Fabric Type" },
//         { "id": 17, "name": "Country of Origin" },
//         { "id": 18, "name": "Package Type" },
//         { "id": 19, "name": "Voltage" },
//         { "id": 20, "name": "Fragility" },
//         { "id": 21, "name": "Model Year" },
//         { "id": 22, "name": "Age Group" },
//         { "id": 23, "name": "Gender" },
//         { "id": 24, "name": "Sleeve Length" },
//         { "id": 25, "name": "Fit Type" },
//         { "id": 26, "name": "Pattern" },
//         { "id": 27, "name": "Neckline" },
//         { "id": 28, "name": "GPU / Graphics Card" },
//         { "id": 29, "name": "Storage Type" },
//         { "id": 30, "name": "Screen Panel Type" },
//         { "id": 31, "name": "Assembly Required" },
//         { "id": 32, "name": "Dimensions" },
//         { "id": 33, "name": "Max Weight Capacity" },
//         { "id": 34, "name": "Finish" },
//         { "id": 35, "name": "Power Source" },
//         { "id": 36, "name": "Storage Temperature" },
//         { "id": 37, "name": "Allergen Information" },
//         { "id": 38, "name": "Ingredients" },
//         { "id": 39, "name": "Nutritional Grade" },
//         { "id": 40, "name": "Volume" },
//         { "id": 41, "name": "Skin Type Compatibility" },
//         { "id": 42, "name": "Hair Type Compatibility" },
//         { "id": 43, "name": "Fragrance Notes" },
//         { "id": 44, "name": "Hazmat Class" },
//         { "id": 45, "name": "IP Rating" },
//         { "id": 46, "name": "Bluetooth Version" },
//         { "id": 47, "name": "Number of Ports" },
//         { "id": 48, "name": "Closure Type" },
//         { "id": 49, "name": "Brand Tier" },
//         { "id": 50, "name": "Software Compatibility" },
//         { "id": 51, "name": "Mounting Type" },
//         { "id": 52, "name": "Number of Channels" },
//         { "id": 53, "name": "Sensor Type" },
//         { "id": 54, "name": "Max Speed / RPM" },
//         { "id": 55, "name": "Torque" },
//         { "id": 56, "name": "Lens Type" },
//         { "id": 57, "name": "Aperture" },
//         { "id": 58, "name": "Occasion" },
//         { "id": 59, "name": "Certification" },
//         { "id": 60, "name": "Shelf Life" }
//     ];
//     try {
//         master.forEach(async (item) => {
//             await db.masterProductAttributes.add({
//                 name: item.name,
//                 isActive: true
//             });
//         });
//     } catch (error) {
//         console.error("Failed to seed attributes:", error);
//     }

// }
