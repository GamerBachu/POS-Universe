import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import Login from '@/pages/user/Login';
import Register from '@/pages/user/Register';
import ErrorPage from '@/pages/ErrorPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />, // Global catch-all for crashes
        children: [
            { index: true, element: <HomePage /> },
            { path: 'home', element: <Navigate to="/" replace /> }, // Clean redirect
            { path: 'about', element: <AboutPage /> },

            // Grouped Account Routes
            {
                path: 'account',
                children: [
                    { path: 'login', element: <Login /> },
                    { path: 'register', element: <Register /> },
                ],
            },

            // Explicit Error & Catch-all
            { path: 'error', element: <ErrorPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);

