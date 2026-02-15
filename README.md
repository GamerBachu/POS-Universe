# POS Universe

POS Universe is a modern Point of Sale (POS) web system designed to work seamlessly on various devices, including desktops, tablets, and mobile phones.

## Tech Stack

*   **Framework:** React with Vite
*   **Language:** TypeScript
*   **Compiler:** React Compiler
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **Local Storage:** Dexie.js
*   **Linting:** ESLint

## Features

*   **Cross-device Compatibility:** Works on any device with a web browser.
*   **Offline First:** Using Dexie.js for reliable offline functionality. 
*   


## Development Guidelines

*   **Clean Code:** Write clean, readable, and maintainable code.
*   **Fully Type-Based:** Utilize TypeScript to its full potential with strict typing.

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Build for production:
    ```bash
    npm run build
    ```

## Project Structure

The project follows a feature-based organization inside the `src` directory.

```
src/
├── api/              # API call logic
├── assets/           # Static assets
├── components/       # Shared, reusable UI components
├── contexts/         # Global state management (React Context)
├── hooks/            # Custom React hooks
├── layouts/          # Page structure components
├── libs/             # External library configurations
├── pages/            # Page-level components
├── routes/           # Routing configuration
├── styles/           # Global styles and themes
├── types/            # Global TypeScript types
└── utils/            # Utility functions
```


Base Styling: The index.html file's #root div must contain the following classes to ensure consistent background and text rendering across themes:

min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100