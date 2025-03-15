# User Management API Documentation

## 1. User Registration
- **Endpoint**: `POST /api/users/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  - **201 Created**: 
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "hashedpassword"
      }
    }
    ```
  - **400 Bad Request**: 
    ```json
    {
      "message": "User already exists"
    }
    ```

## 2. User Login
- **Endpoint**: `POST /api/users/login`
- **Description**: Authenticates a user and returns a token.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  - **200 OK**: 
    ```json
    {
      "token": "your_jwt_token",
      "refreshToken": "your_refresh_token"
    }
    ```
  - **400 Bad Request**: 
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

## 3. Refresh Token
- **Endpoint**: `POST /api/users/refresh-token`
- **Description**: Refreshes the authentication token.
- **Request Body**:
  ```json
  {
    "refreshToken": "your_refresh_token"
  }
  ```
- **Response**:
  - **200 OK**: 
    ```json
    {
      "token": "new_jwt_token"
    }
    ```
  - **401 Unauthorized**: 
    ```json
    {
      "message": "Refresh token is required"
    }
    ```

## 4. User Logout
- **Endpoint**: `POST /api/users/logout`
- **Description**: Logs out the user and invalidates the token.
- **Request Body**: (No body required)
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "User logged out successfully"
    }
    ```

## 5. MFA Setup
- **Endpoint**: `POST /api/users/mfa-setup`
- **Description**: Initiates the MFA setup process by sending a verification code to the user.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "MFA setup initiated, verification code sent"
    }
    ```

## 6. MFA Verification
- **Endpoint**: `POST /api/users/mfa-verify`
- **Description**: Verifies the provided MFA code.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "code": "123456" // Replace with the actual code sent to the user
  }
  ```
- **Response**:
  - **200 OK**: 
    ```json
    {
      "message": "MFA verification successful"
    }
    ```
  - **400 Bad Request**: 
    ```json
    {
      "message": "Invalid verification code"
    }
    ```

## Testing Instructions
1. Open Postman.
2. Create a new request for each endpoint listed above.
3. Set the request method (GET, POST) and enter the URL (e.g., `http://localhost:5000/api/users/register`).
4. In the request body, select "raw" and set the type to "JSON" to input the JSON data.
5. Send the request and observe the response.
