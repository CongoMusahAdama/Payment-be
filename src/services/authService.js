import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
    constructor() {
        this.invalidatedTokens = new Set(); // Store invalidated tokens
    }

    
    
async register(Fullname, email, password, phone, address) {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ Fullname, email, password: hashedPassword, phone, address });

        await newUser.save();
        return newUser;
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    }

    async refreshToken(refreshToken) {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return reject('Invalid refresh token');
                }
                const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                resolve(newToken);
            });
        });
    }
    
    async logout(token) {
        // Logic to invalidate the user's token
        this.invalidatedTokens.add(token); // Add token to the invalidated tokens set
        return { message: 'User logged out successfully' };
    }
}

export default new UserService();
