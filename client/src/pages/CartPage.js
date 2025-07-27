import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartItems, removeFromCart } from '../services/api';
import toast from 'react-hot-toast'; // Impor toast

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loadCartItems = async () => {
        try {
            setLoading(true);
            const { data } = await getCartItems();
            setCartItems(data);
        } catch (err) {
            setError('Gagal memuat item keranjang. Silakan coba lagi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCartItems();
    }, []);

    const handleRemoveItem = (laptopId, laptopName) => {
        // --- Mengganti window.confirm dengan toast ---
        toast((t) => (
            <div className="flex flex-col items-center gap-3">
                <p className="font-semibold">Anda yakin ingin menghapus <span className="font-bold">{laptopName}</span>?</p>
                <div className="flex gap-4">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            performRemove(laptopId);
                            toast.dismiss(t.id);
                        }}
                    >
                        Ya, Hapus
                    </button>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Batal
                    </button>
                </div>
            </div>
        ), {
            duration: 6000, // Toast akan hilang setelah 6 detik jika tidak ada interaksi
        });
    };

    const performRemove = async (laptopId) => {
        const promise = removeFromCart(laptopId);

        toast.promise(promise, {
            loading: 'Menghapus item...',
            success: () => {
                // Muat ulang item setelah berhasil menghapus
                loadCartItems();
                // Untuk sementara, reload halaman agar count di header update
                setTimeout(() => window.location.reload(), 1000);
                return 'Item berhasil dihapus!';
            },
            error: 'Gagal menghapus item.',
        });
    };

    const handleGoToCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return <div className="text-center py-10">Memuat keranjang...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Keranjang Anda</h1>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">Keranjang Anda kosong</h2>
                    <p className="mt-2 text-gray-500">Sepertinya Anda belum menambahkan laptop apa pun.</p>
                    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                        Mulai Pilih Laptop
                    </Link>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {cartItems.map((item) => (
                        <div key={item.cart_id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                            <div className="flex items-center">
                                <img 
                                    src={`http://localhost:5000${item.image_url}`} 
                                    alt={item.model} 
                                    className="w-24 h-24 object-cover rounded-lg mr-6"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{item.brand} {item.model}</h3>
                                    <p className="text-gray-600">Harga: Rp{Number(item.rental_price_per_day).toLocaleString('id-ID')}/hari</p>
                                    <div className="mt-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                            item.status === 'available' ? 'text-green-900 bg-green-200' : 
                                            item.status === 'rented' ? 'text-red-900 bg-red-200' : 'text-amber-900 bg-amber-200'
                                        }`}>
                                            Status: {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleRemoveItem(item.id, `${item.brand} ${item.model}`)}
                                className="text-red-500 hover:text-red-700 font-semibold"
                            >
                                Hapus
                            </button>
                        </div>
                    ))}
                    <div className="mt-8 text-right">
                        <button 
                            onClick={handleGoToCheckout}
                            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 text-lg"
                        >
                            Lanjutkan ke Pembayaran ({cartItems.length} item)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
