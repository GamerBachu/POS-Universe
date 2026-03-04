
# GitHub Copilot Instructions for POS Universe

## Overview
POS Universe is a modern, type-safe Point of Sale web system built with React 19, Vite, and TypeScript. The project emphasizes clean code, strict typing, and a feature-based structure for scalability and maintainability.


## i18n & Localization
- All user-facing text (labels, placeholders, button text, etc.) in the product folder must use i18n keys from `src/locales/en.json`.
- Use `resource.product_inventory.KEY` for all product-related UI text.
- Do not hardcode visible text in JSX or TSX; always reference the appropriate key.

## Key Guidelines

- **Type Safety:**
	- Use TypeScript everywhere. Prefer explicit types and interfaces.
	- Avoid use of `any` and implicit `any` types.
	- Leverage types from the `types/` directory for consistency.

- **React 19:**
	- Use React 19 features and idioms.
	- Prefer functional components and hooks.
	- Use React 19 form patterns and action state for handling forms and side effects.

- **Project Structure:**
	- Follow the feature-based organization in `src/`:
		- `api/` for API logic
		- `components/` for shared UI
		- `contexts/` for global state
		- `hooks/` for custom hooks
		- `layouts/`, `libs/`, `pages/`, `routes/`, `styles/`, `types/`, `utils/`

- **Styling:**
	- Use Tailwind CSS for all styling.
	- Ensure the `#root` div in `index.html` has: `min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`.

- **Code Quality:**
	- Write clean, readable, and maintainable code.
	- Use clear naming conventions and consistent formatting.
	- Add comments for complex logic.
	- Use Git for version control with small, clear commits.
	- Write and maintain tests for all features.

## Forms & Action State
- Use React 19's form and action state patterns for all forms.
- Keep form logic type-safe and colocated with components.

## References
- See `README.md` for tech stack and getting started.
- See `src/types/` for shared types.
- See `src/pages/systemLog/SystemLogTable.tsx` for reference implementation of responsive tables.

---
_This file is for GitHub Copilot and contributors. Please follow these guidelines for a consistent, type-safe, and modern codebase._