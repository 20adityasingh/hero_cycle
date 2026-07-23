import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SetupGuard from './pages/SetupGuard';
import CreateSuperAdmin from './pages/CreateSuperAdmin';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SalespersonDashboard from './pages/SalespersonDashboard';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupGuard />} />
        <Route path="/setup" element={<CreateSuperAdmin />} />
        <Route path="/login" element={<Login />} />

        {/* Super Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Salesperson Dashboard */}
        <Route
          path="/salesperson-dashboard"
          element={
            <ProtectedRoute>
              <SalespersonDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
