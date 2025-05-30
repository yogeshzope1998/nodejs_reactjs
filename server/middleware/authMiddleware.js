const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Try to get token from cookies first
    const cookieToken = req.cookies?.token;
    // Fall back to Authorization header for backward compatibility
    const headerToken = req.header('Authorization');
    
    const token = cookieToken || headerToken;
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;