const express = require('express');
const router = express.Router();
const {
    createRental,
    getMyRentals,
    getAllRentals, // Anda menggunakan ini, jadi saya pastikan ada
    updateRentalStatus,
    deleteRental // Fungsi baru yang perlu Anda buat di controller
} = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rute untuk admin mendapatkan semua data rental
// Menambahkan /? untuk membuat garis miring di akhir opsional
router.get('/admin/all/?', protect, admin, getAllRentals);

// Rute untuk admin mengupdate status rental spesifik
router.patch('/admin/:id/status/?', protect, admin, updateRentalStatus);

// Rute untuk user mendapatkan riwayat sewanya sendiri
router.get('/my-rentals/?', protect, getMyRentals);

// Rute untuk user membuat rental baru (POST)
// dan menghapus rental spesifik (DELETE)
router.route('/?')
    .post(protect, upload.single('ktp_image'), createRental);

// Rute untuk menghapus rental berdasarkan ID.
// Ini adalah bagian yang hilang sebelumnya.
router.delete('/:id/?', protect, deleteRental);


module.exports = router;