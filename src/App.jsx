import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductAdmin from './pages/ProductAdmin';
import ManageUsers from './components/UserManagement'; 
import AdminOrders from './components/AdminOrders'; // <--- 1. IMPORT KOMPONEN ADMIN ORDERS
import Catalog from './pages/PublicCatalog';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- HALAMAN PUBLIK --- */}
        <Route path="/" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- HALAMAN PROFIL (Wajib Login) --- */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* --- HALAMAN KHUSUS ADMIN --- */}
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <ProductAdmin />
            </ProtectedRoute>
          } 
        />

        {/* Rute Manajemen User */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <ManageUsers />
            </ProtectedRoute>
          } 
        />

        {/* ---> 2. RUTE KELOLA PESANAN ADMIN <--- */}
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminOrders />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;