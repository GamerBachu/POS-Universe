



export interface IProduct {
    id: number;           // Internal DB Auto-increment
    code: string;            // Product Uniq Code 
    sku: string;          // Internal SKU (e.g., "XPO-MX3S-BLK")
    barcode: string;      // EAN/UPC for scanner
    name: string;

    // Financial
    costPrice: number;    // For profit reporting
    sellingPrice: number; // Current retail price
    taxRate: number;      // e.g., 0.10 for 10%

    // Inventory
    stock: number;
    reorderLevel: number; // Alert when stock < this value
    unit: string;

    // State
    isActive: boolean;    // Soft delete instead of hard delete
}

export interface IProductAttribute {
    id: number;           // Internal DB Auto-increment
    productId: number; // foreign key to Product 
    attributeId: number; // foreign key to Attribute
    value: string;
}


export interface IProductImage {
    id: number;           // Internal DB Auto-increment
    productId: number; // foreign key to Product 
    title: string;
    description: string;
    url: string;
}

//   // Tracking
//     serial?: string;      // Only for serialized items
//     model: string;
//     batch: string;
//     expiry: string;       // ISO Date string

//     // Categorization
//     category: string;
//     manufacturer: string;
//     description: string;