import { productAttributeApi } from "@/api/productAttributeApi";
import { productImageApi } from "@/api/productImageApi";
import { productApi } from "@/api/productApi";
import type { IProduct, IProductAttributeView, IProductImageView } from "@/types/product";
import { generateGuid } from "@/utils/helper/guid";
import type { ServiceResponse } from "@/types/serviceResponse";

/**
 * Collect attribute data from form inputs
 */
export function collectAttributesFromForm(
  attributeRows: IProductAttributeView[],
  formData: FormData
): { attributeId: number; value: string }[] {
  const attributes: { attributeId: number; value: string }[] = [];
  attributeRows.forEach((r) => {
    const attributeId = Number(formData.get(`attributeId_${r.rowid}`));
    const value = String(formData.get(`attributeValue_${r.rowid}`) ?? "");
    if (attributeId && value) {
      attributes.push({ attributeId, value });
    }
  });
  return attributes;
}

/**
 * Format form data to IProduct payload
 */
export function formatProductPayload(
  formData: Record<string, string>,
  action: string,
  id: number
): IProduct {
  return {
    id: action === "edit" ? id : 0,
    code: formData.code || "",
    sku: formData.sku || "",
    barcode: formData.barcode || "",
    name: formData.name || "",
    costPrice: Number(formData.costPrice),
    sellingPrice: Number(formData.sellingPrice),
    taxRate: Number(formData.taxRate),
    stock: Number(formData.stock),
    reorderLevel: Number(formData.reorderLevel),
    isActive: formData.isActive === "on",
  };
}

/**
 * Validate required product fields
 */
export function validateProductPayload(payload: Record<string, string>): { valid: boolean; error?: string } {
  if (!payload.name?.trim() || !payload.sku?.trim()) {
    return { valid: false, error: "Name and SKU are required." };
  }
  return { valid: true };
}

/**
 * Handle product save/update logic (attributes management)
 */
export async function handleAttributesSave(
  action: string,
  productId: number,
  attributes: { attributeId: number; value: string }[]
): Promise<IProductAttributeView[]> {
  // For edit, delete all existing attributes first
  if (action === "edit") {
    await productAttributeApi.deleteByProductId(productId);
  }

  // Add new attributes
  if (attributes.length > 0) {
    for (const attr of attributes) {
      await productAttributeApi.add({
        productId,
        attributeId: attr.attributeId,
        value: attr.value,
      });
    }
  }

  // Reload attributes from database
  const attrRes = await productAttributeApi.getAllByProductId(productId);
  if (attrRes.success && attrRes.data) {
    return attrRes.data.map((a) => ({
      rowid: generateGuid() + "-" + a.id,
      id: a.id,
      productId: a.productId,
      attributeId: a.attributeId,
      value: a.value,
    }));
  }
  return [];
}

/**
 * Handle product deletion with attributes and images cleanup
 */
export async function handleProductDeletion(productId: number): Promise<ServiceResponse<boolean>> {
  // Delete all attributes first
  await productAttributeApi.deleteByProductId(productId);
  // Delete all images
  await productImageApi.deleteByProductId(productId);
  // Delete the product
  return productApi.delete(productId);
}

/**
 * Handle API response errors and return standardized response
 */
export function handleApiResponse(
  response: ServiceResponse<unknown>,
  errorMessages: Record<number, string>
): { success: boolean; message: string } {
  if (errorMessages[response.status]) {
    return { success: false, message: errorMessages[response.status] };
  }
  if (!response.success) {
    return { success: false, message: response.message };
  }
  return { success: true, message: response.message };
}

/**
 * Transform product attributes to view format
 */
export function transformAttributesToView(
  attributes: Array<{ id?: number; productId: number; attributeId: number; value: string }>
): IProductAttributeView[] {
  return attributes
    .filter((a) => a.id && a.id > 0) // Filter out attributes without valid ID
    .map((a) => ({
      rowid: generateGuid() + "-" + a.id,
      id: a.id!,
      productId: a.productId,
      attributeId: a.attributeId,
      value: a.value,
    }));
}

/**
 * Collect image data from form inputs
 */
export function collectImagesFromForm(
  imageRows: IProductImageView[],
  formData: FormData
): { title: string; description: string; url: string }[] {
  const images: { title: string; description: string; url: string }[] = [];
  imageRows.forEach((row) => {
    const rowId = row.rowid || `id-${row.id}`;
    const title = String(formData.get(`imageTitle_${rowId}`) ?? "").trim();
    const description = String(formData.get(`imageDescription_${rowId}`) ?? "").trim();
    const url = String(formData.get(`imageUrl_${rowId}`) ?? "").trim();
    if (url) { // Only require URL, title and description are optional
      images.push({ title, description, url });
    }
  });
  return images;
}

/**
 * Handle product images save
 */
export async function handleImagesSave(
  action: string,
  productId: number,
  images: { title: string; description: string; url: string }[]
): Promise<IProductImageView[]> {
  // For edit, delete all existing images first
  if (action === "edit") {
    await productImageApi.deleteByProductId(productId);
  }

  // Add new images
  if (images.length > 0) {
    for (const img of images) {
      await productImageApi.add({
        productId,
        title: img.title,
        description: img.description,
        url: img.url,
      });
    }
  }

  // Reload images from database
  const imgRes = await productImageApi.getAllByProductId(productId);
  if (imgRes.success && imgRes.data) {
    return imgRes.data.map((img) => ({
      rowid: generateGuid() + "-" + img.id,
      id: img.id,
      productId: img.productId,
      title: img.title,
      description: img.description,
      url: img.url,
    }));
  }
  return [];
}
