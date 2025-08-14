import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLaptopById, addToCart } from '../services/api';

const LaptopDetailPage = () => {
    const [laptop, setLaptop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams(); // Mengambil ID dari URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLaptop = async () => {
            try {
                const { data } = await getLaptopById(id);
                setLaptop(data);
            } catch (err) {
                setError('Gagal memuat detail laptop.');
            } finally {
                setLoading(false);
            }
        };
        fetchLaptop();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            await addToCart(laptop.id);
            alert(`${laptop.brand} ${laptop.model} berhasil ditambahkan ke keranjang!`);
            window.location.reload();
        } catch (error) {
            if (error.response?.status === 401) {
                alert('Anda harus login untuk menambahkan item ke keranjang.');
                navigate('/login');
            } else {
                alert(error.response?.data?.message || 'Gagal menambahkan ke keranjang.');
            }
        }
    };

    const handleRentNow = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            alert('Anda harus login untuk menyewa laptop.');
            navigate('/login');
            return;
        }
        navigate('/checkout', { state: { items: [laptop] } });
    };

    if (loading) return <p className="text-center py-10">Memuat detail laptop...</p>;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
    if (!laptop) return <p className="text-center py-10">Laptop tidak ditemukan.</p>;

    const canRent = laptop.status === 'available';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Kolom Gambar */}
                    <div className="p-4">
                        <img 
                            src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${laptop.image_url}`} 
                            alt={`${laptop.brand} ${laptop.model}`} 
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                    {/* Kolom Detail */}
                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                                canRent ? 'text-green-900 bg-green-200' : 'text-red-900 bg-red-200'
                            }`}>
                                {laptop.status}
                            </span>
                            <h1 className="text-4xl font-bold text-gray-800 mt-2">{laptop.brand} {laptop.model}</h1>
                            <p className="text-2xl font-semibold text-blue-600 mt-4">
                                Rp{Number(laptop.rental_price_per_day).toLocaleString('id-ID')}
                                <span className="text-base font-normal text-gray-500"> / hari</span>
                            </p>
                            <div className="mt-6 border-t pt-4">
                                <h3 className="font-bold text-lg mb-2">Spesifikasi:</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{laptop.specifications}</p>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center space-x-4">
                            <button 
                                onClick={handleRentNow}
                                disabled={!canRent}
                                className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                            >
                                Sewa Sekarang
                            </button>
                            <button 
                                onClick={handleAddToCart}
                                className="p-3 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                title="Tambah ke Keranjang"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaptopDetailPage;
