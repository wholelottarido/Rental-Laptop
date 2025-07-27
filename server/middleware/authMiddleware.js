const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user info (id, role) to the request object
            req.user = decoded; 
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token tidak valid, otorisasi gagal' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Tidak ada token, otorisasi gagal' });
    }
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak, hanya untuk admin' });
    }
};
