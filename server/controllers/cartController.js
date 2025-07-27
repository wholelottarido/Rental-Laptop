const pool = require('../config/db');

// @desc    Add laptop to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
    const { laptopId } = req.body;
    const userId = req.user.id; // Diambil dari token setelah login

    if (!laptopId) {
        return res.status(400).json({ message: 'Laptop ID is required' });
    }

    try {
        // Cek apakah laptop sudah ada di keranjang
        const [existing] = await pool.execute(
            'SELECT * FROM cart WHERE user_id = ? AND laptop_id = ?',
            [userId, laptopId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'Laptop sudah ada di keranjang' });
        }

        // Tambahkan ke keranjang
        await pool.execute(
            'INSERT INTO cart (user_id, laptop_id) VALUES (?, ?)',
            [userId, laptopId]
        );

        res.status(201).json({ message: 'Laptop berhasil ditambahkan ke keranjang' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's cart items
// @route   GET /api/cart
// @access  Private
exports.getCartItems = async (req, res) => {
    const userId = req.user.id;
    try {
        const [items] = await pool.execute(`
            SELECT c.id as cart_id, l.* FROM cart c
            JOIN laptops l ON c.laptop_id = l.id
            WHERE c.user_id = ?
        `, [userId]);
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:laptopId
// @access  Private
exports.removeFromCart = async (req, res) => {
    const { laptopId } = req.params;
    const userId = req.user.id;
    try {
        await pool.execute(
            'DELETE FROM cart WHERE user_id = ? AND laptop_id = ?',
            [userId, laptopId]
        );
        res.json({ message: 'Item berhasil dihapus dari keranjang' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};