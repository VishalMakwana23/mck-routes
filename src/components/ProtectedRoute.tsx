import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    // user is not authenticated: redirect to /login
    return <Navigate to="/login" replace />;
  }

  // user is authenticated: allow access
  return <Outlet />;
};
