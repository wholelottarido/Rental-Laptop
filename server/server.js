const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db'); // Memanggil file db.js yang sudah kita perbaiki

const app = express();

// Konfigurasi CORS yang benar untuk Vercel
const corsOptions = {
  origin: 'https://rental-laptop-nine.vercel.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Tes rute dasar
app.get('/', (req, res) => {
  res.send('Halo, ini adalah backend untuk Rental Laptop!');
});

// Semua rute API Anda
app.use('/api/users', require('./routes/users'));
// Tambahkan rute lain jika ada
// app.use('/api/laptops', require('./routes/laptops'));

// Menggunakan Port dinamis dari Railway atau 5000 jika lokal
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});