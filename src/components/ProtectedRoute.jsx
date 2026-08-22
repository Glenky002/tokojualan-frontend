import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/authService';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  // 1. Jika belum login sama sekali, arahkan ke halaman login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. Jika rute ini khusus admin, tapi user yang login ternyata pembeli biasa
  if (requireAdmin && !isAdmin()) {
    alert("Akses ditolak! Halaman ini khusus untuk Admin.");
    return <Navigate to="/" replace />; // Lempar kembali ke halaman utama / katalog
  }
  
  return children;
}