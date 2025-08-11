const mysql = require('mysql2/promise');

// ======================================================================
// !! GANTI SEMUA YANG ADA DI DALAM TANDA KUTIP DENGAN CONNECTION URL ANDA !!
const DATABASE_URL = "mysql://root:UhkhbexWLWHwHMvZHQfJXPvDvUApEOLk@tramway.proxy.rlwy.net:29331/railway";
// ======================================================================

// Cek apakah URL sudah diisi. Jika belum, hentikan aplikasi.
if (DATABASE_URL.includes("passwordAnda") || DATABASE_URL.includes("hostAnda")) {
  console.error("!!! KESALAHAN: Harap ganti placeholder DATABASE_URL di db.js dengan Connection URL asli dari Railway !!!");
  process.exit(1);
}

const pool = mysql.createPool({
  uri: DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅✅✅ DATABASE BERHASIL TERKONEKSI! SELAMAT! ✅✅✅');
    connection.release();
  } catch (error) {
    console.error('❌ Gagal terkoneksi ke database:', error);
    process.exit(1);
  }
};

checkConnection();

module.exports = pool;