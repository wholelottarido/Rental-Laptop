import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRentals } from '../services/api';

const HistoryPage = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await getMyRentals();
                setRentals(data);
            } catch (err) {
                setError('Gagal memuat riwayat penyewaan.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    if (loading) {
        return <div className="text-center py-10">Memuat riwayat...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Riwayat Penyewaan Anda</h1>

            {rentals.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Anda belum memiliki riwayat penyewaan.</h2>
                    <p className="mt-2 text-gray-500">Mulai sewa laptop pertama Anda sekarang!</p>
                    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                        Lihat Katalog
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {rentals.map(rental => (
                        <div key={rental.id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <img 
                                src={`http://localhost:5000${rental.image_url}`} 
                                alt={rental.model} 
                                className="w-full md:w-32 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-800">{rental.brand} {rental.model}</h3>
                                <p className="text-gray-600">
                                    Disewa dari <span className="font-semibold">{formatDate(rental.start_date)}</span> hingga <span className="font-semibold">{formatDate(rental.end_date)}</span>
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Opsi Pengambilan: <span className="capitalize">{rental.delivery_option}</span>
                                </p>
                            </div>
                            <div className="text-left md:text-right w-full md:w-auto">
                                <p className="text-lg font-bold text-blue-600">Rp{Number(rental.total_price).toLocaleString('id-ID')}</p>
                                <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                                    rental.rental_status === 'upcoming' ? 'text-blue-900 bg-blue-200' :
                                    rental.rental_status === 'ongoing' ? 'text-green-900 bg-green-200' :
                                    'text-gray-700 bg-gray-200'
                                }`}>
                                    {rental.rental_status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
