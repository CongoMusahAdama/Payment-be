import express from 'express';
import cors from 'cors'; // Import CORS
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import setupSwagger from './src/utils/swagger.js'; 
import transactionRoutes from "./src/routes/transactionRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js"
import reportRoutes from "./src/routes/reportRoutes.js"
const app = express();


// Configure CORS for Local & Deployed Frontend
const allowedOrigins = [
    "http://localhost:5173", // Local frontend (during development)
    "https://your-frontend-domain.com", // Deployed frontend (replace when live)
    "https://payment-be-3tc2.onrender.com", // Backend itself (for Swagger)
  ];
  
  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true, 
    })
  );
  
  // Allow Preflight Requests for All Routes 
  app.options("*", cors());
  

// Connect to the database
connectDB();



// Middleware
app.use(express.json());



setupSwagger(app); // Setup Swagger documentation

//ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`); // Log Swagger URL
});
