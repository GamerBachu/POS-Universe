import type { IProductView } from "@/types/product";

class SeedData {



    masterProductAttribute = [
        { "id": 1, "name": "Active Ingredients" },
        { "id": 2, "name": "Administration Route" },
        { "id": 3, "name": "Age Group" },
        { "id": 4, "name": "Allergen Information" },
        { "id": 5, "name": "Aperture" },
        { "id": 6, "name": "Assembly Required" },
        { "id": 7, "name": "Batch" },
        { "id": 8, "name": "Battery Life" },
        { "id": 9, "name": "Bluetooth Version" },
        { "id": 10, "name": "Brand" },
        { "id": 11, "name": "Brand Tier" },
        { "id": 12, "name": "Care Instructions" },
        { "id": 13, "name": "Category" },
        { "id": 14, "name": "Certification" },
        { "id": 15, "name": "Charging Port" },
        { "id": 16, "name": "Closure Type" },
        { "id": 17, "name": "Collection" },
        { "id": 18, "name": "Color" },
        { "id": 19, "name": "Compatible Devices" },
        { "id": 20, "name": "Connectivity" },
        { "id": 21, "name": "Contraindications" },
        { "id": 22, "name": "Country of Origin" },
        { "id": 23, "name": "Dietary Needs" },
        { "id": 24, "name": "Dimensions" },
        { "id": 25, "name": "Display Size" },
        { "id": 26, "name": "Dosage" },
        { "id": 27, "name": "Drug Form" },
        { "id": 28, "name": "Energy Efficiency" },
        { "id": 29, "name": "Expiry Date" },
        { "id": 30, "name": "Fabric Type" },
        { "id": 31, "name": "Finish" },
        { "id": 32, "name": "Fit Type" },
        { "id": 33, "name": "Flavor" },
        { "id": 34, "name": "Form Factor" },
        { "id": 35, "name": "Fragility" },
        { "id": 36, "name": "Fragrance Notes" },
        { "id": 37, "name": "Gender" },
        { "id": 38, "name": "GPU / Graphics Card" },
        { "id": 39, "name": "Hair Type Compatibility" },
        { "id": 40, "name": "Hazmat Class" },
        { "id": 41, "name": "Ingredients" },
        { "id": 42, "name": "IP Rating" },
        { "id": 43, "name": "Lens Type" },
        { "id": 44, "name": "Manufacturer" },
        { "id": 45, "name": "Material" },
        { "id": 46, "name": "Max Speed / RPM" },
        { "id": 47, "name": "Max Weight Capacity" },
        { "id": 48, "name": "Microphone Type" },
        { "id": 49, "name": "Model" },
        { "id": 50, "name": "Model Year" },
        { "id": 51, "name": "Mounting Type" },
        { "id": 52, "name": "Neckline" },
        { "id": 53, "name": "Noise Control" },
        { "id": 54, "name": "Number of Channels" },
        { "id": 55, "name": "Number of Items" },
        { "id": 56, "name": "Number of Ports" },
        { "id": 57, "name": "Nutritional Grade" },
        { "id": 58, "name": "Occasion" },
        { "id": 59, "name": "Operating System" },
        { "id": 60, "name": "Package Type" },
        { "id": 61, "name": "Pattern" },
        { "id": 62, "name": "Power Source" },
        { "id": 63, "name": "Prescription Status" },
        { "id": 64, "name": "Processor" },
        { "id": 65, "name": "RAM" },
        { "id": 66, "name": "Refresh Rate" },
        { "id": 67, "name": "Resolution" },
        { "id": 68, "name": "Scent" },
        { "id": 69, "name": "Screen Panel Type" },
        { "id": 70, "name": "Season" },
        { "id": 71, "name": "Sensor Type" },
        { "id": 72, "name": "Serial" },
        { "id": 73, "name": "Shelf Life" },
        { "id": 74, "name": "Side Effects" },
        { "id": 75, "name": "Size" },
        { "id": 76, "name": "Skin Type Compatibility" },
        { "id": 77, "name": "Sleeve Length" },
        { "id": 78, "name": "Software Compatibility" },
        { "id": 79, "name": "Storage Capacity" },
        { "id": 80, "name": "Storage Temperature" },
        { "id": 81, "name": "Storage Type" },
        { "id": 82, "name": "Strength" },
        { "id": 83, "name": "Style" },
        { "id": 84, "name": "Therapeutic Class" },
        { "id": 85, "name": "Torque" },
        { "id": 86, "name": "Usage" },
        { "id": 87, "name": "Voltage" },
        { "id": 88, "name": "Volume" },
        { "id": 89, "name": "Warranty" },
        { "id": 90, "name": "Water Resistance" },
        { "id": 91, "name": "Weight" },
        { "id": 92, "name": "Wireless Technology" }
    ];


};

export default SeedData;

const categories = [
    { prefix: "ELC", name: "Electronics", attrs: [10, 49, 64, 65, 79, 59, 25, 20, 8] },
    { prefix: "FAS", name: "Fashion", attrs: [10, 18, 75, 45, 30, 37, 70, 83] },
    { prefix: "PHM", name: "Pharmacy", attrs: [1, 26, 27, 21, 63, 74, 84, 29] },
    { prefix: "GRO", name: "Grocery", attrs: [10, 33, 57, 60, 73, 80, 81, 88] },
    { prefix: "HME", name: "Home & Kitchen", attrs: [10, 24, 45, 47, 51, 6, 62, 28] }
];

const brands = ["Samsung", "Apple", "Nike", "Dell", "Nestle", "Sony", "Adidas", "Logitech", "Puma", "HP"];
const colors = ["Black", "White", "Silver", "Midnight Blue", "Space Gray", "Red", "Olive Green"];

const generateSeedProducts = (): IProductView[] => {
    const products: IProductView[] = [];
    let globalAttrId = 1;

    for (let i = 1; i <= 100; i++) {
        const category = categories[i % categories.length];
        const brand = brands[i % brands.length];
        const productId = 100 + i;

        const product: IProductView = {
            id: productId,
            code: `${category.prefix}-${brand.substring(0, 3).toUpperCase()}-${1000 + i}`,
            sku: `${brand.toUpperCase()}-${i * 7}-POS`,
            barcode: (8806090000000 + i).toString(),
            name: `${brand} ${category.name} Item #${i}`,
            costPrice: parseFloat((Math.random() * 500 + 10).toFixed(2)),
            sellingPrice: 0, // Calculated below
            taxRate: i % 5 === 0 ? 0 : 8.0,
            stock: Math.floor(Math.random() * 200),
            reorderLevel: 10,
            isActive: true,
            productAttributes: category.attrs.map((attrId) => {
                let value = "Standard";
                // Logic to give realistic values based on Master IDs
                if (attrId === 10) value = brand;
                if (attrId === 18) value = colors[i % colors.length];
                if (attrId === 65) value = i % 2 === 0 ? "16GB" : "32GB";
                if (attrId === 79) value = i % 2 === 0 ? "512GB SSD" : "1TB NVMe";
                if (attrId === 75) value = ["S", "M", "L", "XL", "XXL"][i % 5];

                return {
                    id: globalAttrId++,
                    productId: productId,
                    attributeId: attrId,
                    value: value
                };
            }),
            productImages: [
                {
                    id: i,
                    productId: productId,
                    title: "Primary Image",
                    description: `A high-quality image showcasing the ${brand} ${category.name} product.`,
                    url: `/images/products/placeholder-${i % 10}.jpg`
                }
            ],
            productDescription: {
                id: productId,
                productId: productId,
                description: `High-quality ${category.name} product from ${brand}. Reliable and industry-standard.`
            },
            productKeywords: [
                { id: i * 2, productId: productId, keyword: category.name.toLowerCase() },
                { id: i * 2 + 1, productId: productId, keyword: brand.toLowerCase() }
            ],
            productTimeStamp: {
                id: productId,
                productId: productId,
                lastUpdatedBy: 1,
                lastUpdatedAt: new Date().toISOString()
            }
        };

        product.sellingPrice = parseFloat((product.costPrice * 1.4).toFixed(2));
        products.push(product);
    }
    return products;
};

export const masterProductData: IProductView[] = generateSeedProducts();