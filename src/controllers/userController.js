import userService from '../services/userService.js';
import { v4 as uuidv4 } from 'uuid';

class UserController {
    
    async register(req, res) {
        const { name, email, password } = req.body;
        try {
            const newUser = await userService.register(name, email, password);
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const token = await userService.login(email, password);
            const refreshToken = uuidv4(); // Generate a new refresh token
            res.json({ token, refreshToken });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        try {
            const newToken = await userService.refreshToken(refreshToken);
            res.json({ token: newToken });
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    }

    async logout(req, res) {
        // Logic to handle user logout
        res.status(200).json({ message: 'User logged out successfully' });
    }

//MULTI-FACTOR AUTHENTICATION
    async mfaSetup(req, res) {
        const { email } = req.body; // Assuming email is sent for MFA setup
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code

        // Store the verification code temporarily (in-memory or database)
        // For simplicity, we'll just log it here
        console.log(`MFA Code for ${email}: ${verificationCode}`);

        // Here you would send the verification code to the user via email/SMS
        res.status(200).json({ message: 'MFA setup initiated, verification code sent' });
    }


    async mfaVerify(req, res) {
        const { email, code } = req.body; // Assuming email and code are sent for verification

        // Logic to verify the code (this should check against the stored code)
        // For simplicity, we'll assume the code is always correct
        // In a real implementation, you would compare the provided code with the stored one
        if (code === '123456') { // Replace with actual verification logic
            res.status(200).json({ message: 'MFA verification successful' });
        } else {
            res.status(400).json({ message: 'Invalid verification code' });
        }
    }

}

export default new UserController();
