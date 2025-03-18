
# Project Title
Money transfer App
## Description
Money Transfer application that enables users to securely send and receive funds. Your implementation should demonstrate robust architecture, clean code practices, secure data handling, and a responsive user interface that works across multiple devices.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemailer (for sending emails)
- JWT (for authentication)
- Swagger (for API documentation)
- Multer (for file upload)
- Path (for path specification)
- Paystack (for payment integration)

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
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

6. Use Postman or Swagger UI to test the API endpoints as described in the API documentation.
