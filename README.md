# Merchant API

This document provides details on how to interact with the Merchant API using cURL commands for various operations such as signup, login, retrieving risk scores, and rotating the API key.

## API Endpoints

### 1. Signup a Merchant

Use the following cURL command to sign up a new merchant:

```bash
curl --location 'http://localhost:8000/api/v1/merchant/signup' \
--header 'Content-Type: application/json' \
--data '{
    "username": "merchant124",
    "password": "securePassword123",
    "apiKey": "API_KEY_ABC123XYZ",
    "apiKeyLastRotated": "2024-09-25T12:30:00Z",
    "twoFactorAuthEnabled": true,
    "passwordUpdated": "2024-09-20T08:45:00Z",
    "country": "India"
}'
```

### 2.  Login a Merchant
Use the following cURL command to login a merchant:

```bash
curl --location 'http://localhost:8000/api/v1/merchant/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "merchant124",
    "password": "securePassword123"
}'
```

### 3. Get Risk Score
Once logged in, use the following command to retrieve the risk score. Make sure to replace the Authorization token with the one obtained during login.
```bash
curl --location 'http://localhost:8000/api/v1/merchant/risk-score' \
--header 'Authorization: Bearer <your_jwt_token_here>'
```

### 4. Rotate API Key
To rotate the API key, use the following command. Again, replace the Authorization token with your actual token.
```bash
curl --location --request POST 'http://localhost:8000/api/v1/merchant/rotate-api-key' \
--header 'Authorization: Bearer <your_jwt_token_here>'
```

This structure ensures the code blocks are properly formatted, making it easier to read and execute. You can copy and paste this directly into your `README.md` file.



