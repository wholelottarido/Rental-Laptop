const pool = require('../config/db');

// @desc    Get all laptops for public
// @route   GET /api/laptops
// @access  Public
const getLaptops = async (req, res) => {
    try {
        const [laptops] = await pool.query("SELECT * FROM laptops WHERE status = 'available'");
        res.json(laptops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all laptops for admin
// @route   GET /api/laptops/admin
// @access  Private/Admin
const getAllLaptopsForAdmin = async (req, res) => {
    try {
        const [laptops] = await pool.query("SELECT * FROM laptops ORDER BY created_at DESC");
        res.json(laptops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get laptop by ID
// @route   GET /api/laptops/:id
// @access  Public
const getLaptopById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM laptops WHERE id = ?', [id]);
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


// @desc    Create new laptop
// @route   POST /api/laptops
// @access  Private/Admin
const createLaptop = async (req, res) => {
    const { brand, model, specifications, rental_price_per_day } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const [result] = await pool.query(
            'INSERT INTO laptops (brand, model, specifications, rental_price_per_day, image_url) VALUES (?, ?, ?, ?, ?)',
            [brand, model, specifications, rental_price_per_day, image_url]
        );
        res.status(201).json({ id: result.insertId, ...req.body, image_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a laptop
// @route   PUT /api/laptops/:id
// @access  Private/Admin
const updateLaptop = async (req, res) => {
    const { id } = req.params;
    const { brand, model, specifications, rental_price_per_day } = req.body;
    let image_url;
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const fieldsToUpdate = { brand, model, specifications, rental_price_per_day };
        if (image_url) {
            fieldsToUpdate.image_url = image_url;
        }

        const [result] = await pool.query('UPDATE laptops SET ? WHERE id = ?', [fieldsToUpdate, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Laptop tidak ditemukan' });
        }
        res.json({ message: 'Laptop berhasil diupdate' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// =================================================================
// == FUNGSI DELETE DENGAN LOGIKA PENGHAPUSAN BERANTAI (CASCADING) ==
// =================================================================
// @desc    Delete a laptop and all its related data
// @route   DELETE /api/laptops/:id
// @access  Private/Admin
const deleteLaptop = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection(); // Dapatkan koneksi untuk transaksi

    try {
        // Mulai Transaksi
        await connection.beginTransaction();

        // 1. Hapus semua item di keranjang (cart) yang berhubungan dengan laptop ini
        await connection.query('DELETE FROM cart WHERE laptop_id = ?', [id]);

        // 2. Hapus semua riwayat penyewaan (rentals) yang berhubungan dengan laptop ini
        await connection.query('DELETE FROM rentals WHERE laptop_id = ?', [id]);

        // 3. Setelah semua riwayat bersih, baru hapus laptopnya
        const [result] = await connection.query('DELETE FROM laptops WHERE id = ?', [id]);
        
        // Selesaikan Transaksi
        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Laptop tidak ditemukan' });
        }
        
        res.json({ message: 'Laptop dan semua riwayat terkait berhasil dihapus' });
    } catch (error) {
        // Jika ada satu saja langkah yang gagal, batalkan semua perubahan
        await connection.rollback();
        console.error('Error saat menghapus laptop (cascading):', error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        // Selalu lepaskan koneksi setelah selesai
        connection.release();
    }
};


// @desc    Update a laptop's status
// @route   PATCH /api/laptops/:id/status
// @access  Private/Admin
const updateLaptopStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['available', 'rented', 'maintenance'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid' });
    }

    try {
        const [result] = await pool.query('UPDATE laptops SET status = ? WHERE id = ?', [status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Laptop tidak ditemukan' });
        }
        res.json({ message: 'Status laptop berhasil diupdate' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    getLaptops,
    getAllLaptopsForAdmin,
    getLaptopById,
    createLaptop,
    updateLaptop,
    deleteLaptop, // <-- Pastikan ini tetap diekspor
    updateLaptopStatus,
};