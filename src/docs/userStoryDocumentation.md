# User Story Documentation for API Endpoints

## 1. Deposit Funds
- **Endpoint:** `POST /api/deposit`
- **Required Fields:**
  - `amount`: Number (required)
- **Expected Response:**
  - Success: `{ message: "Deposit initiated successfully", reference, authorizationUrl }`
  - Error: `{ message: "User email is required for payment" }`

## 2. Verify Deposit
- **Endpoint:** `GET /api/verify-deposit`
- **Required Fields:**
  - `reference`: String (required)
- **Expected Response:**
  - Success: `{ message: "Payment verified", payment }`
  - Error: `{ message: "Reference is required" }`

## 3. Withdraw Funds
- **Endpoint:** `POST /api/withdraw`
- **Required Fields:**
  - `recipientCode`: String (required)
  - `amount`: Number (required)
- **Expected Response:**
  - Success: `{ message: "Withdrawal initiated", withdrawal, balance: userBalance }`
  - Error: `{ message: "Please wait to verify your transfer verification pin from." }`

## 4. Transfer Funds
- **Endpoint:** `POST /api/transfer`
- **Required Fields:**
  - `recipientId`: String (required)
  - `amount`: Number (required)
- **Expected Response:**
  - Success: `{ message: "Transfer successful", transaction }`
  - Error: `{ message: "Invalid recipient ID format" }`

## 5. Request Money
- **Endpoint:** `POST /api/request-money`
- **Required Fields:**
  - `recipientId`: String (required)
  - `requesterId`: String (optional, can be derived from JWT)
  - `amount`: Number (required)
  - `note`: String (optional)
- **Expected Response:**
  - Success: `{ message: "Money request sent", request: moneyRequest }`
  - Error: `{ message: error.message }`

## 6. Get User Balance
- **Endpoint:** `GET /api/balance`
- **Required Fields:**
  - None (user ID is derived from JWT)
- **Expected Response:**
  - Success: `{ message: "User balance retrieved", balance }`
  - Error: `{ message: "Unable to retrieve user balance" }`

## 7. Retrieve User Transaction History
- **Endpoint:** `GET /api/transactions`
- **Required Fields:**
  - None (user ID is derived from JWT)
- **Expected Response:**
  - Success: `{ message: "Transaction history retrieved", transactions }`
  - Error: `{ message: error.message }`
