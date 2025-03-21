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

## Architecture Documentation
The Money Transfer App is designed to provide a secure platform for users to send and receive funds. The backend is built using Node.js and Express.js, with MongoDB as the database. This document outlines the key designs and trade-offs made during the development of the backend.

### Key Designs

#### 1. Tech Stack
- **Node.js**: Utilized for building server-side applications, allowing for asynchronous processing.
- **Express.js**: A web framework that simplifies API development and routing.
- **MongoDB**: A NoSQL database chosen for its flexibility in handling user and transaction data.
- **Mongoose**: An ODM used to manage data relationships and schema validation.

#### 2. Project Structure
The project is organized into several directories:
- **controllers/**: Contains logic for handling requests and responses.
- **models/**: Defines data models for MongoDB.
- **routes/**: Specifies API endpoints and their corresponding controllers.
- **services/**: Contains business logic and database interactions.
- **middleware/**: Includes middleware functions for request processing.
- **utils/**: Contains utility functions and helpers.

#### 3. Security Features
- **JWT Authentication**: Secure user authentication is implemented using JSON Web Tokens.
- **Multi-Factor Authentication**: Enhances security by requiring additional verification steps.

#### 4. API Documentation
- **Swagger Integration**: API endpoints are documented using Swagger, providing clear usage instructions for developers.

### Trade-offs

#### 1. NoSQL Database
Using MongoDB allows for flexible data models, but it may introduce challenges in ensuring data consistency and relationships.

#### 2. Middleware Usage
Middleware functions simplify route handling but can add complexity if not managed properly.

#### 3. File Upload Handling
The application supports file uploads for KYC documentation, which adds functionality but requires careful management of file storage and security.

#### 4. Data Validation
While the current implementation handles basic error checking, more extensive validation could enhance robustness and prevent issues with invalid data.

## Conclusion
The architecture of the Money Transfer App backend is designed to provide a secure, flexible, and user-friendly experience. The choices made in technology, structure, and security reflect a balance between functionality and maintainability.


## Architecture Documentation
The Money Transfer App is designed to provide a secure platform for users to send and receive funds. The backend is built using Node.js and Express.js, with MongoDB as the database. This document outlines the key designs and trade-offs made during the development of the backend.

### Key Designs

#### 1. Tech Stack
- **Node.js**: Utilized for building server-side applications, allowing for asynchronous processing.
- **Express.js**: A web framework that simplifies API development and routing.
- **MongoDB**: A NoSQL database chosen for its flexibility in handling user and transaction data.
- **Mongoose**: An ODM used to manage data relationships and schema validation.

#### 2. Project Structure
The project is organized into several directories:
- **controllers/**: Contains logic for handling requests and responses.
- **models/**: Defines data models for MongoDB.
- **routes/**: Specifies API endpoints and their corresponding controllers.
- **services/**: Contains business logic and database interactions.
- **middleware/**: Includes middleware functions for request processing.
- **utils/**: Contains utility functions and helpers.

#### 3. Security Features
- **JWT Authentication**: Secure user authentication is implemented using JSON Web Tokens.
- **Multi-Factor Authentication**: Enhances security by requiring additional verification steps.

#### 4. API Documentation
- **Swagger Integration**: API endpoints are documented using Swagger, providing clear usage instructions for developers.

### Trade-offs

#### 1. NoSQL Database
Using MongoDB allows for flexible data models, but it may introduce challenges in ensuring data consistency and relationships.

#### 2. Middleware Usage
Middleware functions simplify route handling but can add complexity if not managed properly.

#### 3. File Upload Handling
The application supports file uploads for KYC documentation, which adds functionality but requires careful management of file storage and security.

#### 4. Data Validation
While the current implementation handles basic error checking, more extensive validation could enhance robustness and prevent issues with invalid data.

## Conclusion
The architecture of the Money Transfer App backend is designed to provide a secure, flexible, and user-friendly experience. The choices made in technology, structure, and security reflect a balance between functionality and maintainability.


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




## License
This project is licensed under the MIT License.

## Contact
For any inquiries, please contact congo musah adama at amusahcongo@gmail.com
