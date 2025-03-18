# Report Management API Documentation

## Base URL
```
http://localhost:5000/api/reports
```

## Test the API Using Postman

### 📌 Test Download Transaction Report
- **Request:** `GET /api/reports/download`

#### Headers:
- `Authorization: Bearer <your_jwt_token>`

#### ✅ Expected Response (Success):
- The report file (PDF/CSV) will be downloaded.

#### 🔴 If the request is invalid, it should return:
```json
{
  "message": "Invalid request."
}
