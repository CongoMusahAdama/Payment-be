# Payment Routes API Documentation

## 1. Deposit Funds
- **Endpoint:** `POST /api/payments/deposit`
- **Description:** Initiates a deposit of funds.
- **Headers:**
  - `Authorization: Bearer <token>` (replace `<token>` with the actual token)
- **Request Body:**
```json
{
  "amount": <amount> // Amount to deposit (e.g., 1000)
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
    {
      "message": "Payment verified",
      "payment": { /* payment details */ }
    }
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
  "amount": <amount> // Amount to withdraw (e.g., 500)
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

## 4. Webhook
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
