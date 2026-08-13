import { Navigate } from 'react-router-dom';
import AdminPage from './AdminMain';
import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                setIsAuthenticated(data.success && data.user?.role === 'admin');
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <AdminPage /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;