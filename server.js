import express from 'express';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';

const app = express();

// Connect to the database
connectDB();



// Middleware
app.use(express.json());



// Define routes here (to be added later)
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
