import { verifyToken } from '../utils/jwt.js';
import User from '../models/user.js'; // Import User model

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = await verifyToken(token);

        // Fetch user from the database
        const user = await User.findById(decoded.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach full user details to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
