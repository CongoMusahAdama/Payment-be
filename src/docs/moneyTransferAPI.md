# Money Transfer Management API Documentation

## Base URL
```
http://localhost:5000/api/transactions
```

## Test the API Using Postman

### 📌 Test Secure Fund Transfer
- **Request:** `POST /api/transactions/transfer`
- **Headers:**
  - `Content-Type: application/json`

#### Body (JSON):
```json

  {
  "amount": 14,
  "sendersId": "67e12796bffb978308c49c49",
  "recipientId": "67e159bc69a0eb546ff89e8b"
}
```

#### ✅ Expected Response (Success):
```json
{"message":"Transfer successful","transaction":{"sender":"67e159bc69a0eb546ff89e8b","recipient":"67e159bc69a0eb546ff89e8b","transactionType":"transfer","amount":14,"status":"completed","reference":"TXN-1742823737766","_id":"67e161392aee3ffd087068e6","timestamp":"2025-03-24T13:42:17.773Z","createdAt":"2025-03-24T13:42:17.774Z","updatedAt":"2025-03-24T13:42:17.774Z","__v":0}}
```

#### 🔴 If the sender has insufficient balance, it should return:
```json
{
  "message": "Insufficient funds"
}
```

---

### 📌 Test Money Request
- **Request:** `POST /api/transactions/request-money`

#### Body (JSON):
```json
{
  "recipientId": "65bcf59f123456789abcdef1",
  "requesterId": "6578858644848r4",
  "amount": 100,
  "note": "Can you send me $100?"
}
```

#### ✅ Expected Response:
```json
{"message":"Money request sent","request":{"requesterId":"67e12796bffb978308c49c49","recipientId":"67e159bc69a0eb546ff89e8b","amount":100,"status":"pending","note":"Can you send me $100?","_id":"67e1619b2aee3ffd087068eb","createdAt":"2025-03-24T13:43:55.545Z","updatedAt":"2025-03-24T13:43:55.545Z","__v":0}}
```

---

### 📌 Test Request OTP for Withdrawal
- **Request:** `POST /api/payments/withdraw/request-otp`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "amount": <amount> // Amount to withdraw
}
```
- **Response:**
  - **Success (202):**
    ```json
    {
      "message": "OTP required for withdrawal. Please verify your Paystack OTP.",
      "reference": "<reference>",
      "transfer_code": "<transfer_code>"
    }
    ```
  - **Error (400):**
    ```json
    {
      "message": "<error_message>"
    }
    ```

### 📌 Test Fetch All Money Requests
- **Request:** `GET /api/transactions/requests`
- **Headers:**
  - `Authorization: Bearer <token>`
  
#### ✅ Expected Response (Success):
```json
[
  {
    "_id": "67e1619b2aee3ffd087068eb",
    "requesterId": "67e12796bffb978308c49c49",
    "recipientId": "67e159bc69a0eb546ff89e8b",
    "amount": 100,
    "status": "pending",
    "note": "Can you send me $100?",
    "createdAt": "2025-03-24T13:43:55.545Z",
    "updatedAt": "2025-03-24T13:43:55.545Z"
  }
]
```

#### 🔴 If there are no money requests, it should return:
```json
{
  "message": "No money requests found."
}
```

---

### 📌 Test Approve Money Request
- **Request:** `POST /api/transactions/approve/{transactionId}`
- **Headers:**
  - `Authorization: Bearer <token>`
  
#### Body (JSON):
```json
{
  "transactionId": "67e1619b2aee3ffd087068eb"
}
```

#### ✅ Expected Response (Success):
```json
{
  "message": "Transaction approved successfully",
  "transaction": {
    "_id": "67e1619b2aee3ffd087068eb",
    "requesterId": "67e12796bffb978308c49c49",
    "recipientId": "67e159bc69a0eb546ff89e8b",
    "amount": 100,
    "status": "approved",
    "note": "Can you send me $100?",
    "createdAt": "2025-03-24T13:43:55.545Z",
    "updatedAt": "2025-03-24T13:43:55.545Z"
  }
}
```

#### 🔴 If the transaction is not found, it should return:
```json
{
  "message": "Money request not found"
}
```

#### 🔴 If there are insufficient funds, it should return:
```json
{
  "message": "Insufficient funds for this transaction"
}
```

- **Request:** `POST /api/payments/withdraw/verify`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "amount": <amount>, // Amount to withdraw
  "otp": "<otp>" // OTP received for verification
}
```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Withdrawal successful",
      "balance": <balance>, // User's updated balance
      "transaction": { /* transaction details */ }
    }
    ```
  - **Error (400):**
    ```json
    {
      "message": "<error_message>"
    }
    ```


- **Request:** `GET /api/transactions/history`
- **Request Body**: (No body required)
- sactionType`: The type of transaction to filter (e.g., "transfer").

#### ✅ Expected Response (Success):
```json
{"message":"Transaction history retrieved","transactions":[{"_id":"67e161392aee3ffd087068e6","sender":"67e159bc69a0eb546ff89e8b","recipient":"67e159bc69a0eb546ff89e8b","transactionType":"transfer","amount":14,"status":"completed","reference":"TXN-1742823737766","timestamp":"2025-03-24T13:42:17.773Z","createdAt":"2025-03-24T13:42:17.774Z","updatedAt":"2025-03-24T13:42:17.774Z","__v":0},{"_id":"67e15e242aee3ffd087068d3","sender":"67e159bc69a0eb546ff89e8b","recipient":"67e159bc69a0eb546ff89e8b","transactionType":"deposit","amount":300,"status":"completed","reference":"77iobwyy9v","timestamp":"2025-03-24T13:29:08.804Z","createdAt":"2025-03-24T13:29:08.806Z","updatedAt":"2025-03-24T13:29:08.806Z","__v":0},{"_id":"67e15a0169a0eb546ff89e98","sender":"67e159bc69a0eb546ff89e8b","recipient":"67e159bc69a0eb546ff89e8b","transactionType":"deposit","amount":5000,"status":"completed","reference":"t8cqa3ss3t","timestamp":"2025-03-24T13:11:29.456Z","createdAt":"2025-03-24T13:11:29.458Z","updatedAt":"2025-03-24T13:11:29.458Z","__v":0}]}
```

#### 🔴 If there are no transactions found, it should return:
```json
{
  "message": "No transactions found for the specified user id"
}
