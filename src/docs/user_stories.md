# User Stories Documentation

## Authentication

### 1. User Registration
- **As a new user**, I want to register for an account so that I can access the app's features.
  - **Acceptance Criteria:**
    - I can register by sending a POST request to `/api/auth/register` with my full name, email, password, phone, and address.
    - I receive a success message confirming my registration.

### 2. User Login
- **As a user**, I want to log in to my account so that I can access my profile and perform transactions.
  - **Acceptance Criteria:**
    - I can log in by sending a POST request to `/api/auth/login` with my email and password.
    - I receive a token and a refresh token upon successful login.

### 3. Token Refresh
- **As a user**, I want to refresh my session token so that I can stay logged in without having to log in again.
  - **Acceptance Criteria:**
    - I can refresh my token by sending a POST request to `/api/auth/refresh-token` with my refresh token.
    - I receive a new session token.

### 4. User Logout
- **As a user**, I want to log out of my account so that my session is terminated.
  - **Acceptance Criteria:**
    - I can log out by sending a POST request to `/api/auth/logout`.
    - I receive a success message confirming my logout.

### 5. Multi-Factor Authentication Setup
- **As a user**, I want to set up multi-factor authentication (MFA) for added security on my account.
  - **Acceptance Criteria:**
    - I can initiate MFA setup by sending a POST request to `/api/auth/mfa-setup` with my email.
    - I receive a verification code via email.

### 6. Multi-Factor Authentication Verification
- **As a user**, I want to verify my MFA code to complete the setup process.
  - **Acceptance Criteria:**
    - I can verify my MFA code by sending a POST request to `/api/auth/mfa-verify` with my email and the verification code.
    - I receive a success message confirming that MFA verification was successful.

## Payments

### 1. Deposit Funds
- **As a user**, I want to deposit funds into my wallet so that I can use them for transactions.
  - **Acceptance Criteria:**
    - I can initiate a deposit by sending a POST request to `/api/payments/deposit` with the amount.
    - I receive a reference and authorization URL to complete the deposit.

### 2. Verify Deposit
- **As a user**, I want to verify my deposit so that I can confirm that the funds have been added to my wallet.
  - **Acceptance Criteria:**
    - I can verify a deposit by sending a GET request to `/api/payments/verify` with the payment reference.
    - I receive a success message with the payment details if the verification is successful.

### 3. Withdraw Funds
- **As a user**, I want to withdraw funds from my wallet so that I can access my money.
  - **Acceptance Criteria:**
    - I can initiate a withdrawal by sending a POST request to `/api/payments/withdraw` with the recipient code and amount.
    - I receive a success message confirming the withdrawal, along with my updated balance.

### 4. Get User Balance
- **As a user**, I want to check my wallet balance so that I know how much money I have available.
  - **Acceptance Criteria:**
    - I can retrieve my balance by sending a GET request to `/api/payments/balance`.
    - I receive a success message with my current balance.

### 5. Handle Webhook Notifications
- **As a user**, I want to ensure that my payment status is updated automatically when a webhook notification is received from the payment provider.
  - **Acceptance Criteria:**
    - The server processes webhook notifications from the payment provider to update payment statuses accordingly.

## Transactions

### 1. Transfer Funds
- **As a user**, I want to transfer funds to another user so that I can send money easily.
  - **Acceptance Criteria:**
    - I can initiate a transfer by sending a POST request to `/api/transactions/transfer` with the recipient ID and amount.
    - I receive a success message confirming the transfer along with transaction details.

### 2. Request Money
- **As a user**, I want to request money from another user so that I can receive funds.
  - **Acceptance Criteria:**
    - I can send a money request by sending a POST request to `/api/transactions/request-money` with the recipient ID, requester ID, amount, and note.
    - I receive a success message indicating that the money request has been sent.

### 3. Get Transaction History
- **As a user**, I want to view my transaction history so that I can keep track of my financial activities.
  - **Acceptance Criteria:**
    - I can retrieve my transaction history by sending a GET request to `/api/transactions/history`.
    - I receive a success message with a list of my transactions.

## Reports

### 1. Download Transaction Report
- **As a user**, I want to download my transaction history as a report so that I can keep a record of my financial activities.
  - **Acceptance Criteria:**
    - I can request a transaction report by sending a GET request to `/api/reports/download` with optional query parameters for filters and format (PDF or CSV).
    - I receive the report in the requested format if transactions are found.
