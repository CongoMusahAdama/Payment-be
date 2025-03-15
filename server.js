import express from 'express';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import setupSwagger from './src/utils/swagger.js'; // Import Swagger setup


const app = express();

// Connect to the database
connectDB();



// Middleware
app.use(express.json());



setupSwagger(app); // Setup Swagger documentation

app.use('/api/users', authRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`); // Log Swagger URL
});
