import User from '../models/user.js'; 
import Wallet from '../models/wallet.js';  // ✅ Import Wallet model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserService {
    constructor() {
        this.invalidatedTokens = new Set(); // Store invalidated tokens
    }


    async register(Fullname, email, password, phone, address) {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({ Fullname, email, password: hashedPassword, phone, address });
        await newUser.save();

        // ✅ Automatically create wallet for the user
        const newWallet = new Wallet({ user: newUser._id, balance: 0 });
        await newWallet.save();

        return newUser; // Return the user object
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
