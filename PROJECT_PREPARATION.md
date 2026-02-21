# Project Preparation & Pattern Guide

This document provides ready-to-use patterns, boilerplate code, and detailed examples for common tasks in the **POS Universe** project.

---

## Table of Contents

1. [Component Patterns](#component-patterns)
2. [Type Definitions](#type-definitions)
3. [API Integration](#api-integration)
4. [Context Management](#context-management)
5. [Styling Patterns](#styling-patterns)
6. [Form Handling](#form-handling)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)
9. [Utility Functions](#utility-functions)
10. [Page Structure](#page-structure)

---

## Component Patterns

### Basic Reusable Component

```tsx
// src/components/Card.tsx
import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, children, className = '' }: CardProps) => (
  <div className={`p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
    {title && (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h3>
    )}
    {children}
  </div>
);

export default Card;
```

### Component with Event Handler

```tsx
// src/components/Button.tsx
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-sm transition-all active:scale-95 disabled:opacity-70';
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className || ''}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
```

### List Component with Loading & Empty States

```tsx
// src/components/DataList.tsx
import type { ReactNode } from 'react';
import Loader from './Loader';
import TableNoRecord from './TableNoRecord';

interface DataListProps<T> {
  data: T[];
  isLoading: boolean;
  error?: string;
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
}

export const DataList = <T extends { id?: number }>({
  data,
  isLoading,
  error,
  renderItem,
  emptyMessage = 'No data available',
}: DataListProps<T>) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <TableNoRecord>{emptyMessage}</TableNoRecord>;
  }

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={item.id || index}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
};

export default DataList;
```

---

## Type Definitions

### Product Type System

```typescript
// src/types/product.ts

// Core Product Interface
export interface IProduct {
  id: number;
  code: string;
  sku: string;
  barcode: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  stock: number;
  reorderLevel: number;
  unit: string;
  isActive: boolean;
}

// Form Data (without auto-generated fields)
export interface IProductFormData extends Omit<IProduct, 'id'> {}

// Filter/Search Criteria
export interface IProductFilter {
  code?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

// API Request/Response
export interface IProductCreateRequest extends Omit<IProduct, 'id'> {}

export interface IProductUpdateRequest extends IProductCreateRequest {}

// Related Entities
export interface IProductAttribute {
  id: number;
  productId: number;
  attributeId: number;
  value: string;
}

export interface IProductImage {
  id: number;
  productId: number;
  title: string;
  description: string;
  url: string;
}
```

### Generic Response Type

```typescript
// src/types/serviceResponse.ts

export interface ServiceResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

// Paginated Response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type PaginatedServiceResponse<T> = ServiceResponse<PaginatedResponse<T>>;
```

---

## API Integration

### Complete API Class Example

```typescript
// src/api/productApi.ts

import type { ServiceResponse, PaginatedServiceResponse } from '@/types/serviceResponse';
import type { IProduct, IProductFilter } from '@/types/product';
import db from '@/libs/db/appDb';

export class productApi {
  /**
   * Get single product by ID
   */
  static async get(id: number): Promise<IProduct | undefined> {
    try {
      return await db.products.get(id);
    } catch (error) {
      console.error(`Failed to get product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new product
   */
  static async post(payload: Omit<IProduct, 'id'>): Promise<ServiceResponse<number>> {
    try {
      const id = await db.products.add(payload as IProduct);
      return {
        status: 201,
        success: true,
        message: 'Product created successfully',
        data: id,
      };
    } catch (error) {
      console.error('Failed to create product:', error);
      return {
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create product',
        data: 0,
      };
    }
  }

  /**
   * Update existing product
   */
  static async put(id: number, payload: Partial<IProduct>): Promise<ServiceResponse<void>> {
    try {
      await db.products.update(id, payload as IProduct);
      return {
        status: 200,
        success: true,
        message: 'Product updated successfully',
        data: undefined,
      };
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      return {
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update product',
        data: undefined,
      };
    }
  }

  /**
   * Delete product
   */
  static async delete(id: number): Promise<ServiceResponse<void>> {
    try {
      await db.products.delete(id);
      return {
        status: 200,
        success: true,
        message: 'Product deleted successfully',
        data: undefined,
      };
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      return {
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete product',
        data: undefined,
      };
    }
  }

  /**
   * Get all products
   */
  static async getAll(): Promise<ServiceResponse<IProduct[]>> {
    try {
      const products = await db.products.toArray();
      return {
        status: 200,
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      console.error('Failed to get all products:', error);
      return {
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve products',
        data: [],
      };
    }
  }

  /**
   * Search products with filtering and pagination
   */
  static async search(
    filter: IProductFilter,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedServiceResponse<IProduct>> {
    try {
      let query = db.products.toCollection();

      // Apply filters
      if (filter.code) {
        query = query.filter(p => p.code.includes(filter.code!));
      }
      if (filter.name) {
        query = query.filter(p => p.name.toLowerCase().includes(filter.name!.toLowerCase()));
      }
      if (filter.minPrice !== undefined) {
        query = query.filter(p => p.sellingPrice >= filter.minPrice!);
      }
      if (filter.maxPrice !== undefined) {
        query = query.filter(p => p.sellingPrice <= filter.maxPrice!);
      }
      if (filter.isActive !== undefined) {
        query = query.filter(p => p.isActive === filter.isActive);
      }

      // Get total count
      const total = await query.count();

      // Apply pagination
      const offset = (page - 1) * pageSize;
      const items = await query.offset(offset).limit(pageSize).toArray();
      const totalPages = Math.ceil(total / pageSize);

      return {
        status: 200,
        success: true,
        message: 'Search completed successfully',
        data: {
          items,
          total,
          page,
          pageSize,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Search failed:', error);
      return {
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Search failed',
        data: {
          items: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        },
      };
    }
  }
}
```

---

## Context Management

### Authentication Context Setup

```typescript
// src/contexts/authorize/type.ts

export interface authUser {
  guid: string;
  displayName: string;
  username: string;
  roles: string[];
  refreshToken: string;
}

export interface AuthInfo {
  isAuthorized: boolean;
  authUser: authUser | null;
  lastUpdated: Date | null;
}

export interface AuthProviderState {
  info: AuthInfo;
  setInfo: (info: AuthInfo) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
```

```typescript
// src/contexts/authorize/const.ts

import type { AuthInfo } from './type';

const defaultSession: AuthInfo = {
  isAuthorized: false,
  authUser: null,
  lastUpdated: null,
};

export default defaultSession;
```

```tsx
// src/contexts/authorize/AuthProvider.tsx

import { useEffect, useState } from 'react';
import type { AuthInfo, AuthProviderProps } from './type';
import { AuthProviderContext } from './AuthProviderContext';
import { applicationStorage, StorageKeys } from '@/utils';
import defaultSession from './const';

export function AuthProvider({ children }: AuthProviderProps) {
  const [info, setInfo] = useState<AuthInfo>(() => {
    const storage = new applicationStorage(StorageKeys.USER);
    const storedInfo = storage.get() as AuthInfo | null;
    return storedInfo || defaultSession;
  });

  useEffect(() => {
    const storage = new applicationStorage(StorageKeys.USER);
    storage.set(info);
  }, [info]);

  const value = {
    info,
    setInfo,
    logout: () => {
      setInfo(defaultSession);
      const storage = new applicationStorage(StorageKeys.USER);
      storage.clear();
    },
  };

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}
```

```typescript
// src/contexts/authorize/useAuth.ts

import { useContext } from 'react';
import { AuthProviderContext } from './AuthProviderContext';

export function useAuth() {
  const context = useContext(AuthProviderContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Styling Patterns

### Responsive Grid Layout

```tsx
// src/components/ProductGrid.tsx

import type { IProduct } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: IProduct[];
  onSelect?: (product: IProduct) => void;
}

export const ProductGrid = ({ products, onSelect }: ProductGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {products.map(product => (
      <div key={product.id} onClick={() => onSelect?.(product)}>
        <ProductCard product={product} />
      </div>
    ))}
  </div>
);
```

### Responsive Navigation Header

```tsx
// src/components/ResponsiveHeader.tsx

import { useState } from 'react';

export const ResponsiveHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center p-4 lg:p-6">
        {/* Logo */}
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          POS Universe
        </h1>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Menu
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8">
          <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Home
          </a>
          <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
            Dashboard
          </a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-700">
          <a href="/" className="text-gray-700 dark:text-gray-300">Home</a>
          <a href="/dashboard" className="text-gray-700 dark:text-gray-300">Dashboard</a>
        </nav>
      )}
    </header>
  );
};

export default ResponsiveHeader;
```

### Theme-Aware Styling

```tsx
// src/components/ThemedCard.tsx

interface ThemedCardProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export const ThemedCard = ({ children, variant = 'info' }: ThemedCardProps) => {
  const variantStyles = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
  };

  return (
    <div className={`p-4 border rounded-lg ${variantStyles[variant]}`}>
      {children}
    </div>
  );
};
```

---

## Form Handling

### Complete Product Form

```tsx
// src/pages/products/ProductForm.tsx

import { useState } from 'react';
import type { IProduct } from '@/types/product';
import { productApi } from '@/api/productApi';

interface ProductFormProps {
  initialProduct?: IProduct;
  onSuccess?: (product: IProduct) => void;
}

const defaultProduct: Omit<IProduct, 'id'> = {
  code: '',
  sku: '',
  barcode: '',
  name: '',
  costPrice: 0,
  sellingPrice: 0,
  taxRate: 0.1,
  stock: 0,
  reorderLevel: 10,
  unit: 'pcs',
  isActive: true,
};

export const ProductForm = ({ initialProduct, onSuccess }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<IProduct, 'id'> | IProduct>(
    initialProduct || defaultProduct
  );
  const [errors, setErrors] = useState<Partial<Record<keyof IProduct, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field: keyof typeof formData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const isUpdate = 'id' in formData;
      
      if (isUpdate) {
        const response = await productApi.put(formData.id, formData);
        if (response.success) {
          setSuccessMessage('Product updated successfully');
          onSuccess?.(formData as IProduct);
        }
      } else {
        const response = await productApi.post(formData as Omit<IProduct, 'id'>);
        if (response.success) {
          setSuccessMessage('Product created successfully');
          setFormData(defaultProduct);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ name: 'Failed to save product. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-400">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Code */}
        <div>
          <label className="input-label-style">Product Code</label>
          <input
            type="text"
            value={formData.code}
            onChange={e => handleChange('code', e.target.value)}
            className={`input-style ${errors.code ? 'border-red-500' : ''}`}
            placeholder="e.g., PROD-001"
          />
          {errors.code && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.code}</p>}
        </div>

        {/* SKU */}
        <div>
          <label className="input-label-style">SKU</label>
          <input
            type="text"
            value={formData.sku}
            onChange={e => handleChange('sku', e.target.value)}
            className="input-style"
            placeholder="e.g., XPO-MX3S-BLK"
          />
        </div>

        {/* Name */}
        <div className="md:col-span-2">
          <label className="input-label-style">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className={`input-style ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Product name"
          />
          {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Selling Price */}
        <div>
          <label className="input-label-style">Selling Price</label>
          <input
            type="number"
            value={formData.sellingPrice}
            onChange={e => handleChange('sellingPrice', parseFloat(e.target.value))}
            className={`input-style ${errors.sellingPrice ? 'border-red-500' : ''}`}
            step="0.01"
            min="0"
          />
          {errors.sellingPrice && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.sellingPrice}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="input-label-style">Stock</label>
          <input
            type="number"
            value={formData.stock}
            onChange={e => handleChange('stock', parseInt(e.target.value, 10))}
            className={`input-style ${errors.stock ? 'border-red-500' : ''}`}
            min="0"
          />
          {errors.stock && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.stock}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  );
};

export default ProductForm;
```

### React 19 Form Action Pattern

React 19 simplifies form handling using `useActionState` and server actions:

```tsx
// src/pages/products/ProductFormAction.tsx
'use client'; // Mark as client component

import { useActionState } from 'react';
import type { IProduct } from '@/types/product';
import { productApi } from '@/api/productApi';

// Action function (can be imported from server)
async function submitProduct(
  prevState: { success?: boolean; error?: string; message?: string } | null,
  formData: FormData
) {
  try {
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const price = parseFloat(formData.get('price') as string);

    // Validate
    if (!name.trim()) {
      return { success: false, error: 'Product name is required' };
    }
    if (!code.trim()) {
      return { success: false, error: 'Product code is required' };
    }
    if (price <= 0) {
      return { success: false, error: 'Price must be greater than 0' };
    }

    // Submit to API
    const response = await productApi.post({
      name,
      code,
      sellingPrice: price,
      costPrice: 0,
      taxRate: 0.1,
      stock: 0,
      reorderLevel: 10,
      unit: 'pcs',
      isActive: true,
      sku: '',
      barcode: '',
    });

    if (response.success) {
      return { success: true, message: 'Product created successfully' };
    }
    return { success: false, error: response.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Component using form action
export const ProductFormAction = () => {
  const [state, formAction, isPending] = useActionState(submitProduct, null);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      {/* Error Message */}
      {state?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">{state.error}</p>
        </div>
      )}

      {/* Success Message */}
      {state?.success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-400">{state.message}</p>
        </div>
      )}

      {/* Product Code */}
      <div>
        <label htmlFor="code" className="input-label-style">
          Product Code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          required
          disabled={isPending}
          className="input-style"
          placeholder="PROD-001"
        />
      </div>

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="input-label-style">
          Product Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={isPending}
          className="input-style"
          placeholder="Enter product name"
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="input-label-style">
          Selling Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          disabled={isPending}
          className="input-style"
          placeholder="0.00"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? 'Submitting...' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductFormAction;
```

**Benefits of Form Actions:**
- ✅ Cleaner code without `useState` for form data
- ✅ Automatic form reset after successful submission
- ✅ Built-in `isPending` state for loading UI
- ✅ Error state directly from action function
- ✅ No need for separate error state management
- ✅ Type-safe with FormData validation

---

## State Management

### useState with Complex State

```tsx
// Example: Table with sorting, filtering, and pagination

import { useState } from 'react';
import type { IProduct } from '@/types/product';

interface TableState {
  sortBy: keyof IProduct;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
  searchQuery: string;
}

export const ProductTable = ({ products }: { products: IProduct[] }) => {
  const [state, setState] = useState<TableState>({
    sortBy: 'name',
    sortOrder: 'asc',
    currentPage: 1,
    pageSize: 20,
    searchQuery: '',
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[state.sortBy];
    const bValue = b[state.sortBy];

    if (typeof aValue === 'string') {
      return state.sortOrder === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }

    return state.sortOrder === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const paginatedProducts = sortedProducts.slice(
    (state.currentPage - 1) * state.pageSize,
    state.currentPage * state.pageSize
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={state.searchQuery}
        onChange={e => setState(prev => ({ ...prev, searchQuery: e.target.value, currentPage: 1 }))}
        className="input-style"
      />

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th
              className="p-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() =>
                setState(prev => ({
                  ...prev,
                  sortBy: 'name',
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
                }))
              }
            >
              Name
            </th>
            <th className="p-2 text-right">Price</th>
            <th className="p-2 text-right">Stock</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map(product => (
            <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-2">{product.name}</td>
              <td className="p-2 text-right">${product.sellingPrice}</td>
              <td className="p-2 text-right">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: Math.ceil(sortedProducts.length / state.pageSize) }, (_, i) => (
          <button
            key={i}
            onClick={() => setState(prev => ({ ...prev, currentPage: i + 1 }))}
            className={`px-3 py-1 rounded ${
              state.currentPage === i + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
```

---

## Error Handling

### Error Boundary Component

```tsx
// src/components/ErrorBoundary.tsx

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, () => this.setState({ hasError: false })) || (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {this.state.error.message}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Try-Catch with Proper Typing

```typescript
// Async operation with error handling

async function fetchAndProcessData(id: number): Promise<IProduct | null> {
  try {
    const response = await productApi.get(id);
    
    if (!response) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    return null;
  }
}
```

---

## Utility Functions

### Date Utilities

```typescript
// src/utils/helper/dateUtils.ts

import type { Temporal } from '@js-temporal/polyfill';

/**
 * Format date to ISO YYYY-MM-DD format
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date for display
 */
export function formatDateForDisplay(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;

  return formatDateForDisplay(d);
}
```

### String Utilities

```typescript
// src/utils/helper/stringFormat.ts

/**
 * Capitalize first letter of string
 */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number = 50): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generate slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}
```

### Number Utilities

```typescript
// src/utils/helper/numberUtils.ts

/**
 * Format number as currency
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals })
}

/**
 * Calculate percentage change
 */
export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
```

---

## Page Structure

### Complete Product List Page

```tsx
// src/pages/products/ProductList.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { IProduct } from '@/types/product';
import { productApi } from '@/api/productApi';
import Header from '@/components/Header';
import Button from '@/components/Button';
import DataList from '@/components/DataList';
import ProductTableRow from './ProductTableRow';

export const ProductList = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    const response = await productApi.getAll();
    if (response.success) {
      setProducts(response.data);
    } else {
      setError(response.message);
    }
    
    setIsLoading(false);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const response = await productApi.delete(id);
    if (response.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header label="Products" />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Search & Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="input-label-style">Search Products</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-style"
              placeholder="Search by name or code..."
            />
          </div>
          <Link to="view">
            <Button>New Product</Button>
          </Link>
        </div>

        {/* Data List */}
        <DataList
          data={filteredProducts}
          isLoading={isLoading}
          error={error || undefined}
          emptyMessage="No products found"
          renderItem={(product) => (
            <ProductTableRow
              product={product}
              onDelete={() => handleDelete(product.id)}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProductList;
```

---

## Quick Reference Commands

### Create New Component

```bash
# Component file
src/components/MyComponent.tsx

# With Props interface
interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}
```

### Create New Page

```bash
src/pages/feature/FeatureName.tsx
src/pages/feature/FeatureForm.tsx
src/pages/feature/FeatureTable.tsx
```

### Create New Type

```bash
src/types/featureName.ts
```

### Create New API Class

```bash
src/api/featureNameApi.ts
```

---

## Development Checklist

Before committing code:

- [ ] No `console.log()` statements in production code
- [ ] All types are properly defined
- [ ] Components have proper TypeScript interfaces
- [ ] Dark mode classes are applied (`dark:` prefix)
- [ ] Responsive design is tested (mobile, tablet, desktop)
- [ ] Error states are handled
- [ ] Loading states are shown
- [ ] API responses use `ServiceResponse` type
- [ ] No external CSS files (Tailwind only)
- [ ] No unused imports
- [ ] Components follow naming conventions
- [ ] Error messages are user-friendly

---

