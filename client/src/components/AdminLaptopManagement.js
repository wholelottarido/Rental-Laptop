import React, { useState, useEffect } from 'react';
import { fetchAllLaptopsForAdmin, deleteLaptop, updateLaptopStatus } from '../services/api';
import LaptopFormModal from './LaptopFormModal';

const AdminLaptopManagement = () => {
    const [laptops, setLaptops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLaptop, setEditingLaptop] = useState(null);
    const [statusMenuOpenFor, setStatusMenuOpenFor] = useState(null);

    const loadLaptops = async () => {
        try {
            setLoading(true);
            const { data } = await fetchAllLaptopsForAdmin();
            setLaptops(data);
        } catch (err) {
            setError('Gagal memuat data laptop.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLaptops();
    }, []);

    const handleOpenModal = (laptop = null) => {
        setEditingLaptop(laptop);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLaptop(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        loadLaptops();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus laptop ini?')) {
            try {
                await deleteLaptop(id);
                loadLaptops();
            } catch (err) {
                setError('Gagal menghapus laptop.');
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateLaptopStatus(id, newStatus);
            loadLaptops();
        } catch (err) {
            setError('Gagal mengubah status.');
        } finally {
            setStatusMenuOpenFor(null);
        }
    };

    const toggleStatusMenu = (laptopId) => {
        setStatusMenuOpenFor(prev => (prev === laptopId ? null : laptopId));
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Katalog Laptop</h2>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    + Tambah Laptop
                </button>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}

            <div className="bg-white shadow-lg rounded-lg">
                <table className="min-w-full leading-normal">
                    {/* ... (thead dari tabel laptop) ... */}
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gambar</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand & Model</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga/Hari</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ... (tbody dari tabel laptop) ... */}
                        {laptops.map(laptop => (
                            <tr key={laptop.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <img src={`http://localhost:5000${laptop.image_url}`} alt={laptop.model} className="w-20 h-auto object-cover rounded"/>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap font-semibold">{laptop.brand}</p>
                                    <p className="text-gray-600 whitespace-no-wrap">{laptop.model}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">Rp{Number(laptop.rental_price_per_day).toLocaleString('id-ID')}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="relative">
                                        <span onClick={() => toggleStatusMenu(laptop.id)} className={`cursor-pointer relative inline-block px-3 py-1 font-semibold leading-tight rounded-full capitalize ${ laptop.status === 'available' ? 'text-green-900 bg-green-200' : laptop.status === 'rented' ? 'text-red-900 bg-red-200' : 'text-amber-900 bg-amber-200'}`}>
                                            {laptop.status}
                                        </span>
                                        {statusMenuOpenFor === laptop.id && (
                                            <div className="absolute z-10 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    {['available', 'rented', 'maintenance'].map(status => (
                                                        <a key={status} href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(laptop.id, status);}} className={`flex items-center px-4 py-2 text-sm ${ laptop.status === status ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100 hover:text-gray-900`}>
                                                           <span className={`inline-block w-2 h-2 mr-3 rounded-full ${ status === 'available' ? 'bg-green-500' : status === 'rented' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                                                            Ubah ke <span className="font-semibold ml-1 capitalize">{status}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button onClick={() => handleOpenModal(laptop)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                    <button onClick={() => handleDelete(laptop.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <LaptopFormModal 
                    laptop={editingLaptop}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default AdminLaptopManagement;
