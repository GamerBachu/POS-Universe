import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from './contexts/theme';
import { MainLayout } from './layouts/index.ts';
import { router } from './routes/index.tsx';
import { AuthProvider } from './contexts/authorize/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <MainLayout>
          <RouterProvider router={router} />
        </MainLayout>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
