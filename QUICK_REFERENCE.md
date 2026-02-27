# POS Universe - Developer Quick Reference

A quick lookup guide for common development tasks and patterns in the POS Universe project.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [TypeScript Cheat Sheet](#typescript-cheat-sheet)
3. [React 19 Features](#react-19-features)
4. [Component Templates](#component-templates)
5. [Tailwind CSS Quick Tips](#tailwind-css-quick-tips)
6. [Common Code Snippets](#common-code-snippets)
7. [File Paths & Imports](#file-paths--imports)
8. [Debugging Tips](#debugging-tips)
9. [Performance Tips](#performance-tips)

---

## Project Setup

### Initial Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev    # Runs on http://localhost:5173

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Project Structure Quick Reference
```
src/
├── api/              # API call classes (static methods)
├── components/       # Reusable UI components
├── contexts/         # Global state management
├── layouts/          # Page wrapper components
├── pages/            # Feature pages (subdirectories per feature)
├── routes/           # React Router configuration
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
├── styles/           # Global CSS (Tailwind directives)
└── locales/          # i18n translation files
```

---

## TypeScript Cheat Sheet

### Basic Types
```typescript
// Primitives
const str: string = "hello";
const num: number = 42;
const bool: boolean = true;
const nul: null = null;
const undef: undefined = undefined;

// Arrays
const arr: number[] = [1, 2, 3];
const arr2: Array<string> = ["a", "b"];

// Union types
type Status = 'pending' | 'completed' | 'failed';
const status: Status = 'pending';

// Object types
interface User {
  id: number;
  name: string;
  email?: string;  // optional
  role: 'admin' | 'user';
}

// Function signature
type Callback = (id: number) => Promise<void>;
function handleClick(fn: Callback): void { }

// Generics
interface Response<T> {
  data: T;
  status: number;
}

const response: Response<User> = { 
  data: { id: 1, name: 'John', role: 'admin' },
  status: 200
};
```

### React + TypeScript
```typescript
// Component props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

// React.FC with children
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => (
  <div>{title}{children}</div>
);

// useState with type
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// useCallback signature
const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
}, []);

// useEffect return type
useEffect((): void => {
  // No return needed, or return cleanup function
  return () => { /* cleanup */ };
}, [dependencies]);
```

### Common Patterns
```typescript
// Type narrowing
if (typeof value === 'string') {
  // value is string here
}

if (value instanceof Error) {
  // value is Error here
}

// Optional chaining
const name = user?.profile?.name;

// Nullish coalescing
const value = data ?? defaultValue;

// Exhaustive checking (with discriminated union)
type Action = { type: 'ADD'; payload: number } | { type: 'DELETE'; id: string };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'ADD': return state + action.payload;
    case 'DELETE': return 0;
    // TypeScript error if case missing
  }
}
```

---

## React 19 Features

### Form Actions with `useActionState`

React 19 introduces improved form handling through server actions and `useActionState`:

```typescript
// Step 1: Define action function
async function submitForm(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Validate
  if (!name.trim()) {
    return { error: 'Name is required', success: false };
  }

  // Submit
  try {
    const result = await api.post({ name, email });
    return { success: true, message: 'Saved successfully', data: result };
  } catch (error) {
    return { error: error.message, success: false };
  }
}

// Step 2: Use in component
export const MyForm = () => {
  const [state, formAction, isPending] = useActionState(submitForm, {
    success: false,
    error: null,
  });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <div className="status-error">{state.error}</div>}
      {state.success && <div className="status-success">{state.message}</div>}

      <input
        name="name"
        type="text"
        required
        className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none"
        disabled={isPending}
      />
      
      <input
        name="email"
        type="email"
        required
        className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none"
        disabled={isPending}
      />

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

### Key React 19 Benefits
- ✅ **No useState for forms**: Use FormData directly
- ✅ **Built-in pending state**: `isPending` tracks submission
- ✅ **Auto-reset forms**: Automatically resets after successful submission
- ✅ **Type-safe FormData**: Use as string parsing for TypeScript safety
- ✅ **Better error handling**: Error state from action function

### FormData Helper Pattern
```typescript
// Helper to safely get FormData values with TypeScript
function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== 'string') {
    throw new Error(`Invalid form data: ${key}`);
  }
  return value;
}

// Usage in action
async function submitForm(prevState: unknown, formData: FormData) {
  try {
    const name = getFormValue(formData, 'name');
    const email = getFormValue(formData, 'email');
    // Process...
  } catch (err) {
    return { error: err.message, success: false };
  }
}
```

---

## Component Templates

### Simple Presentational Component
```tsx
import type { ReactNode } from 'react';

interface BadgeProps {
  label: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  children?: ReactNode;
}

export const Badge = ({
  label,
  variant = 'info',
  children,
}: BadgeProps) => {
  const styles = {
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${styles[variant]}`}>
      {label}
      {children}
    </span>
  );
};

export default Badge;
```

### Component with State & Effects
```tsx
import { useEffect, useState } from 'react';
import type { IProduct } from '@/types/product';
import { productApi } from '@/api/productApi';

interface ProductViewProps {
  productId: number;
}

export const ProductView = ({ productId }: ProductViewProps) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await productApi.get(productId);
      if (data) {
        setProduct(data);
      } else {
        setError('Product not found');
      }
      setIsLoading(false);
    };
    fetch();
  }, [productId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;
  if (!product) return <div>Not found</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {product.name}
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        ${product.sellingPrice}
      </p>
    </div>
  );
};

export default ProductView;
```

### Form Component
```tsx
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
}

interface FormProps {
  onSubmit: (data: FormData) => Promise<void>;
}

export const SimpleForm = ({ onSubmit }: FormProps) => {
  const [data, setData] = useState<FormData>({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setErrors({ name: 'Submission failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <input
          type="text"
          value={data.name}
          onChange={e => handleChange('name', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none"
          placeholder="Name"
        />
        {errors.name && <p className="text-red-600">{errors.name}</p>}
      </div>
      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

---

## Tailwind CSS Quick Tips

### Dark Mode
```tsx
// Always pair light and dark variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content
</div>

// Border
<div className="border border-gray-300 dark:border-gray-600">

// Hover states
<button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">

// Text colors
<p className="text-gray-600 dark:text-gray-400">
```

### Responsive Breakpoints
```tsx
// Mobile-first approach
<div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">

// Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Flex direction
<div className="flex flex-col md:flex-row gap-4">

// Padding
<div className="p-2 sm:p-4 md:p-6 lg:p-8">
```

### Common Component Classes
```tsx
// Input
<input className="w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />

// Label
<label className="input-label-style">Label</label>

// Button
<button className="btn-primary">Submit</button>

// Status badge
<div className="status-success">Success</div>
<div className="status-error">Error</div>

// Card
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
```

### Spacing Reference
```
p-1  = 0.25rem (4px)
p-2  = 0.5rem (8px)
p-4  = 1rem (16px)
p-6  = 1.5rem (24px)
p-8  = 2rem (32px)

Similar for m, gap, etc.
```

### Color Palette
```
gray-50, gray-100, gray-200, gray-300, gray-400, gray-500, ...
gray-900

indigo-500, indigo-600, indigo-700
red-600, green-600, blue-600, yellow-600
```

---

## Common Code Snippets

### API Call with Loading State
```tsx
const [data, setData] = useState<IProduct[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const load = async () => {
    const response = await productApi.getAll();
    if (response.success) {
      setData(response.data);
    } else {
      setError(response.message);
    }
    setIsLoading(false);
  };
  load();
}, []);
```

### Context Usage
```tsx
// In component
const { theme, setTheme } = useTheme();

// In hook (safe usage)
export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Array Operations (Immutable)
```typescript
// Add item
const newArray = [...array, newItem];

// Remove item
const newArray = array.filter(item => item.id !== targetId);

// Update item
const newArray = array.map(item => 
  item.id === targetId ? { ...item, ...updates } : item
);

// Toggle boolean
const newArray = array.map(item =>
  item.id === targetId ? { ...item, isActive: !item.isActive } : item
);
```

### Conditional Tailwind Classes
```tsx
<div className={`p-4 rounded ${isActive ? 'bg-blue-600' : 'bg-gray-200'} ${isFocused ? 'ring-2' : ''}`}>

// Better with ternary for many classes
<div className={isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}>

// Best practice
const buttonClass = isActive 
  ? 'bg-blue-600 hover:bg-blue-700 text-white'
  : 'bg-gray-200 hover:bg-gray-300 text-gray-900';

<button className={buttonClass}>
```

---

## File Paths & Imports

### Import Alias
```typescript
// Use @ alias instead of relative paths
import { useAuth } from '@/contexts/authorize';
import type { IProduct } from '@/types/product';
import { productApi } from '@/api/productApi';

// Instead of
// import { useAuth } from '../../../contexts/authorize';
```

### Barrel Exports
```typescript
// src/contexts/authorize/index.ts
export { AuthProvider } from './AuthProvider';
export { useAuth } from './useAuth';
export type { IAuthUser } from './type';

// Usage
import { useAuth, AuthProvider } from '@/contexts/authorize';
```

---

## Debugging Tips

### Console Logging (Remove Before Commit)
```typescript
console.log('Debug info:', { data, state });
console.error('Error:', error);
console.warn('Warning:', issue);
```

### React DevTools
1. Install React Developer Tools browser extension
2. Inspect components hierarchy
3. Check props and state
4. Profile performance

### TypeScript Errors
```bash
# Check TypeScript errors
npm run build

# Strict null checks help catch bugs early
```

### Network Debugging
1. Open DevTools Network tab
2. Check IndexedDB in Application tab for local data
3. Use Dexie.js debugging: `dexie.version`

---

## Performance Tips

### Memoization
```tsx
// Memoize component if props don't change often
import { memo } from 'react';

const ProductCard = memo(({ product }: { product: IProduct }) => (
  <div>{product.name}</div>
));

// useCallback for event handlers
const handleClick = useCallback(() => {
  // Function body
}, [dependencies]);

// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

### Lazy Loading
```tsx
import { lazy, Suspense } from 'react';

const ProductList = lazy(() => import('@/pages/products/ProductList'));

export const App = () => (
  <Suspense fallback={<Loader />}>
    <ProductList />
  </Suspense>
);
```

### Avoid Common Mistakes
```typescript
// ❌ Don't create new object/array on every render
<Component data={{nested: 'object'}} />

// ✅ Define outside component
const defaultData = { nested: 'object' };
const Component = ({ data = defaultData }) => { }

// ❌ Infinite loop with missing dependencies
useEffect(() => {
  setCount(count + 1);
}, []); // count missing from deps

// ✅ Correct
useEffect(() => {
  setCount(c => c + 1);
}, []);
```

---

## VS Code Extensions Recommended

- **ESLint** - Code linting
- **Tailwind CSS IntelliSense** - CSS class autocompletion
- **TypeScript Vue Plugin** - TypeScript support
- **Prettier** - Code formatter (optional)
- **Thunder Client** - API testing (optional)

---

## Storage Operations

### Using Application Storage
```typescript
import { applicationStorage, StorageKeys } from '@/utils';

// Save
const storage = new applicationStorage(StorageKeys.USER);
storage.set({ id: 1, name: 'John' });

// Retrieve
const data = storage.get();

// Clear
storage.clear();
```

---

## Common Issues & Solutions

### Issue: Component not updating
**Solution:** Check if you're mutating state directly
```typescript
// ❌ Wrong
state.property = newValue;

// ✅ Correct
setState({ ...state, property: newValue });
```

### Issue: useEffect running infinitely
**Solution:** Add correct dependencies
```typescript
// ❌ Wrong
useEffect(() => {
  setState(dependency);
}, []);

// ✅ Correct
useEffect(() => {
  setState(dependency);
}, [dependency]);
```

### Issue: Styling not applying
**Solution:** Ensure Tailwind classes are properly formatted
```tsx
// ❌ Wrong
className="text-lg" + "font-bold" // String concatenation

// ✅ Correct
className="text-lg font-bold" // Template literal or consistent spacing
```

### Issue: TypeScript errors
**Solution:** Check strict mode in tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true
  }
}
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/product-search

# Make changes and commit
git add .
git commit -m "feat: Add product search functionality"

# Push to remote
git push origin feature/product-search

# Create Pull Request on GitHub/GitLab
```

---

## Useful Resources

| Resource | Link |
|----------|------|
| React Docs | https://react.dev |
| TypeScript Docs | https://www.typescriptlang.org |
| Tailwind CSS | https://tailwindcss.com |
| React Router | https://reactrouter.com |
| Dexie.js | https://dexie.org |
| Vite | https://vitejs.dev |

---

## Document References

- 📖 **Full Guidelines**: [.copilot-instructions.md](.github/.copilot-instructions.md)
- 📚 **Code Examples & Patterns**: [PROJECT_PREPARATION.md](PROJECT_PREPARATION.md)
- 📋 **Development Standards**: [DEVELOPMENT_STANDARDS.md](DEVELOPMENT_STANDARDS.md)
- 📄 **Project Info**: [GEMINI.md](GEMINI.md)

---

**Last Updated:** February 21, 2026  
**Version:** 1.0

