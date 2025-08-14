const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db'); // Memanggil file db.js yang sudah benar

const app = express();

// Konfigurasi CORS yang benar untuk Vercel
const corsOptions = {
  origin: 'https://rental-laptop-nine.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Menyajikan file statis dari folder 'uploads'
app.use('/uploads', express.static('uploads'));

// Rute dasar untuk tes
app.get('/', (req, res) => {
  res.send('Halo, ini adalah backend untuk Rental Laptop!');
});

// =======================================================
// == INI BAGIAN YANG KITA PERBAIKI ==
// Menggunakan nama file rute yang benar dari proyek Anda
app.use('/api/users', require('./routes/authRoutes')); // Mengarah ke authRoutes.js untuk user
app.use('/api/laptops', require('./routes/laptopRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));
// =======================================================

// Menggunakan Port dinamis dari Railway atau 5000 jika lokal
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});