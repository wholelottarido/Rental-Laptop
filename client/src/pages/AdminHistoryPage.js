import React, { useState, useEffect } from 'react';
import { getAllRentalsForAdmin, updateRentalStatusForAdmin } from '../services/api';

const AdminHistoryPage = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusMenuOpenFor, setStatusMenuOpenFor] = useState(null);

    const loadRentals = async () => {
        try {
            const { data } = await getAllRentalsForAdmin();
            setRentals(data);
        } catch (err) {
            setError('Gagal memuat data transaksi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRentals();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateRentalStatusForAdmin(id, status);
            loadRentals(); // Muat ulang data untuk menampilkan status baru
        } catch (err) {
            alert('Gagal mengubah status.');
        } finally {
            setStatusMenuOpenFor(null);
        }
    };

    const toggleStatusMenu = (rentalId) => {
        setStatusMenuOpenFor(prev => (prev === rentalId ? null : rentalId));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const statusColors = {
        upcoming: 'text-blue-900 bg-blue-200',
        ongoing: 'text-green-900 bg-green-200',
        completed: 'text-purple-900 bg-purple-200',
        cancelled: 'text-gray-700 bg-gray-200',
    };

    if (loading) return <p>Memuat data transaksi...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Riwayat Semua Transaksi</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Penyewa</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Laptop</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Periode Sewa</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jaminan KTP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.map(rental => (
                            <tr key={rental.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 font-semibold whitespace-no-wrap">{rental.user_name}</p><p className="text-gray-600 whitespace-no-wrap">{rental.user_email}</p></td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{rental.brand} {rental.model}</p></td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{formatDate(rental.start_date)} - {formatDate(rental.end_date)}</p></td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">Rp{Number(rental.total_price).toLocaleString('id-ID')}</p></td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="relative">
                                        <span onClick={() => toggleStatusMenu(rental.id)} className={`cursor-pointer relative inline-block px-3 py-1 font-semibold leading-tight rounded-full capitalize ${statusColors[rental.rental_status]}`}>
                                            {rental.rental_status}
                                        </span>
                                        {statusMenuOpenFor === rental.id && (
                                            <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg border">
                                                <ul className="py-1">
                                                    {['upcoming', 'ongoing', 'completed', 'cancelled'].map(status => (
                                                        <li key={status}><a href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(rental.id, status);}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize">{status}</a></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><a href={`http://localhost:5000${rental.ktp_image_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">Lihat KTP</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminHistoryPage;
