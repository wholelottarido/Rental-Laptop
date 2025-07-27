const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan untuk Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder tempat menyimpan file
  },
  filename: function (req, file, cb) {
    // Buat nama file yang unik untuk menghindari konflik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter untuk hanya menerima file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPEG, PNG, JPG) yang diizinkan!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Batas ukuran file 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
