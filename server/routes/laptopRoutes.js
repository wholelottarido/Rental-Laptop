const express = require('express');
const { 
    getLaptops, 
    createLaptop,
    getAllLaptopsForAdmin, 
    updateLaptop,          
    deleteLaptop,          
    updateLaptopStatus ,
    getLaptopById    
} = require('../controllers/laptopController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

const router = express.Router();

router.route('/admin').get(protect, admin, getAllLaptopsForAdmin);

// Rute untuk publik dan membuat laptop baru (dengan upload gambar)
router.route('/')
    .get(getLaptops)
    .post(protect, admin, upload.single('image'), createLaptop); // <-- Diubah

// Rute untuk update, delete, dan get by id
router.route('/:id')
    .put(protect, admin, upload.single('image'), updateLaptop) // <-- DITAMBAHKAN
    .delete(protect, admin, deleteLaptop);                     // <-- DITAMBAHKAN

// Rute untuk update status
router.route('/:id/status').patch(protect, admin, updateLaptopStatus); // <-- DITAMBAHKAN

router.route('/:id')
    .get(getLaptopById) // <-- DITAMBAHKAN
    .put(protect, admin, upload.single('image'), updateLaptop)
    .delete(protect, admin, deleteLaptop);

router.route('/:id/status').patch(protect, admin, updateLaptopStatus);

module.exports = router;
