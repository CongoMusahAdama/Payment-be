# Profile Management API Documentation

## 1. Upload KYC Document
- **Endpoint**: `POST /api/users/upload-kyc`
- **Description**: Uploads a KYC document for the user.
- **Headers**:
  - `Authorization`: Bearer token (if required)
- **Request Body**: (form-data)
  - `kycDocument`: File (KYC document)
- **Responses**:
  - `200 OK`: KYC document uploaded successfully.
  - `400 Bad Request`: Invalid input.

## 2. Update User Profile
- **Endpoint**: `PUT /api/users/profile`
- **Description**: Updates the user profile with the provided details.
- **Headers**:
  - `Authorization`: Bearer token (if required)
- **Request Body**:
  ```json
  {
    "Fullname": "John Doe",
    "email": "john.doe@example.com",
    "phone": "0987654321",
    "address": "456 Elm St"
  }
  ```
- **Responses**:
  - `200 OK`: Profile updated successfully.
  - `400 Bad Request`: Invalid input.

## 3. Get User Profile
- **Endpoint**: `GET /api/users/profile`
- **Description**: Retrieves the user profile based on the user ID.
- **Headers**:
  - `Authorization`: Bearer token (if required)
- **Responses**:
  - `200 OK`: User profile retrieved successfully.
  - `404 Not Found`: User not found.
  - `500 Internal Server Error`: Server error.


## 2. Upload KYC Document
- **Endpoint**: `POST /api/users/upload-kyc`
- **Description**: Uploads a KYC document for the user.
- **Headers**:
  - `Authorization`: Bearer token (if required)
- **Request Body**: (form-data)
  - `kycDocument`: File (KYC document)
- **Responses**:
  - `200 OK`: KYC document uploaded successfully.
  - `400 Bad Request`: Invalid input.

## 3. Update User Profile
- **Endpoint**: `PUT /api/users/profile`
- **Description**: Updates the user profile with the provided details.
- **Headers**:
  - `Authorization`: Bearer token (if required)
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "0987654321",
    "address": "456 Elm St"
  }
  ```
- **Responses**:
  - `200 OK`: Profile updated successfully.
  - `400 Bad Request`: Invalid input.

## Testing with Postman
1. Open Postman.
2. Set the request type (GET, POST, PUT) based on the endpoint.
3. Enter the endpoint URL (e.g., `http://localhost:5000/api/users/create-profile`).
4. Add the required headers in the "Headers" tab.
5. For POST and PUT requests, add the request body in the "Body" tab.
6. Click "Send" to execute the request and view the response.
