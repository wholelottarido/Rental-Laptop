import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Cek apakah ada user yang login
  if (!user) {
    // Jika tidak ada user, arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  // 2. Jika route ini hanya untuk admin, cek peran user
  if (adminOnly && user.role !== 'admin') {
    // Jika user bukan admin, arahkan ke halaman utama
    return <Navigate to="/" />;
  }

  // 3. Jika semua pemeriksaan lolos, tampilkan konten halaman
  return <Outlet />;
};

export default ProtectedRoute;
