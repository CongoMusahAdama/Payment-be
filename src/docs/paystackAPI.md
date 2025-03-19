# Paystack API Documentation for Testing

## 1. Initialize Payment
- **Endpoint:** `POST /transaction/initialize`
- **Description:** Initializes a payment with Paystack.
- **Headers:**
  - `Authorization: Bearer <PAYSTACK_SECRET_KEY>` (replace `<PAYSTACK_SECRET_KEY>` with your actual Paystack secret key)
- **Request Body:**
```json
{
  "email": "<user_email>", // User's email address
  "amount": <amount>, // Amount to be charged (in kobo)
  "callback_url": "<callback_url>" // URL to redirect after payment
}
```
- **Response:**
  - **Success (200):**
    ```json
    {
      "status": true,
      "message": "Payment initialized successfully",
      "data": {
        "authorization_url": "<payment_link>", // Link to complete the payment
        "reference": "<payment_reference>" // Unique reference for the transaction
      }
    }
    ```
  - **Error (400):**
    ```json
    {
      "status": false,
      "message": "<error_message>"
    }
    ```

### Testing with Postman:
- **Method**: `POST`
- **URL**: `https://api.paystack.co/transaction/initialize`
- **Headers**: 
  - `Authorization: Bearer <PAYSTACK_SECRET_KEY>`
- **Body**:
```json
{
  "email": "user@example.com",
  "amount": 10000, // Amount in kobo (e.g., 10000 for 100 NGN)
  "callback_url": "http://localhost:3000/payment-success"
}
```

## 2. Verify Payment
- **Endpoint:** `GET /transaction/verify/:reference`
- **Description:** Verifies a payment using the transaction reference.
- **Headers:**
  - `Authorization: Bearer <PAYSTACK_SECRET_KEY>`
- **Parameters:**
  - `reference`: The unique reference of the payment to verify.
- **Response:**
  - **Success (200):**
    ```json
    {
      "status": true,
      "data": {
        "status": "success", // Payment status
        "reference": "<payment_reference>", // Reference of the payment
        // Additional payment details
      }
    }
    ```
  - **Error (404):**
    ```json
    {
      "status": false,
      "message": "Payment not found"
    }
    ```

### Testing with Postman:
- **Method**: `GET`
- **URL**: `https://api.paystack.co/transaction/verify/<reference>`
- **Headers**: 
  - `Authorization: Bearer <PAYSTACK_SECRET_KEY>`

## 3. Process Withdrawal
- **Endpoint:** `POST /transfer`
- **Description:** Processes a withdrawal to a recipient.
- **Headers:**
  - `Authorization: Bearer <PAYSTACK_SECRET_KEY>`
- **Request Body:**
```json
{
  "source": "balance",
  "reason": "Withdrawal",
  "amount": <amount>, // Amount to withdraw (in kobo)
  "recipient": "<recipient_code>" // Code of the recipient
}
```
- **Response:**
  - **Success (200):**
    ```json
    {
      "status": true,
      "data": {
        "reference": "<withdrawal_reference>", // Reference for the withdrawal
        // Additional withdrawal details
      }
    }
    ```
  - **Error (400):**
    ```json
    {
      "status": false,
      "message": "<error_message>"
    }
    ```

### Testing with Postman:
- **Method**: `POST`
- **URL**: `https://api.paystack.co/transfer`
- **Headers**: 
  - `Authorization: Bearer <PAYSTACK_SECRET_KEY>`
- **Body**:
```json
{
  "source": "balance",
  "reason": "Withdrawal",
  "amount": 50000, // Amount in kobo (e.g., 50000 for 500 NGN)
  "recipient": "recipient_code_here"
}
