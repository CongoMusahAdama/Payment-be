# Money Transfer App
# Overview
The Money Transfer App is a secure platform that enables users to send and receive funds seamlessly. Designed for both individual and business users, this application ensures robust data protection and a user-friendly experience across multiple devices.

# Features
- Secure user authentication using JWT.
- Multi-factor authentication for enhanced security.
- Integration with Paystack for payment processing.
- File upload capabilities for KYC documentation.
- Comprehensive API documentation using Swagger.
- Profile management
- Money transfer operations
- Transaction history and reporting

# Payment Integration & OTP Handling
This project integrates Paystack for payments, as it supports both card payments and mobile money transfers. Currently, the system is running in test mode, meaning:

- All transactions are simulated and do not involve real money.

- OTP for withdrawals and MFA verification will be received only by the account owner (me) due to Paystack's test mode limitations.

- For email-based MFA, we are using Brevo. Similar to Paystack, MFA email verification is currently configured to send OTPs to the admin account.

 *For now*, any withdrawal or payment made in the system is purely for testing purposes due to project timeline and document requiremnent.

 -  Once we move to live mode, OTPs will be sent directly to the users.



# Tech Stack
- Node.js: JavaScript runtime for building server-side applications.
- Express.js: Web framework for Node.js to build APIs.
- MongoDB: NoSQL database for storing user and transaction data.
- Mongoose: ODM for MongoDB to manage data relationships.
- Brevo: For sending emails.
- JWT: For secure user authentication.
- Swagger: For API documentation.
- Multer: For handling file uploads.
- Path: For file path specifications.
- Paystack: For payment integration.
- pdfkit and json2csv: For generating downloadable reports.

# Setup Instructions
Clone the repository:
- git clone https://github.com/CongoMusahAdama/Payment-be

Navigate to the project directory:
- cd /payment/server (main)

Install the dependencies:
- npm install

Create a .env file in the root directory and add your environment variables:
DB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
REDIS_URL=<your-redis-url>

# Start the server:
- npm run dev

 # Usage
Use Postman or Swagger UI to test the API endpoints as described in the API documentation.
Example request to create a user:
POST /api/auth/register
Content-Type: application/json

{
    "Fullname": "Samuel Nyamekye",
    "email": "samuel@example.com",
    "password": "securepassword",
    "address": "st. gregory 123st",
    "phone": "028347757"
}

# User Stories Documentation

# Authentication
1. User Registration
As a new user, I want to register for an account so that I can access the app's features.

- Acceptance Criteria:
I can register by sending a POST request to /api/auth/register with my full name, email, password, phone, and address.
I receive a success message confirming my registration.

2. User Login
As a user, I want to log in to my account so that I can access my profile and perform transactions.

- Acceptance Criteria:
I can log in by sending a POST request to /api/auth/login with my email and password.
I receive a token and a refresh token upon successful login.

3. Token Refresh
As a user, I want to refresh my session token so that I can stay logged in without having to log in again.

- Acceptance Criteria:
I can refresh my token by sending a POST request to /api/auth/refresh-token with my refresh token.
I receive a new session token.

4. User Logout
As a user, I want to log out of my account so that my session is terminated.

- Acceptance Criteria:
I can log out by sending a POST request to /api/auth/logout.
I receive a success message confirming my logout.

5. Multi-Factor Authentication Setup
As a user, I want to set up multi-factor authentication (MFA) for added security on my account.

- Acceptance Criteria:
I can initiate MFA setup by sending a POST request to /api/auth/mfa-setup with my email.
I receive a verification code via email.

6. Multi-Factor Authentication Verification
As a user, I want to verify my MFA code to complete the setup process.

- Acceptance Criteria:
I can verify my MFA code by sending a POST request to /api/auth/mfa-verify with my email and the verification code.
I receive a success message confirming that MFA verification was successful.

# Payments
1. Deposit Funds
As a user, I want to deposit funds into my wallet so that I can use them for transactions.

- Acceptance Criteria:
I can initiate a deposit by sending a POST request to /api/payments/deposit with the amount.
I receive a reference and authorization URL to complete the deposit.

2. Verify Deposit
As a user, I want to verify my deposit so that I can confirm that the funds have been added to my wallet.

- Acceptance Criteria:
I can verify a deposit by sending a GET request to /api/payments/verify with the payment reference.
I receive a success message with the payment details if the verification is successful.

3. Withdraw Funds
As a user, I want to withdraw funds from my wallet so that I can access my money.

- Acceptance Criteria:
I can initiate a withdrawal by requesting an otp by sending a post request to api/payments/withdraw/request-otp with the amount, after getting the otp, i will verify the otp and process with withdrawal by sending a post request to /api/payments/withdraw/verify-otp
I receive a success message confirming the withdrawal, along with my updated balance.

4. Get User Balance
As a user, I want to check my wallet balance so that I know how much money I have available.

- Acceptance Criteria:
I can retrieve my balance by sending a GET request to /api/payments/balance.
I receive a success message with my current balance.

5. Handle Webhook Notifications
As a user, I want to ensure that my payment status is updated automatically when a webhook notification is received from the payment provider.

- Acceptance Criteria:
The server processes webhook notifications from the payment provider to update payment statuses accordingly.

# Transactions
1. Transfer Funds
As a user, I want to transfer funds to another user so that I can send money easily.

- Acceptance Criteria:
I can initiate a transfer by sending a POST request to /api/transactions/transfer with the recipient ID and amount.
I receive a success message confirming the transfer along with transaction details.

2. Request Money
As a user, I want to request money from another user so that I can receive funds.

- Acceptance Criteria:
I can send a money request by sending a POST request to /api/transactions/request-money with the recipient ID, requester ID, amount, and note.
I receive a success message indicating that the money request has been sent.

3. Get Transaction History
As a user, I want to view my transaction history so that I can keep track of my financial activities.

- Acceptance Criteria:
I can retrieve my transaction history by sending a GET request to /api/transactions/history.
I receive a success message with a list of my transactions.
Reports

4. Fetch all money requested
As a user, i want to fetch all the money i requested from others.

- Acceptance Criteri:
I can fetch all money requested so that i can keep track of records by sending a get request to /api/transactions/fetcAllMoneyRequest.
I have a sucess message with a list of all the money i have requested.

5. Approved Money requested
As a user, i want to approve all pending money being requested from me by other users.

- Acceptance Criteria:
I can accept money requested by sending a request to /api/transactions/approved with the transaction id.
I have a success message being money request approved.

# Transactio Reports
1. Download Transaction Report
As a user, I want to download my transaction history as a report so that I can keep a record of my financial activities.

- Acceptance Criteria:
I can request a transaction report by sending a GET request to /api/reports/download with optional query parameters for filters and format (PDF or CSV).
I receive the report in the requested format if transactions are found.

# Architecture Documentation
The Money Transfer App is designed to provide a secure platform for users to send and receive funds. The backend is built using Node.js and Express.js, with MongoDB as the database. This document outlines the key designs and trade-offs made during the development of the backend.

# Key Designs
1. Tech Stack
Node.js: Utilized for building server-side applications, allowing for asynchronous processing.
Express.js: A web framework that simplifies API development and routing.
MongoDB: A NoSQL database chosen for its flexibility in handling user and transaction data.
Mongoose: An ODM used to manage data relationships and schema validation.

2. Project Structure
_ The project is organized into several directories:
controllers/: Contains logic for handling requests and responses.
models/: Defines data models for MongoDB.
routes/: Specifies API endpoints and their corresponding controllers.
services/: Contains business logic and database interactions.
middleware/: Includes middleware functions for request processing.
utils/: Contains utility functions and helpers.

3. Security Features
JWT Authentication: Secure user authentication is implemented using JSON Web Tokens.
Multi-Factor Authentication: Enhances security by requiring additional verification steps.

4. API Documentation
Swagger Integration: API endpoints are documented using Swagger, providing clear usage instructions for developers.

# Trade-offs
1. NoSQL Database
Using MongoDB allows for flexible data models, but it may introduce challenges in ensuring data consistency and relationships.

2. Middleware Usage
Middleware functions simplify route handling but can add complexity if not managed properly.

3. File Upload Handling
The application supports file uploads for KYC documentation, which adds functionality but requires careful management of file storage and security.

4. Data Validation
While the current implementation handles basic error checking, more extensive validation could enhance robustness and prevent issues with invalid data.

# Conclusion
The architecture of the Money Transfer App backend is designed to provide a secure, flexible, and user-friendly experience. The choices made in technology, structure, and security reflect a balance between functionality and maintainability.

# License
This project is licensed under the MIT License.

# Contact
For any inquiries, please contact Congo Musah Adama at amusahcongo@gmail.com
