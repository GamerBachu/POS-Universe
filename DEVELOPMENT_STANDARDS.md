# Development Standards & Pre-Commit Checklist

This document provides a comprehensive checklist for developers to ensure code quality and consistency before committing changes to the POS Universe repository.

---

## Quick Start Checklist

Before pushing code, verify:

### TypeScript & Types ✓
- [ ] All variables have explicit types
- [ ] No `any` type used (except where unavoidable)
- [ ] All functions have return type annotations
- [ ] All props interfaces properly defined with `Props` suffix
- [ ] Types exported from `src/types/` directory
- [ ] Interfaces used for objects, types for unions/literals

### Components ✓
- [ ] Component is functional and uses React hooks
- [ ] Props interface defined and exported
- [ ] Component exported as named export and default export
- [ ] Component file name matches PascalCase (e.g., `MyComponent.tsx`)
- [ ] Component has JSDoc comment for complex logic
- [ ] No inline styles (Tailwind CSS only)
- [ ] Dark mode support with `dark:` prefix on all theme-dependent classes
- [ ] Responsive design implemented (mobile-first)

### Styling ✓
- [ ] Only Tailwind CSS used for styling
- [ ] All color-related classes have `dark:` variant
- [ ] Breakpoint strategy: `sm:`, `md:`, `lg:`, `xl:`, `2xl:` used appropriately
- [ ] No hardcoded colors (use Tailwind palette)
- [ ] Component classes defined in `globals.css` @layer components
- [ ] Shadow, border, and spacing consistent across light/dark themes

### API & Data ✓
- [ ] API methods return `ServiceResponse<T>` type
- [ ] All API methods are static and class-based
- [ ] Error handling includes try-catch blocks
- [ ] HTTP status codes properly set in responses
- [ ] No direct API calls in components (use API classes)
- [ ] Dexie.js used for local storage operations

### State Management ✓
- [ ] React Context used for global state
- [ ] Context has dedicated type file (`type.ts`)
- [ ] Custom hook created for context consumption
- [ ] Context throw error if used outside provider
- [ ] State updates are immutable
- [ ] No state mutations in components

### Forms ✓
- [ ] Form validation implemented
- [ ] Error messages displayed clearly
- [ ] Loading state shown during submission
- [ ] Success feedback provided
- [ ] Form inputs use `w-full px-3 py-1.5 text-sm border rounded bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none` class



### React 19 Form Actions ✓
- [ ] Using `useActionState` for server-side form submissions
- [ ] FormData API used for form data collection
- [ ] Proper TypeScript typing for FormData values
- [ ] `isPending` state used for loading indicators
- [ ] Error state properly managed from action function
- [ ] Form auto-resets after successful submission
- [ ] Progressive enhancement maintained (forms work without JS)

### Error Handling ✓
- [ ] Try-catch blocks for async operations
- [ ] User-friendly error messages
- [ ] Console errors logged for debugging
- [ ] Error UI displayed appropriately
- [ ] Loading states prevent multiple submissions
- [ ] Network errors handled gracefully

### Accessibility ✓
- [ ] Semantic HTML used (`<form>`, `<button>`, `<header>`, etc.)
- [ ] `htmlFor` attribute on form labels
- [ ] `aria-label` on icon buttons
- [ ] Keyboard navigation supported
- [ ] Color contrast sufficient in dark/light modes
- [ ] Form fields have proper labels

### Code Quality ✓
- [ ] No `console.log()` in production code
- [ ] No commented-out code blocks
- [ ] No unnecessary dependencies
- [ ] No code duplication (DRY principle)
- [ ] Functions are small and single-responsibility
- [ ] Variable names are descriptive
- [ ] No single-letter variables (except `i`, `j` in loops)
- [ ] Maximum nesting depth: 2-3 levels

### Documentation ✓
- [ ] JSDoc comments for complex functions
- [ ] Comments explain "why", not "what"
- [ ] README updated if adding new features
- [ ] Type definitions adequately documented
- [ ] API methods have parameter descriptions

---

## File Structure Standards

### Component File Organization

```
src/components/
├── Header.tsx                      # Simple, reusable component
├── ProductCard.tsx                 # Card component with props
├── DataList.tsx                    # List with loading/error states
├── Loader.tsx                      # Loading indicator
├── ThemeToggleButton.tsx           # Theme switcher
└── index.ts                        # Barrel export (optional)
```

**File Naming Convention:**
- PascalCase for component files: `ProductCard.tsx`, not `product-card.tsx`
- camelCase for non-component utilities: `dateUtils.ts`, `stringFormat.ts`
- UPPERCASE for constants: `STORAGE_KEYS.ts`

### Type File Organization

```
src/types/
├── product.ts              # Product-related types
├── user.ts                 # User-related types
├── serviceResponse.ts      # API response types
├── actionState.ts          # Action state types
└── index.ts               # Barrel export (optional)
```

**Type Naming Convention:**
- Interfaces: Prefix with `I` (e.g., `IProduct`, `IProductAttribute`)
- Types: No prefix, use PascalCase (e.g., `Theme`, `ActionStatus`)
- Props interfaces: Suffix with `Props` (e.g., `ProductCardProps`)

### API File Organization

```
src/api/
├── productApi.ts           # Product CRUD operations
├── userApi.ts              # User operations
├── masterProductAttributeApi.ts
└── index.ts               # Barrel export
```

**API Class Convention:**
- Class name: camelCase (e.g., `productApi`)
- All methods: static and public
- Method naming: `get()`, `post()`, `put()`, `delete()`, `getAll()`, `search()`

### Page File Organization

```
src/pages/
├── feature/
│   ├── FeatureName.tsx         # Main page component
│   ├── FeatureForm.tsx         # Form sub-component
│   ├── FeatureTable.tsx        # Table sub-component
│   ├── FeatureTableRow.tsx     # Row sub-component
│   └── index.ts                # Barrel export
└── index.ts                    # Main page exports
```

### Context File Organization

```
src/contexts/
├── feature/
│   ├── FeatureProvider.tsx     # Provider component
│   ├── FeatureContext.tsx      # Context creation
│   ├── useFeature.ts           # Custom hook
│   ├── type.ts                 # Type definitions
│   ├── const.ts                # Default constants
│   └── index.ts                # Barrel export
└── index.ts                    # All context exports
```

### Utility File Organization

```
src/utils/
├── index.ts                    # Main exports
├── keys.ts                     # Storage keys constants
├── logger.ts                   # Logging utility
├── helper/
│   ├── dateUtils.ts           # Date operations
│   ├── guid.ts                # GUID generation
│   ├── numberUtils.ts         # Number operations
│   └── stringFormat.ts        # String utilities
└── web/
    ├── applicationStorage.ts   # LocalStorage wrapper
    └── sessionStorage.ts       # SessionStorage wrapper
```

---

## Code Examples & Standards

### ✓ Good: Proper TypeScript

```typescript
import type { ReactNode } from 'react';

interface ProductCardProps {
  productId: number;
  onSelect?: (id: number) => void;
  children?: ReactNode;
}

export const ProductCard = ({
  productId,
  onSelect,
  children,
}: ProductCardProps) => {
  const handleClick = (): void => {
    onSelect?.(productId);
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};

export default ProductCard;
```

### ✗ Bad: Loose TypeScript

```typescript
// Missing return type, using any, loose typing
import React from 'react';

export const ProductCard = (props: any) => {
  const handleClick = () => {
    props.onSelect(props.id);
  };

  return (
    <div onClick={handleClick}>
      {props.children}
    </div>
  );
};
```

### ✓ Good: Proper Dark Mode

```tsx
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md">
  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
    Product Name
  </h3>
  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
    Description
  </p>
  <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded">
    Action
  </button>
</div>
```

### ✗ Bad: Missing Dark Mode

```tsx
<div className="p-4 bg-white rounded-lg shadow-sm">
  <h3 className="text-lg font-bold text-gray-900">
    Product Name
  </h3>
  <p className="mt-2 text-sm text-gray-600">
    Description
  </p>
  <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">
    Action
  </button>
</div>
```

### ✓ Good: Responsive Design

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 md:p-6 lg:p-8">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### ✗ Bad: Not Responsive

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### ✓ Good: API Class

```typescript
export class productApi {
  /**
   * Retrieve product by ID
   * @param id - Product ID
   * @returns Product object or undefined
   */
  static async get(id: number): Promise<IProduct | undefined> {
    try {
      return await db.products.get(id);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new product
   * @param payload - Product data
   * @returns ServiceResponse with created product ID
   */
  static async post(payload: Omit<IProduct, 'id'>): Promise<ServiceResponse<number>> {
    try {
      const id = await db.products.add(payload as IProduct);
      return {
        status: 201,
        success: true,
        message: 'Product created',
        data: id,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Creation failed',
        data: 0,
      };
    }
  }
}
```

### ✗ Bad: Direct Component API Call

```typescript
export const ProductList = () => {
  useEffect(() => {
    // DON'T do this!
    db.products.toArray().then(products => {
      setProducts(products);
    });
  }, []);

  return (
    // Component JSX
  );
};
```

### ✓ Good: Form with Validation

```tsx
const handleSubmit = async (e: React.FormEvent): Promise<void> => {
  e.preventDefault();

  if (!formData.name.trim()) {
    setErrors(prev => ({ ...prev, name: 'Name is required' }));
    return;
  }

  setIsLoading(true);
  try {
    const response = await productApi.post(formData);
    if (response.success) {
      setSuccessMessage('Product created successfully');
    } else {
      setErrors(prev => ({ ...prev, submit: response.message }));
    }
  } catch (error) {
    console.error('Submission error:', error);
    setErrors(prev => ({ ...prev, submit: 'An error occurred' }));
  } finally {
    setIsLoading(false);
  }
};
```

### ✗ Bad: Form Without Validation

```tsx
const handleSubmit = (): void => {
  productApi.post(formData);
  setProducts([...products, formData]);
};
```

---

## Performance Checklist

- [ ] Images are optimized and lazy-loaded
- [ ] Large lists use pagination or virtual scrolling
- [ ] Components wrap with `React.memo()` when appropriate
- [ ] useCallback used for event handlers passed to children
- [ ] useMemo used to prevent unnecessary recalculations
- [ ] Dependencies arrays in useEffect are correct and minimal
- [ ] No infinite loops in useEffect
- [ ] Data fetching is not duplicated
- [ ] Unnecessary re-renders are prevented

---

## Security Checklist

- [ ] No hardcoded credentials or secrets
- [ ] User inputs are validated before use
- [ ] SQL injection not possible (using Dexie)
- [ ] XSS protection (React handles this automatically)
- [ ] No sensitive data logged to console in production
- [ ] API tokens handled securely
- [ ] HTTPS enforced in production

---

## Testing Checklist (If Applicable)

- [ ] Unit tests for utility functions
- [ ] Component tests for complex components
- [ ] Integration tests for features
- [ ] Test coverage minimum: 80%
- [ ] Error scenarios are tested
- [ ] Loading states are tested
- [ ] User interactions are tested

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Commit Message Standards

### Format
```
[TYPE] Short description (max 50 chars)

Longer description explaining why the change was made.
Reference any related issues: #123

Type must be one of:
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring without feature changes
- style: Formatting, missing semicolons, etc.
- docs: Documentation changes
- chore: Build, dependency updates
- test: Adding or updating tests
```

### Example

```
feat: Add product search with pagination

Implement search functionality for products with support for
pagination. Added filters for price range and stock status.
Closes #45
```

---

## Pull Request Checklist

- [ ] Branch name follows convention: `feature/description` or `fix/description`
- [ ] Commits are logical and atomic
- [ ] No merge conflicts
- [ ] No console.log() statements
- [ ] No commented-out code
- [ ] Tests pass (if applicable)
- [ ] Code follows project standards
- [ ] PR description clearly explains changes
- [ ] Screenshots/videos included for UI changes

---

## Code Review Checklist

When reviewing code, ensure reviewer checks:

- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] Follows project conventions
- [ ] Tests are added/updated
- [ ] Documentation is updated
- [ ] No performance issues
- [ ] No security vulnerabilities
- [ ] PR description is clear
- [ ] Changes are focused and minimal

---

## Deployment Checklist

Before deploying to production:

- [ ] Build succeeds without errors: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass (if applicable)
- [ ] No console errors in browser
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Dark mode works correctly
- [ ] All API endpoints tested
- [ ] Error handling verified
- [ ] Previous features still working

---

## Environment Variables

Create `.env.local` for local development:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=POS Universe
```

Never commit `.env.local` or `.env` files.

---

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code (if available)
npm run format

# Preview production build
npm run preview
```

---

## Common Mistakes to Avoid

1. **Using `any` type** - Define proper types instead
2. **Forgetting dark mode classes** - Apply `dark:` prefix consistently
3. **Mixing Tailwind with inline styles** - Use only Tailwind CSS
4. **Direct state mutation** - Always use setState
5. **API calls in render** - Move to useEffect with dependencies
6. **Prop drilling** - Using Context API for global state
7. **No error handling** - Always handle errors gracefully
8. **Missing null checks** - Check for undefined values
9. **Ignoring accessibility** - Use semantic HTML and ARIA labels
10. **Console logs in production** - Remove debug logs before commit

---

## Resources

- **TypeScript**: https://www.typescriptlang.org/docs/
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com/
- **Dexie.js**: https://dexie.org

---

## Quick Links

- 📖 [Copilot Instructions](.github/.copilot-instructions.md)
- 📚 [Project Preparation Guide](PROJECT_PREPARATION.md)
- 📋 [GEMINI.md](GEMINI.md)
- 📄 [README.md](README.md)

---

## Questions or Suggestions?

If you have questions about these standards or suggestions for improvements, please:

1. Create an issue in the project repository
2. Discuss in team meetings
3. Update documentation with consensus

Last Updated: February 21, 2026

