import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Format header biasanya: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: false,
            message: "Access denied. No token provided."
        });
    }

    try {
        const secret = process.env.JWT_SECRET || 'default_secret_fallback';
        const decoded = jwt.verify(token, secret);
        
        // Simpan data payload token (id, email, role) ke req.user
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            status: false,
            message: "Invalid or expired token.",
            error: error.message
        });
    }
};