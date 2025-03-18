import authService from '../services/authService.js'; 
import { sendVerificationCode } from '../config/mfa.js'; 
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../config/redisClient.js';


class UserController {
    
    async register(req, res) {
        const { Fullname, email, password, phone, address } = req.body;
    
        try {
            const newUser = await authService.register(Fullname, email, password, phone, address); // Pass all fields
    
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const token = await authService.login(email, password);

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
            const newToken = await authService.refreshToken(refreshToken);

            res.json({ token: newToken });
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    }

    async logout(req, res) {
        // Logic to handle user logout
        res.status(200).json({ message: 'User logged out successfully' });
    }

   // MULTI-FACTOR AUTHENTICATION
      // Step 1: Send OTP via Email
      async mfaSetup(req, res) {
        const { email } = req.body;
    
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }
    
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    
        // Store OTP in Redis (expires in 5 minutes)
        await redisClient.setEx(`mfa_${email}`, 300, verificationCode.toString()); 

    
        // Send OTP via email
        await sendVerificationCode(email, verificationCode);
    
        res.status(200).json({ message: "MFA setup initiated, verification code sent" });
      }
    
      // Step 2: Verify OTP
      async mfaVerify(req, res) {
        const { email, code } = req.body;
    
        if (!email || !code) {
          return res.status(400).json({ message: "Email and verification code are required" });
        }
    
        // Retrieve stored OTP from Redis
        const storedCode = await redisClient.get(`mfa_${email}`);
    
        if (!storedCode || storedCode !== code) {
          return res.status(400).json({ message: "Invalid or expired verification code" });
        }
    
        // OTP is correct - delete from Redis (so it can't be reused)
        await redisClient.del(`mfa_${email}`);
    
        res.status(200).json({ message: "MFA verification successful" });
      }
    }
    



export default new UserController();
