const pool = require('../config/db');

// @desc    Create a new rental order
// @route   POST /api/rentals
// @access  Private
const createRental = async (req, res) => {
    const { items, startDate, endDate, deliveryOption, fromCart } = req.body;
    const parsedItems = JSON.parse(items);
    const userId = req.user.id;
    const ktpImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!parsedItems || parsedItems.length === 0 || !startDate || !endDate || !deliveryOption) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    
    if (!ktpImageUrl) {
        return res.status(400).json({ message: 'Foto KTP wajib diunggah sebagai jaminan.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const item of parsedItems) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            let totalPrice = duration * item.rental_price_per_day;

            if (deliveryOption === 'delivery') {
                totalPrice += 25000;
            }

            await connection.execute(
                'INSERT INTO rentals (user_id, laptop_id, start_date, end_date, total_price, payment_status, rental_status, delivery_option, ktp_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, item.id, startDate, endDate, totalPrice, 'paid', 'upcoming', deliveryOption, ktpImageUrl]
            );

            await connection.execute(
                "UPDATE laptops SET status = 'rented' WHERE id = ?",
                [item.id]
            );
        }

        if (fromCart === 'true') {
             await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
        }
        
        await connection.commit();
        res.status(201).json({ message: 'Penyewaan berhasil! Laptop Anda telah dipesan.' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error saat memproses penyewaan' });
    } finally {
        connection.release();
    }
};

// @desc    Get rental history for the logged-in user
// @route   GET /api/rentals/my-rentals
// @access  Private
const getMyRentals = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rentals] = await pool.execute(`
            SELECT 
                r.id, r.start_date, r.end_date, r.total_price, r.rental_status, r.delivery_option,
                l.brand, l.model, l.image_url
            FROM rentals r
            JOIN laptops l ON r.laptop_id = l.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `, [userId]);
        res.json(rentals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all rental transactions for admin
// @route   GET /api/rentals/admin/all
// @access  Private/Admin
const getAllRentals = async (req, res) => {
    try {
        const [rentals] = await pool.execute(`
            SELECT 
                r.id, r.start_date, r.end_date, r.total_price, r.rental_status, r.delivery_option, r.ktp_image_url,
                l.brand, l.model,
                u.name as user_name, u.email as user_email
            FROM rentals r
            JOIN laptops l ON r.laptop_id = l.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(rentals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a rental's status
// @route   PATCH /api/rentals/admin/:id/status
// @access  Private/Admin
const updateRentalStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(
            'UPDATE rentals SET rental_status = ? WHERE id = ?',
            [status, id]
        );

        if (status === 'cancelled' || status === 'completed') {
            const [rows] = await connection.execute('SELECT laptop_id FROM rentals WHERE id = ?', [id]);
            if (rows.length > 0) {
                const laptopId = rows[0].laptop_id;
                await connection.execute(
                    "UPDATE laptops SET status = 'available' WHERE id = ?",
                    [laptopId]
                );
            }
        }

        await connection.commit();
        res.json({ message: `Status penyewaan berhasil diubah menjadi ${status}` });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        connection.release();
    }
};

// ==============================================================
// == FUNGSI BARU UNTUK DELETE DITARO DI SINI ==
// ==============================================================
// @desc    Delete a rental order
// @route   DELETE /api/rentals/:id
// @access  Private
const deleteRental = async (req, res) => {
    try {
        const rentalId = req.params.id;
        const userId = req.user.id;

        // Opsi: Anda bisa menambahkan logika untuk memastikan hanya user yang bersangkutan
        // atau admin yang bisa menghapus data ini.

        const [result] = await pool.query('DELETE FROM rentals WHERE id = ? AND user_id = ?', [rentalId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data rental tidak ditemukan atau Anda tidak berhak menghapusnya.' });
        }

        res.status(200).json({ message: 'Rental berhasil dibatalkan.' });
    } catch (error) {
        console.error('Error saat membatalkan rental:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// ==============================================================
// == INI ADALAH BAGIAN module.exports ==
// Kita kumpulkan semua nama fungsi di sini agar rapi.
// ==============================================================
module.exports = {
    createRental,
    getMyRentals,
    getAllRentals,
    updateRentalStatus,
    deleteRental // <-- Tambahkan nama fungsi baru di sini
};