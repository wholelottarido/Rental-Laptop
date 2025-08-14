const express = require('express');
const router = express.Router();
const {
    getLaptops,
    createLaptop,
    getAllLaptopsForAdmin,
    updateLaptop,
    deleteLaptop,
    updateLaptopStatus,
    getLaptopById
} = require('../controllers/laptopController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rute khusus untuk admin mengambil semua laptop
// Menambahkan /? untuk membuat garis miring di akhir opsional
router.get('/admin/?', protect, admin, getAllLaptopsForAdmin);

// Rute untuk alamat dasar:
// GET /api/laptops -> untuk publik
// POST /api/laptops -> untuk admin membuat laptop baru
router.route('/?')
    .get(getLaptops)
    .post(protect, admin, upload.single('image'), createLaptop);

// Rute untuk satu laptop spesifik berdasarkan ID:
// GET /api/laptops/:id -> untuk publik
// PUT /api/laptops/:id -> untuk admin mengedit laptop
// DELETE /api/laptops/:id -> untuk admin menghapus laptop
router.route('/:id/?')
    .get(getLaptopById)
    .put(protect, admin, upload.single('image'), updateLaptop)
    .delete(protect, admin, deleteLaptop);

// Rute untuk mengubah status satu laptop spesifik
// PATCH /api/laptops/:id/status
router.patch('/:id/status/?', protect, admin, updateLaptopStatus);

module.exports = router;