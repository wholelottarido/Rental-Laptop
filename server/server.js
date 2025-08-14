const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const laptopRoutes = require('./routes/laptopRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const cartRoutes = require('./routes/cartRoutes'); // <-- DITAMBAHKAN

const app = express();

// --- MEMO UNTUK SATPAM ---
const corsOptions = {
  origin: 'https://rental-laptop-nine.vercel.app',
  optionsSuccessStatus: 200 // beberapa browser lama butuh ini
};

app.use(cors(corsOptions));
// -------------------------

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/laptops', laptopRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/cart', cartRoutes); // <-- DITAMBAHKAN

app.get('/', (req, res) => {
    res.send('API Server untuk Rental Laptop sedang berjalan...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
