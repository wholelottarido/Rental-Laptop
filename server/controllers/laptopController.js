const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// @desc    Fetch all laptops for the public catalog
// @route   GET /api/laptops
// @access  Public
exports.getLaptops = async (req, res) => {
    try {
        // --- PERUBAHAN DI SINI ---
        // Query diubah untuk mengambil SEMUA laptop, tidak hanya yang 'available'.
        // Logika untuk menampilkan status akan ditangani oleh frontend.
        const [laptops] = await pool.query("SELECT * FROM laptops ORDER BY created_at DESC");
        res.json(laptops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch ALL laptops (untuk admin)
// @route   GET /api/laptops/admin
// @access  Private/Admin
exports.getAllLaptopsForAdmin = async (req, res) => {
    try {
        const [laptops] = await pool.query("SELECT * FROM laptops ORDER BY created_at DESC");
        res.json(laptops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new laptop
// @route   POST /api/laptops
// @access  Private/Admin
exports.createLaptop = async (req, res) => {
    const { brand, model, specifications, rental_price_per_day } = req.body;
    
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!brand || !model || !rental_price_per_day) {
        return res.status(400).json({ message: 'Brand, model, dan harga sewa tidak boleh kosong' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO laptops (brand, model, specifications, rental_price_per_day, image_url) VALUES (?, ?, ?, ?, ?)',
            [brand, model, specifications, rental_price_per_day, image_url]
        );
        res.status(201).json({ message: 'Laptop berhasil ditambahkan', laptopId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Update a laptop
// @route   PUT /api/laptops/:id
// @access  Private/Admin
exports.updateLaptop = async (req, res) => {
    const { id } = req.params;
    const { brand, model, specifications, rental_price_per_day } = req.body;
    
    try {
        const [existingLaptopRows] = await pool.execute('SELECT image_url FROM laptops WHERE id = ?', [id]);
        if (existingLaptopRows.length === 0) {
            return res.status(404).json({ message: 'Laptop tidak ditemukan' });
        }
        const existingLaptop = existingLaptopRows[0];

        let image_url = existingLaptop.image_url;
        if (req.file) {
            if (existingLaptop.image_url) {
                const oldImagePath = path.join(__dirname, '..', existingLaptop.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            image_url = `/uploads/${req.file.filename}`;
        }

        await pool.execute(
            'UPDATE laptops SET brand = ?, model = ?, specifications = ?, rental_price_per_day = ?, image_url = ? WHERE id = ?',
            [brand, model, specifications, rental_price_per_day, image_url, id]
        );
        res.json({ message: 'Laptop berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Delete a laptop
// @route   DELETE /api/laptops/:id
// @access  Private/Admin
exports.deleteLaptop = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute('SELECT image_url FROM laptops WHERE id = ?', [id]);
        if (rows.length > 0 && rows[0].image_url) {
            const imagePath = path.join(__dirname, '..', rows[0].image_url);
             if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await pool.execute('DELETE FROM laptops WHERE id = ?', [id]);
        res.json({ message: 'Laptop berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};


// @desc    Update laptop status
// @route   PATCH /api/laptops/:id/status
// @access  Private/Admin
exports.updateLaptopStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['available', 'rented', 'maintenance'].includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid' });
    }

    try {
        await pool.execute('UPDATE laptops SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Status laptop berhasil diubah menjadi ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Fetch a single laptop by ID
// @route   GET /api/laptops/:id
// @access  Public
exports.getLaptopById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM laptops WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Laptop tidak ditemukan' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
