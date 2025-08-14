import React, { useState, useEffect, useMemo } from 'react';
import { fetchLaptops } from '../services/api';
import LaptopCard from '../components/LaptopCard';

const LaptopListPage = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State baru untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price_asc', 'price_desc'

  useEffect(() => {
  // Fungsi asli Anda untuk mengambil data
  const getLaptops = async () => {
    try {
      const { data } = await fetchLaptops();
      setLaptops(data);
    } catch (err) {
      // Kita lempar lagi errornya agar bisa ditangkap oleh fungsi retry
      throw err;
    }
  };

  // Fungsi baru yang membungkus getLaptops dengan logika retry
  const fetchLaptopsWithRetry = async (retries = 2) => { // Coba total 3x
    try {
      console.log("Mencoba mengambil data laptop...");
      await getLaptops();
      console.log("✅ Data berhasil dimuat!");
      setLoading(false); // Matikan loading jika berhasil
    } catch (error) {
      console.error(`Gagal mengambil data (sisa percobaan: ${retries}):`, error);
      if (retries > 0) {
        console.log("Mencoba lagi dalam 3 detik...");
        setTimeout(() => fetchLaptopsWithRetry(retries - 1), 3000); // Tunggu 3 detik
      } else {
        console.error("Gagal total mengambil data setelah beberapa kali percobaan.");
        setError('Gagal memuat data laptop. Silakan coba refresh halaman.');
        setLoading(false); // Matikan loading jika gagal total
      }
    }
  };

  // Panggil fungsi yang bisa melakukan retry
  fetchLaptopsWithRetry();

}, []); // Dependency array kosong agar hanya berjalan sekali saat komponen dimuat

  // Gunakan useMemo untuk memfilter dan mengurutkan data tanpa memanggil API ulang
  const filteredAndSortedLaptops = useMemo(() => {
    let result = laptops;

    // 1. Proses Pencarian
    if (searchTerm) {
      result = result.filter(laptop =>
        laptop.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laptop.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Proses Pengurutan
    if (sortBy === 'price_asc') {
      result = [...result].sort((a, b) => a.rental_price_per_day - b.rental_price_per_day);
    } else if (sortBy === 'price_desc') {
      result = [...result].sort((a, b) => b.rental_price_per_day - a.rental_price_per_day);
    }

    return result;
  }, [laptops, searchTerm, sortBy]);


  if (loading) {
    return <div className="text-center py-10">Memuat laptop...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* --- BAGIAN TATA LETAK BARU --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Pilihan Laptop Terbaik untuk Anda</h1>
        {/* Filter minimalis */}
        <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 flex-shrink-0">Urutkan:</label>
            <select
              id="sort"
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Paling Sesuai</option>
              <option value="price_asc">Harga Termurah</option>
              <option value="price_desc">Harga Termahal</option>
            </select>
        </div>
      </div>

      {/* Kolom Pencarian yang lebih lebar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
        </div>
        <input
            type="text"
            id="search"
            placeholder="Cari berdasarkan brand atau model..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* --- AKHIR BAGIAN TATA LETAK BARU --- */}
      
      {filteredAndSortedLaptops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedLaptops.map(laptop => (
            <LaptopCard key={laptop.id} laptop={laptop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-700">Tidak ada laptop yang ditemukan</h2>
          <p className="mt-2 text-gray-500">Coba ubah kata kunci pencarian atau filter Anda.</p>
        </div>
      )}
    </div>
  );
};

export default LaptopListPage;
