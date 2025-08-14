const mysql = require('mysql2/promise');
require('dotenv').config();

// Kode pintar yang akan kita gunakan
let dbConfig;

// Jika di Railway, gunakan DATABASE_URL dari Variables
if (process.env.DATABASE_URL) {
  dbConfig = {
    uri: process.env.DATABASE_URL
  };
  console.log("Mencoba terhubung menggunakan DATABASE_URL dari Railway...");
} else {
  // Jika di lokal, gunakan dari file .env
  dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
  console.log("Mencoba terhubung menggunakan file .env lokal...");
}

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅✅✅ DATABASE BERHASIL TERKONEKSI! ✅✅✅');
    connection.release();
  } catch (error) {
    console.error('❌ Gagal terkoneksi ke database:', error.message);
    process.exit(1); // Hentikan aplikasi jika koneksi database gagal
  }
};

checkConnection();

module.exports = pool;