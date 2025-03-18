# Money Transfer Management API Documentation

## Base URL
```
http://localhost:5000/api/transactions
```

## Test the API Using Postman

### 📌 Test Secure Fund Transfer
- **Request:** `POST /api/transactions/transfer`

#### Body (JSON):
```json
{
  "recipientId": "65bcf59f123456789abcdef1",
  "senderId": "65bcf59f123456789abcdef1",
  "amount": 50
}
```

#### ✅ Expected Response (Success):
```json
{
  "message": "Transfer successful",
  "transaction": {
    "sender": "65bcf59f123456789abcdef0",
    "recipient": "65bcf59f123456789abcdef1",
    "amount": 50,
    "status": "completed",
    "reference": "TXN-1710874456789"
  }
}
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
  "amount": 100,
  "note": "Can you send me $100?"
}
```

#### ✅ Expected Response:
```json
{
  "message": "Money request sent",
  "request": {
    "sender": "65bcf59f123456789abcdef0",
    "recipient": "65bcf59f123456789abcdef1",
    "amount": 100,
    "status": "pending",
    "reference": "REQ-1710874456789"
  }
}
```

---

### 📌 Test Get Transaction History
- **Request:** `GET /api/transactions/history`
- **Query Parameters:**
  - `startDate`: The start date for filtering transactions (format: YYYY-MM-DD).
  - `endDate`: The end date for filtering transactions (format: YYYY-MM-DD).
  - `transactionType`: The type of transaction to filter (e.g., "transfer").

#### Example Request:
```
GET /api/transactions/history?startDate=2024-03-01&endDate=2024-03-14&transactionType=transfer
```

#### ✅ Expected Response (Success):
```json
{
  "message": "Transaction history retrieved",
  "transactions": [
    {
      "_id": "65bcf59f123456789abcdef0",
      "sender": "65bcf59f123456789abcdef1",
      "recipient": "65bcf59f123456789abcdef2",
      "amount": 100,
      "transactionType": "transfer",
      "status": "completed",
      "reference": "TXN-1710874456789",
      "createdAt": "2024-03-14T12:00:00Z"
    }
  ]
}
```

#### 🔴 If there are no transactions found, it should return:
```json
{
  "message": "No transactions found for the specified criteria"
}
