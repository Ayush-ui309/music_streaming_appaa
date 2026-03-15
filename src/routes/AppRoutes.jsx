import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

// Import Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Search from '../pages/Search';
import Playlist from '../pages/Playlist';
import Favorites from '../pages/Favorites';
import Profile from '../pages/Profile';
import Premium from '../pages/Premium';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SEARCH} element={<Search />} />
      
      {/* Protected Routes */}
      <Route 
        path={ROUTES.DASHBOARD} 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.PLAYLIST} 
        element={
          <ProtectedRoute>
            <Playlist />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.FAVORITES} 
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.PROFILE} 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/premium" 
        element={
          <ProtectedRoute>
            <Premium />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
