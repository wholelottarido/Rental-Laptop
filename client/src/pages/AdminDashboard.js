import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminLaptopManagement from '../components/AdminLaptopManagement';
import AdminHistoryPage from './AdminHistoryPage';

const AdminDashboard = () => {
    const location = useLocation();
    
    // Tentukan path mana yang sedang aktif
    const isHistoryPage = location.pathname === '/admin/history';

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {/* Beri style berbeda untuk tab yang aktif */}
                    <Link 
                        to="/admin/dashboard" 
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            !isHistoryPage 
                            ? 'border-indigo-500 text-indigo-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Manajemen Laptop
                    </Link>
                    <Link 
                        to="/admin/history" 
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            isHistoryPage 
                            ? 'border-indigo-500 text-indigo-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Riwayat Transaksi
                    </Link>
                </nav>
            </div>

            {/* Tampilkan konten berdasarkan path yang aktif */}
            <div>
                {isHistoryPage ? <AdminHistoryPage /> : <AdminLaptopManagement />}
            </div>
        </div>
    );
};

export default AdminDashboard;
