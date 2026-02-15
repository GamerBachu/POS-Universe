import { Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import Index from '@/pages/Index';
import AboutPage from '@/pages/AboutPage';
import Login from '@/pages/user/Login';
import Register from '@/pages/user/Register';
import ErrorPage from '@/pages/ErrorPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Logout from '@/pages/user/Logout';
import Dashboard from '@/pages/Dashboard';
import Verify from '@/pages/user/Verify';
import Loader from '@/components/Loader';



export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense fallback={<Loader></Loader>}>
                <Outlet />
            </Suspense>
        ),
        errorElement: <ErrorPage />, // Global catch-all for crashes
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <Index /> },
                    { path: 'home', element: <HomePage /> },
                    { path: 'about', element: <AboutPage /> },
                    { path: 'dashboard', element: <Dashboard /> }
                ],
            },
            // Grouped Account Routes
            {
                path: 'account',
                element: <PublicRoute />,
                children: [
                    { path: 'login', element: <Login /> },
                    { path: 'register', element: <Register /> },
                    { path: 'logout', element: <Logout /> },
                    { path: 'verify', element: <Verify /> }
                ],
            },

            // Explicit Error & Catch-all
            { path: 'error', element: <ErrorPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);

export default router;