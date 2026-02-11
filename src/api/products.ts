export class productApi {


    static async getAllProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    static async getProductById(id: string) {
        try {
            const response = await fetch(`/api/products/${id}`);
            if (!response.ok) throw new Error('Product not found');
            return await response.json();
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    }



} 