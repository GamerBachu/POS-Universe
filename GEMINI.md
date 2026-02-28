# Copilot Instructions for POS Universe

**POS Universe** is an offline-first Point of Sale web system using React 19, TypeScript, Tailwind CSS 4.1, and Dexie.js (IndexedDB).
POS Universe is a modern Point of Sale (POS) web system designed to work seamlessly on various devices, including desktops, tablets, and mobile phones.

## Critical Architecture

### Data Storage: Dexie.js (IndexedDB) First
- All data persists to IndexedDB via `db` (imported from `src/libs/db/appDb`)
- API layer (`src/api/*.ts`) uses static methods for Dexie operations
- **Example:** `productApi.post()` → adds to `db.products` collection
- No remote API calls; offline-first by design
- See: [productApi.ts](src/api/productApi.ts) for pattern

### Class-Based API Static Methods
```typescript
export class productApi {
  static async get(id: number) { return db.products.get(id); }
  static async post(payload: Partial<IProduct>) { return db.products.add(payload as IProduct); }
  static async search(...): Promise<ServiceResponse<...>> { /* returns { status, success, message, data } */ }
}
```

### Component Patterns (Real Implementation)
**Form Pattern:** Use state + onSubmit, not `useActionState`
```tsx
const [data, setData] = useState<IProduct>(initialData);
<form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
  <Input defaultValue={data.name} onChange={e => setData({...data, name: e.target.value})} />
</form>
```

## Styling & Layout

## Context & State

### Auth Context Pattern
Path: `src/contexts/authorize/` with files: `AuthProvider.tsx`, `AuthProviderContext.tsx`, `useAuth.ts`, `type.ts`, `const.ts`
- Stores auth info + token in storage (applicationStorage)
- Use `useAuth()` hook to access

### Storage Keys
Import from `@/utils`: `StorageKeys.USER`, `StorageKeys.TOKEN`, `StorageKeys.THEME`
Use applicationStorage wrapper: `new applicationStorage(StorageKeys.USER).set(value)`

## Routing & Page Structure

### Route Protection
- ProtectedRoute: Wraps authenticated pages, redirects to login if not authorized
- PublicRoute: For login/register, redirects home if already authenticated
- See: [routes/index.tsx](src/routes/index.tsx)

### Page Organization
Feature-based subdirs: `src/pages/products/`, `src/pages/masterAttribute/`, `src/pages/systemLog/`, `src/pages/user/`
Each feature has list/form/view components; import types from `@/types/`

## Types & Conventions

### Type Files Location
`src/types/`: `product.ts`, `user.ts`, `serviceResponse.ts`, `actionState.ts`, `menuItem.ts`, `systemLog.ts`, `masters.ts`
- Interfaces for objects (prefixed `I`), types for unions
- All API responses return `ServiceResponse<T>` with `{ status, success, message, data }`

### Naming
- Files: PascalCase (components), camelCase (utils/api)
- Interfaces: `I` prefix (e.g., `IProduct`)
- Hooks: `use` prefix (e.g., `useAuth`)
- Constants: UPPER_SNAKE_CASE
- Prop interfaces: `Props` suffix (e.g., `ProductFormProps`)

## Development Workflow

### Commands
- `npm run dev` — Start dev server (port 3690)
- `npm run build` — Build with TypeScript checking + minify
- `npm run lint` — Check ESLint
- `npm run preview` — Serve production build

---

## 2. Project Structure Guidelines

Adhere to the feature-based organization inside the `src` directory:

```
src/
├── api/                    # API/Database call logic (Class-based with static methods)
├── assets/                 # Static assets (images, icons, etc.)
├── components/             # Shared, reusable UI components (Pure, functional)
├── contexts/               # Global state management (React Context)
│   ├── authorize/          # Authentication context
│   └── theme/              # Theme context
├── layouts/                # Page structure components (Wrapper components)
├── libs/                   # External library configurations (db, configurations)
├── pages/                  # Page-level components (Feature-based subdirectories)
├── routes/                 # Routing configuration
├── styles/                 # Global styles (Tailwind directives)
├── types/                  # Global TypeScript type definitions
├── utils/                  # Utility functions and helpers
│   ├── helper/             # Helper functions (date, guid, string, number utils)
│   └── web/                # Web utilities (storage, session handlers)
└── locales/                # Locale/i18n translations (JSON files)
```

---

## 3. Code Quality Standards

### 3.1 Naming Conventions

**Files & Directories:**
- Components: PascalCase (e.g., `Header.tsx`, `ProductForm.tsx`)
- Functions/Utilities: camelCase (e.g., `dateUtils.ts`, `formatString.ts`)
- Types: PascalCase for interface/type names (e.g., `IProduct.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_PAGE_SIZE`)

**Code Identifiers:**
- Component props interfaces: Append `Props` (e.g., `HeaderProps`)
- Context types: Meaningful names (e.g., `AuthProviderState`, `ThemeContextType`)
- API classes: camelCase (e.g., `productApi`, `userApi`)
- Hooks: Prefix with `use` (e.g., `useAuth`, `useTheme`)

### 3.2 Clean Code Principles

**Do:**
- Write self-documenting code with clear variable names
- Keep functions small and single-responsibility
- Use TypeScript types to augment code documentation
- Extract reusable logic into utility functions
- Add JSDoc comments for complex functions

**Don't:**
- Use single-letter variable names (except for loop counters: `i`, `j`)
- Create deeply nested conditionals (max depth: 2-3 levels)
- Mutate state directly in React components
- Use `any` type (except in unavoidable situations)
- Create large monolithic files (max ~300 lines per file)

### 3.3 TypeScript Standards (Strict Mode)

**Always:**
- Define explicit types for function parameters and return values
- Export interfaces/types from `src/types/` directory
- Use `interface` for object shapes, `type` for unions/literals
- Implement proper object typing for API responses

**Example - Correct Type Definition:**
```typescript
// src/types/product.ts
export interface IProduct {
  id: number;
  code: string;
  name: string;
  sellingPrice: number;
  stock: number;
  isActive: boolean;
}

export interface ServiceResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}
```

**Example - Correct Function Typing:**
```typescript
// Function with explicit return type
function calculateTax(price: number, taxRate: number): number {
  return price * taxRate;
}

// API method with typed response
static async getProduct(id: number): Promise<ServiceResponse<IProduct>> {
  // Implementation
}
```

---

## 4. Styling with Tailwind CSS

### 4.1 Tailwind CSS Only

- Use **only** Tailwind CSS for styling (no inline styles or CSS modules)
- Leverage `@layer components` for reusable component classes in `globals.css`
- Never create separate CSS files for components
- Use Tailwind's color palette (avoid arbitrary colors)

### 4.2 Dark Mode Implementation

Dark mode is enabled via `darkMode: 'class'` strategy in `tailwind.config.js`.

**Root Element:**
```html
<!-- index.html -->
<div id="root" class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"></div>
```

**Dark Mode Prefix Usage:**
- Apply `dark:` prefix to all theme-dependent classes
- Always pair light and dark variants for readability

**Example - Styled Component:**
```typescript
export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-md">
    {children}
  </div>
);
```

**Common Pattern - Input Styling:**
```tsx
<input
  type="text"
  className="w-full px-4 py-2 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
/>
```

### 4.3 Responsive Layout

**Mobile-First Approach:**
- Design for mobile first, then enhance for larger screens
- Use Tailwind breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`

**Example - Responsive Grid:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

**Example - Responsive Flexbox:**
```tsx
<header className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 gap-2 md:gap-4">
  {/* Header content */}
</header>
```

**Responsive Padding/Margins:**
```tsx
<section className="p-2 sm:p-4 md:p-6 lg:p-8">
  {/* Section content */}
</section>
```

### 4.4 Predefined Component Classes

Located in `src/styles/globals.css`, use these for common patterns:



**Usage Example:**
```tsx
<label>Email Address</label>
<Input type="email" className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
<Button >Submit</Button>
```

---

## 5. Component Patterns

### 5.1 Functional Components with TypeScript

**Template:**
```tsx
import type { ReactNode } from 'react';

interface ComponentNameProps {
  title: string;
  onClick?: () => void;
  children?: ReactNode;
}

export const ComponentName = ({
  title,
  onClick,
  children,
}: ComponentNameProps) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {children && <div className="mt-4">{children}</div>}
      {onClick && (
        <Button
          onClick={onClick} 
        >
          Action
        </Button>
      )}
    </div>
  );
};

export default ComponentName;
```

### 5.2 Component Best Practices

- Keep components pure and free of side effects when possible
- Use custom hooks for stateful logic
- Prefer composition over prop drilling
- Export components as named exports, with default export for convenience
- Include proper TypeScript prop typing with `Props` suffix

---

## 6. Context & State Management

### 6.1 Context Structure

**Context files should follow this pattern:**

```
contexts/
├── featureName/
│   ├── FeatureProviderContext.tsx   # Context definition
│   ├── FeatureProvider.tsx          # Provider component
│   ├── type.ts                      # Type definitions
│   ├── useFeature.ts                # Custom hook
│   ├── const.ts                     # Constants/defaults
│   └── index.ts                     # Barrel export
```

**Example - ThemeProvider Context:**

`src/contexts/theme/type.ts`:
```typescript
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}
```

`src/contexts/theme/ThemeProvider.tsx`:
```tsx
import { useEffect, useState } from 'react';
import type { Theme, ThemeProviderProps } from './type';
import { ThemeProviderContext } from './ThemeProviderContext';
import { applicationStorage, StorageKeys } from '@/utils';

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storage = new applicationStorage(StorageKeys.THEME);
    return (storage.get() as Theme | null) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      const storage = new applicationStorage(StorageKeys.THEME);
      storage.set(newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
```

`src/contexts/theme/useTheme.ts`:
```typescript
import { useContext } from 'react';
import { ThemeProviderContext } from './ThemeProviderContext';

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## 7. API Layer Pattern

### 7.1 Class-Based API Structure

All API interactions are handled through static methods in class-based API modules.

**Example - Product API:**

```typescript
// src/api/productApi.ts
import type { ServiceResponse } from '@/types/serviceResponse';
import db from '../libs/db/appDb';
import type { IProduct } from '@/types/product';

export class productApi {
  /**
   * Get product by ID
   * @param id - Product ID
   * @returns Product object or undefined
   */
  static async get(id: number): Promise<IProduct | undefined> {
    return db.products.get(id);
  }

  /**
   * Create new product
   * @param payload - Product data
   * @returns Created product ID
   */
  static async post(payload: Partial<IProduct>): Promise<number> {
    return db.products.add(payload as IProduct);
  }

  /**
   * Update existing product
   * @param payload - Updated product data
   * @param id - Product ID
   * @returns Number of updated records
   */
  static async put(payload: Partial<IProduct>, id: number): Promise<number> {
    return db.products.update(id, payload as IProduct);
  }

  /**
   * Delete product (hard delete)
   * @param id - Product ID
   * @returns Number of deleted records
   */
  static async delete(id: number): Promise<number> {
    return db.products.delete(id);
  }

  /**
   * Get all products
   * @returns ServiceResponse with product array
   */
  static async getAll(): Promise<ServiceResponse<IProduct[]>> {
    const products = await db.products.toArray();
    return {
      status: 200,
      success: true,
      message: 'Get all products completed successfully',
      data: products,
    };
  }

  /**
   * Search products with filtering and pagination
   * @param queryModel - Filter criteria
   * @param page - Current page (1-indexed)
   * @param pageSize - Items per page
   * @returns ServiceResponse with paginated results
   */
  static async search(
    queryModel: Partial<IProduct>,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ServiceResponse<{ items: IProduct[]; total: number }>> {
    try {
      const currentPage = Math.max(1, page);
      // Implementation details...
      return {
        status: 200,
        success: true,
        message: 'Search completed successfully',
        data: { items: [], total: 0 },
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: 'Search failed',
        data: { items: [], total: 0 },
      };
    }
  }
}
```

### 7.2 Service Response Type

All API responses must follow the `ServiceResponse` type:

```typescript
// src/types/serviceResponse.ts
export interface ServiceResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}
```

---

## 8. Type Definitions

### 8.1 Organization

Keep all types in the `src/types/` directory organized by feature:

```
src/types/
├── product.ts           # Product-related types
├── user.ts              # User-related types
├── masters.ts           # Master data types
├── serviceResponse.ts   # API response type
├── actionState.ts       # Action state type
├── menuItem.ts          # Navigation item type
├── systemLog.ts         # System log type
```

### 8.2 Type Definition Standards

**Use Interfaces for Objects:**
```typescript
export interface IProduct {
  id: number;
  code: string;
  name: string;
  sellingPrice: number;
  stock: number;
  isActive: boolean;
}
```

**Use Types for Unions & Literals:**
```typescript
export type Theme = 'light' | 'dark' | 'system';

export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';
```

**Extend Types as Needed:**
```typescript
export interface IProductForm extends Omit<IProduct, 'id'> {
  imageFile?: File;
}
```

---

## 9. Utility Functions

### 9.1 Organization

Place utilities in `src/utils/` with appropriate subdirectories:

```
src/utils/
├── index.ts                 # Barrel exports
├── keys.ts                  # Storage keys constants
├── logger.ts                # Logging utility
├── helper/
│   ├── dateUtils.ts         # Date manipulation
│   ├── guid.ts              # GUID generation
│   ├── numberUtils.ts       # Number operations
│   └── stringFormat.ts      # String formatting
└── web/
    ├── applicationStorage.ts # LocalStorage wrapper
    └── sessionStorage.ts     # SessionStorage wrapper
```

### 9.2 Utility Function Template

```typescript
/**
 * Formats a date to ISO string format
 * @param date - The date to format
 * @returns ISO formatted date string
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Validates email format
 * @param email - Email to validate
 * @returns true if valid email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

---

## 10. Routing Pattern

### 10.1 Route Configuration

Routes are defined in `src/routes/index.tsx` using React Router v7:

```tsx
import { createBrowserRouter, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'dashboard', element: <Dashboard /> },
        ],
      },
      {
        element: <PublicRoute />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ],
      },
    ],
  },
]);
```

### 10.2 Protected vs Public Routes

- **ProtectedRoute:** Requires authentication; redirects to login if not authenticated
- **PublicRoute:** Accessible without authentication; redirects to home if already authenticated

---

## 11. Form & Input Patterns

### 11.1 Input Component Example

```tsx
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, id, ...props }: InputProps) => (
  <div>
    {label && <label htmlFor={id}>{label}</label>}
    <input
      id={id}
      {...props}
      className={`w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none ${error ? 'border-red-500 dark:border-red-500' : ''}`}
    />
    {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
  </div>
);
```

### 11.2 Form Component Pattern

```tsx
import { useState } from 'react';
import type { IProduct } from '@/types/product';

interface ProductFormProps {
  initialProduct?: IProduct;
  onSubmit: (product: IProduct) => Promise<void>;
}

export const ProductForm = ({ initialProduct, onSubmit }: ProductFormProps) => {
  const [data, setData] = useState<IProduct>(initialProduct || getDefaultProduct());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<IProduct>>({});

  const handleChange = (field: keyof IProduct, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};
```

---

## 12. Error Handling

### 12.1 Try-Catch Pattern

```typescript
static async search(query: string): Promise<ServiceResponse<unknown[]>> {
  try {
    const results = await db.products.where('name').contains(query).toArray();
    return {
      status: 200,
      success: true,
      message: 'Search completed',
      data: results,
    };
  } catch (error) {
    console.error('Search failed:', error);
    return {
      status: 500,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    };
  }
}
```

### 12.2 Component Error Boundaries

Use error boundaries for components that might fail:

```tsx
export const SafeComponent = ({ component: Component }: { component: React.ComponentType }) => {
  try {
    return <Component />;
  } catch (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-700 dark:text-red-400">
          Error loading component: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }
};
```

---

## 13. Performance & Best Practices

### 13.1 React Best Practices

- Use `React.memo()` for components that receive same props
- Implement proper dependency arrays in `useEffect`
- Use `useCallback` for event handlers passed to child components
- Lazy load components using `React.lazy()` and `Suspense`

### 13.2 TypeScript Best Practices

- Use strict null checks to prevent null reference errors
- Avoid using `any` type; use `unknown` with type narrowing instead
- Export types from separate type files for reusability
- Use exhaustive checking with discriminated unions

### 13.3 Tailwind CSS Best Practices

- Group related classes using logical grouping
- Use `dark:` prefix consistently across all theme-dependent styles
- Apply responsive prefixes from `sm:` (640px) upwards for mobile-first design
- Keep class lists readable; break long class strings into multiple lines

---

## 14. File Structure Example

### Component with Associated Files

```
src/components/ProductCard/
├── ProductCard.tsx          # Component file
├── ProductCard.stories.tsx  # Storybook stories (optional)
└── index.ts                 # Barrel export
```

### Page with Sub-components

```
src/pages/products/
├── ProductList.tsx          # Main page component
├── ProductTable.tsx         # Sub-component
├── ProductTableRow.tsx      # Sub-component
├── ProductForm.tsx          # Form component
└── index.ts                 # Barrel export
```

---

## 15. Documentation & Comments

### 15.1 JSDoc Comments

Add JSDoc comments for complex functions:

```typescript
/**
 * Calculates the total price with tax
 * @param basePrice - The base price without tax
 * @param taxRate - Tax rate as decimal (e.g., 0.10 for 10%)
 * @returns Total price including tax
 * @example
 * const total = calculateTotalWithTax(100, 0.10);
 * // Returns 110
 */
export function calculateTotalWithTax(basePrice: number, taxRate: number): number {
  return basePrice * (1 + taxRate);
}
```

### 15.2 Inline Comments

Use sparingly for explaining "why", not "what":

```typescript
// Bad: Explains what the code does
// Increment i by 1
i++;

// Good: Explains the purpose
// Skip header row in CSV import
i++;
```

---

## 16. Testing Standards (When Applicable)

- Write tests for utility functions
- Test context providers in isolation
- Test components with different prop combinations
- Use TypeScript for type safety in tests

---

## 17. Accessibility (a11y)

### 17.1 HTML Semantics

```tsx
// Good
<form onSubmit={handleSubmit}>
  <label htmlFor="email">Email</label>
  <Input id="email" type="email" />
  <button type="submit">Submit</button>
</form>

// Avoid
<div onClick={handleSubmit}>
  <div>Email</div>
  <div>Input</div>
</div>
```

### 17.2 ARIA Labels

```tsx
<button
  aria-label="Close menu"
  onClick={handleClose}
  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
>
  ✕
</button>
```

---

## 18. Version Control & Commits

- Create meaningful commit messages
- Use descriptive branch names: `feature/description`, `fix/description`
- Keep commits focused on single concerns
- Reference issue numbers when applicable

---

## 19. Summary Checklist

When writing code for POS Universe, ensure:

- [ ] Code is in TypeScript with strict typing
- [ ] All components have proper TypeScript interfaces
- [ ] Tailwind CSS is used exclusively for styling
- [ ] Dark mode is supported with `dark:` prefix on all theme-dependent classes
- [ ] Responsive design is implemented (mobile-first approach)
- [ ] Component follows established project patterns
- [ ] Types are exported from `src/types/` directory
- [ ] API calls use class-based static methods returning `ServiceResponse`
- [ ] Context is properly typed with dedicated type files
- [ ] No inline styles or external CSS files are used
- [ ] Utility functions are placed in `src/utils/` with proper organization
- [ ] Components are modular and reusable
- [ ] Comments explain "why", not "what"
- [ ] Error handling is implemented with proper error messages
- [ ] Features are accessible (semantic HTML, ARIA labels)

---

## 20. Quick Reference

### Import Alias
Use path alias `@/` for absolute imports:
```typescript
import { useAuth } from '@/contexts/authorize';
import type { IProduct } from '@/types/product';
import { productApi } from '@/api/productApi';
```

### Storage Keys
Always use predefined keys from `@/utils/keys.ts`:
```typescript
const storage = new applicationStorage(StorageKeys.USER);
```

### Context Usage
Always check if context is available:
```typescript
const useFeature = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeature must be used within FeatureProvider');
  }
  return context;
};
```

---

## Questions & Updates

For questions or updates to these guidelines, refer to the project's `README.md` and `GEMINI.md` documentation.

