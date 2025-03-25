# Payment Routes API Documentation

## 1. Deposit Funds
- **Endpoint:** `POST /api/payments/deposit`
- **Description:** Initiates a deposit of funds.
- **Headers:**
  - `Authorization: Bearer <token>` (replace `<token>` with the actual token)
- **Request Body:**
```json
{
 "email":"youremail@gmail.com",
  "amount": 300
}
```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Payment initiated",
      "paymentLink": "<payment_link>" // Link to complete the payment
    }
    ```
  - **Error (400):**
    ```json
    {
      "message": "<error_message>"
    }
    ```

## 2. Verify Deposit
- **Endpoint:** `GET /api/payments/verify`
- **Description:** Verifies a deposit using a reference.
- **Query Parameters:**
  - `reference=<reference>` (the reference of the payment to verify)
- **Response:**
  - **Success (200):**
    ```json
   {"message":"Payment verified","payment":{"_id":"67e15db32aee3ffd087068cc","user":"67e159bc69a0eb546ff89e8b","amount":300,"paymentMethod":"paystack","status":"completed","reference":"77iobwyy9v","createdAt":"2025-03-24T13:27:15.954Z","updatedAt":"2025-03-24T13:29:08.177Z","__v":0}}
    ```
  - **Error (400):**
    ```json
    {
      "message": "<error_message>"
    }
    ```

## 3. Withdraw Funds
- **Endpoint:** `POST /api/payments/withdraw`
- **Description:** Initiates a withdrawal of funds.
- **Headers:**
  - `Authorization: Bearer <token>` (replace `<token>` with the actual token)
- **Request Body:**
```json
{
  "recipientCode": "<recipient_code>", // Code of the recipient
  "amount": <amount>, // Amount to withdraw (e.g., 500)
}
```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Withdrawal initiated",
      "withdrawal": { /* withdrawal details */ }
    }
    ```
  - **Error (400):**
    ```json
    {
      "message": "<error_message>"
    }
    ```

## 4. Get User Balance
- **Endpoint:** `GET /api/payments/balance`
- **Description:** Retrieves the current balance of the user.
- **Headers:**
  - `Authorization: Bearer <token>` (replace `<token>` with the actual token)
- **Response:**
  - **Success (200):**
    ```json
    {
      "balance": <balance> // User's current balance
    }
    ```
  - **Error (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
  - **Error (500):**
    ```json
    {
      "message": "Internal server error"
    }
    ```

## 5. Webhook
- **Endpoint:** `POST /api/payments/webhook`
- **Description:** Handles webhook notifications from Paystack for payment status updates.
- **Request Body:**
```json
{
  "event": "<event_type>", // Type of the event (e.g., charge.success)
  "data": {
    "reference": "<payment_reference>" // Reference of the payment
    // Additional data depending on the event type
  }
}
```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Webhook processed successfully"
    }
    ```
  - **Error (400):**
    ```json
    {
      "message": "Invalid webhook payload"
    }
    ```

## Testing Paystack Functions with Postman

### To Test Deposit:
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/payments/deposit`
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Body**:
```json
{
  "amount": 1000,
  "currency": "NGN"
}
```

### To Test Verify Deposit:
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/payments/verify?reference=<reference>`
- **Response**: 
  - Replace `<reference>` with the actual payment reference.

### To Test Withdraw:
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/payments/withdraw`
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Body**:
```json
{
  
  "amount": 500
 
}
```

### To Test Get User Balance:
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/payments/balance`
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success (200)**:
    ```json
    {
      "balance": <balance> // User's current balance
    }
