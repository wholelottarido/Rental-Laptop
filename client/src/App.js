import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Impor Toaster untuk notifikasi

// Import Komponen & Halaman
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LaptopListPage from './pages/LaptopListPage';
import LaptopDetailPage from './pages/LaptopDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Komponen Toaster untuk menangani semua notifikasi */}
        <Toaster 
          position="top-center"
          reverseOrder={false}
        />

        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<LaptopListPage />} />
            <Route path="/laptops/:id" element={<LaptopDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rute Terproteksi untuk Pengguna */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>

            {/* Rute Khusus Admin */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/history" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
