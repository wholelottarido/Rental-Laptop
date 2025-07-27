import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCartItems, createRental } from '../services/api';

const DELIVERY_FEE = 25000;

const CheckoutPage = () => {
    const [items, setItems] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // State baru untuk fitur tambahan
    const [deliveryOption, setDeliveryOption] = useState('pickup');
    const [ktpImage, setKtpImage] = useState(null);
    const [ktpPreview, setKtpPreview] = useState('');
    const [isFromCart, setIsFromCart] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            if (location.state?.items) {
                setItems(location.state.items);
                setIsFromCart(false);
            } else {
                try {
                    const { data } = await getCartItems();
                    if (data.length === 0) {
                        alert("Keranjang Anda kosong!");
                        navigate('/');
                    }
                    setItems(data);
                    setIsFromCart(true);
                } catch (err) {
                    setError('Gagal memuat keranjang.');
                }
            }
        };
        fetchItems();
    }, [location.state, navigate]);

    useEffect(() => {
        if (startDate && endDate && items.length > 0) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end >= start) {
                const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                let total = items.reduce((acc, item) => acc + (item.rental_price_per_day * duration), 0);
                if (deliveryOption === 'delivery') {
                    total += DELIVERY_FEE;
                }
                setTotalPrice(total);
            } else {
                setTotalPrice(0);
            }
        }
    }, [startDate, endDate, items, deliveryOption]);

    const handleKtpChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setKtpImage(file);
            setKtpPreview(URL.createObjectURL(file));
        }
    };

    const handleCheckout = async () => {
        if (!startDate || !endDate || !deliveryOption || !ktpImage) {
            setError('Harap lengkapi semua data: tanggal, opsi pengiriman, dan foto KTP.');
            return;
        }
        if (new Date(endDate) < new Date(startDate)) {
            setError('Tanggal selesai tidak boleh sebelum tanggal mulai.');
            return;
        }
        
        setLoading(true);
        setError('');

        const rentalFormData = new FormData();
        rentalFormData.append('items', JSON.stringify(items));
        rentalFormData.append('startDate', startDate);
        rentalFormData.append('endDate', endDate);
        rentalFormData.append('deliveryOption', deliveryOption);
        rentalFormData.append('ktp_image', ktpImage);
        rentalFormData.append('fromCart', isFromCart);

        try {
            await createRental(rentalFormData);
            alert('Penyewaan berhasil! Terima kasih telah menyewa di Rent-A-Top.');
            // --- PERUBAHAN DI SINI ---
            // Mengarahkan pengguna ke halaman utama ('/') setelah checkout berhasil
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memproses penyewaan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Item yang Disewa</h2>
                    {items.map(item => (
                        <div key={item.id} className="flex items-center py-2 border-b">
                            <img src={item.image_url && !item.image_url.startsWith('http') ? `http://localhost:5000${item.image_url}` : item.image_url} alt={item.model} className="w-16 h-16 object-cover rounded mr-4"/>
                            <div className="flex-grow">
                                <p className="font-bold">{item.brand} {item.model}</p>
                                <p className="text-sm text-gray-600">Rp{Number(item.rental_price_per_day).toLocaleString('id-ID')}/hari</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Detail Penyewaan</h2>
                    <div className="mb-4">
                        <label className="block font-semibold mb-1">Tanggal Mulai</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold mb-1">Tanggal Selesai</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border rounded"/>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Opsi Pengambilan</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center"><input type="radio" name="delivery" value="pickup" checked={deliveryOption === 'pickup'} onChange={e => setDeliveryOption(e.target.value)} className="mr-2"/> Ambil Sendiri</label>
                            <label className="flex items-center"><input type="radio" name="delivery" value="delivery" checked={deliveryOption === 'delivery'} onChange={e => setDeliveryOption(e.target.value)} className="mr-2"/> Diantar</label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block font-semibold mb-2">Jaminan (Upload Foto KTP)</label>
                        <input type="file" accept="image/*" onChange={handleKtpChange} className="w-full p-2 border rounded"/>
                        {ktpPreview && <img src={ktpPreview} alt="Preview KTP" className="mt-4 w-full h-40 object-contain rounded border"/>}
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                        {deliveryOption === 'delivery' && (
                             <div className="flex justify-between text-sm"><span>Biaya Pengiriman:</span><span>Rp{DELIVERY_FEE.toLocaleString('id-ID')}</span></div>
                        )}
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total Harga:</span>
                            <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <button 
                        onClick={handleCheckout}
                        disabled={loading || !startDate || !endDate || !ktpImage}
                        className="w-full mt-6 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Memproses...' : 'Konfirmasi & Sewa'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
