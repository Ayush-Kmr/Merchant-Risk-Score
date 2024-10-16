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
