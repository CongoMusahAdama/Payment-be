import { verifyToken } from '../utils/jwt.js';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = await verifyToken(token);
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
