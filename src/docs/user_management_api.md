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

## Testing Instructions for User Management API

### User Registration
1. Open Postman.
2. Create a new request for the user registration endpoint.
3. Set the request method to POST and enter the URL: `http://localhost:5000/api/users/register`.
4. In the request body, select "raw" and set the type to "JSON" to input the following JSON data:
   ```json
   {
     "name": "John Doe",
     "email": "john.doe@example.com",
     "password": "yourpassword"
   }
   ```
5. Send the request and observe the response.

### User Login
1. Create a new request for the user login endpoint.
2. Set the request method to POST and enter the URL: `http://localhost:5000/api/users/login`.
3. In the request body, input the following JSON data:
   ```json
   {
     "email": "john.doe@example.com",
     "password": "yourpassword"
   }
   ```
4. Send the request and observe the response.

### MFA Setup
1. Create a new request for the MFA setup endpoint.
2. Set the request method to POST and enter the URL: `http://localhost:5000/api/users/mfa-setup`.
3. In the request body, input the following JSON data:
   ```json
   {
     "email": "john.doe@example.com"
   }
   ```
4. Send the request and observe the response.

### MFA Verification
1. Create a new request for the MFA verification endpoint.
2. Set the request method to POST and enter the URL: `http://localhost:5000/api/users/mfa-verify`.
3. In the request body, input the following JSON data:
   ```json
   {
     "email": "john.doe@example.com",
     "code": "123456" // Replace with the actual code sent to the user
   }
   ```
4. Send the request and observe the response.

1. Open Postman.
2. Create a new request for each endpoint listed above.
3. Set the request method (GET, POST) and enter the URL (e.g., `http://localhost:5000/api/users/register`).
4. In the request body, select "raw" and set the type to "JSON" to input the JSON data.
5. Send the request and observe the response.
