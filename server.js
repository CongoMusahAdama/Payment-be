import express from 'express';
import cors from 'cors'; // Import CORS
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import setupSwagger from './src/utils/swagger.js'; 
import transactionRoutes from "./src/routes/transactionRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

const app = express();

// Fix CORS to allow Frontend & Public API Access
const allowedOrigins = [
    "http://localhost:5173", // Local frontend (during development)
    "https://67e65fa0167728d915b7736c--kaleidoscopic-entremet-145d98.netlify.app", // Netlify frontend URL
    "https://payment-be-3tc2.onrender.com" // Backend URL (Render)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin); // Debugging
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials like cookies or auth headers
  })
);

// Ensure preflight requests are handled
app.options("*", cors());

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
