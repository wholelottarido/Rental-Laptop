const express = require('express');
const { createRental, getMyRentals, getAllRentals, updateRentalStatus } = require('../controllers/rentalController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route baru untuk update status oleh admin
router.route('/admin/:id/status').patch(protect, admin, updateRentalStatus);

router.route('/admin/all').get(protect, admin, getAllRentals);

router.route('/')
    .post(protect, upload.single('ktp_image'), createRental); 

router.route('/my-rentals')
    .get(protect, getMyRentals);

module.exports = router;
