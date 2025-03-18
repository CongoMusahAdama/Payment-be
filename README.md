# Money Transfer App

## Overview
The Money Transfer App is a secure platform that enables users to send and receive funds seamlessly. Designed for both individual and business users, this application ensures robust data protection and a user-friendly experience across multiple devices.

## Features
- Secure user authentication using JWT.
- Multi-factor authentication for enhanced security.
- Integration with Paystack for payment processing.
- File upload capabilities for KYC documentation.
- Comprehensive API documentation using Swagger.
- Profile management
- Money transfer operations
- Payment withdrawal operations
- Transaction history and reporting

## Tech Stack
- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for Node.js to build APIs.
- **MongoDB**: NoSQL database for storing user and transaction data.
- **Mongoose**: ODM for MongoDB to manage data relationships.
- **Brevo**: For sending emails.
- **JWT**: For secure user authentication.
- **Swagger**: For API documentation.
- **Multer**: For handling file uploads.
- **Path**: For file path specifications.
- **Paystack**: For payment integration.
- **pdfkit** and **json2csv**: For generating downloadable reports.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/CongoMusahAdama/Payment-be
   ```
2. Navigate to the project directory:
   ```bash
   cd /payment/server (main)
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables:
   ```
   DB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
   REDIS_URL=<your-redis-url>
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## Usage
- Use Postman or Swagger UI to test the API endpoints as described in the API documentation.
- Example request to create a user:
   ```http
   POST /api/auth/register
   Content-Type: application/json

   {
       "Fullname": "Samuel Nyamekye",
       "email": "samuel@example.com",
       "password": "securepassword",
       "address": "st. gregory 123st",
       "phone": "028347757"
   }
   ```

## Project Structure
The project is organized into several directories, each serving a specific purpose:

- **server/**: Contains the main server code and configuration files.
  - **src/**: Contains the source code for the application.
    - **controllers/**: Contains the logic for handling requests and responses.
    - **models/**: Contains the data models for MongoDB.
    - **routes/**: Defines the API endpoints and their corresponding controllers.
    - **services/**: Contains business logic and interactions with the database.
    - **middleware/**: Contains middleware functions for request processing.
    - **utils/**: Contains utility functions and helpers.
  - **config/**: Contains configuration files for database connections and other settings.
  - **uploads/**: Directory for storing uploaded files.

Contributions are welcome! Please submit issues or pull requests for any enhancements or bug fixes.


## License
This project is licensed under the MIT License.

## Contact
For any inquiries, please contact congo musah adama at amusahcongo@gmail.com
