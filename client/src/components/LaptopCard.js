import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToCart } from '../services/api';

const LaptopCard = ({ laptop }) => {
    const navigate = useNavigate();

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            await addToCart(laptop.id);
            toast.success(`${laptop.brand} ${laptop.model} berhasil ditambahkan!`);
            setTimeout(() => window.location.reload(), 1000); 
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Anda harus login terlebih dahulu.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Gagal menambahkan ke keranjang.');
            }
        }
    };

    const handleRentNow = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const user = localStorage.getItem('user');
        if (!user) {
            toast.error('Anda harus login untuk menyewa laptop.');
            navigate('/login');
            return;
        }
        navigate('/checkout', { state: { items: [laptop] } });
    };

    const statusInfo = {
        available: { label: 'Tersedia', badgeClass: 'bg-green-100 text-green-800' },
        rented: { label: 'Disewa', badgeClass: 'bg-red-100 text-red-800' },
        maintenance: { label: 'Perbaikan', badgeClass: 'bg-amber-100 text-amber-800' },
    };
    const currentStatus = statusInfo[laptop.status] || statusInfo.maintenance;
    const canRentNow = laptop.status === 'available';

    // BLOK LOGIKA GAMBAR LAMA SUDAH DIHAPUS DARI SINI

    return (
        <Link to={`/laptops/${laptop.id}`} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col no-underline">
            <div className="relative">
                {/* INI SATU-SATUNYA LOGIKA GAMBAR YANG BENAR */}
                <img
                    src={laptop.image_url ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${laptop.image_url}` : 'https://placehold.co/600x400/e2e8f0/4a5568?text=Gambar+Tdk+Ada'}
                    alt={`${laptop.brand} ${laptop.model}`}
                    className="w-full h-48 object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${currentStatus.badgeClass}`}>
                    {currentStatus.label}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800">{laptop.brand} {laptop.model}</h3>
                <p className="text-gray-600 text-sm mt-1 h-10 overflow-hidden">{laptop.specifications}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                        Rp{Number(laptop.rental_price_per_day).toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-gray-500">/hari</span>
                    </span>
                    <div className="flex items-center space-x-2">
                        <button disabled={!canRentNow} onClick={handleRentNow} className={`px-3 py-2 text-xs font-bold text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${canRentNow ? 'bg-green-600 hover:bg-green-700 focus:ring-green-400' : 'bg-gray-400 cursor-not-allowed'}`}>
                            Sewa
                        </button>
                        <button onClick={handleAddToCart} className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" title="Tambah ke Keranjang">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default LaptopCard;