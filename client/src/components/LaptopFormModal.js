import React, { useState, useEffect } from 'react';
import { createLaptop, updateLaptop } from '../services/api';

const LaptopFormModal = ({ laptop, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        specifications: '',
        rental_price_per_day: '',
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isEditMode = Boolean(laptop);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                brand: laptop.brand,
                model: laptop.model,
                specifications: laptop.specifications,
                rental_price_per_day: laptop.rental_price_per_day,
            });
            if (laptop.image_url) {
                setPreview(`http://localhost:5000${laptop.image_url}`);
            }
        }
    }, [laptop, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('brand', formData.brand);
        data.append('model', formData.model);
        data.append('specifications', formData.specifications);
        data.append('rental_price_per_day', formData.rental_price_per_day);
        if (image) {
            data.append('image', image);
        }

        try {
            if (isEditMode) {
                await updateLaptop(laptop.id, data);
            } else {
                await createLaptop(data);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Laptop' : 'Tambah Laptop Baru'}</h2>
                {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Brand</label>
                                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Model</label>
                                <input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Harga Sewa / Hari</label>
                                <input type="number" name="rental_price_per_day" value={formData.rental_price_per_day} onChange={handleChange} className="w-full p-2 border rounded" required />
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Gambar</label>
                                <input type="file" name="image" onChange={handleImageChange} className="w-full p-2 border rounded" />
                                {preview && <img src={preview} alt="Preview" className="mt-4 w-full h-32 object-cover rounded"/>}
                            </div>
                        </div>
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Spesifikasi</label>
                        <textarea name="specifications" value={formData.specifications} onChange={handleChange} className="w-full p-2 border rounded" rows="3"></textarea>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">
                            Batal
                        </button>
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300">
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LaptopFormModal;
