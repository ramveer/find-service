# Vehicle Tracking Platform

## Overview

A real-time location tracking system designed for:

* **Drivers**: Share the live location of buses or trucks.
* **Users** (e.g., parents, fleet owners): Track one or more vehicles they have permission to access.

The platform is mobile-first and uses OTP-based login via phone numbers.

---

## Architecture

### Tech Stack

| Component            | Technology                      |
| -------------------- | ------------------------------- |
| Backend              | Node.js (TypeScript), Express   |
| Database             | MySQL (via Prisma ORM)          |
| Auth                 | JWT (Bearer Tokens)             |
| Messaging            | Kafka (planned, for ingestion)  |
| Real-time            | Server-Sent Events (SSE)        |
| Deployment           | Microservices, per-location DBs |
| Internationalization | i18n support (English, Hindi)   |

---

## Project Structure

```
project-root/
├── .env
├── package.json
├── tsconfig.json
├── nodemon.json
├── prisma/
│   └── schema.prisma         # Prisma schema
└── src/
    ├── app.ts                # Entry point
    ├── controller.ts         # Endpoint handlers
    ├── routes/
    │   └── index.ts          # Route declarations
    ├── services/
    │   ├── user.service.ts
    │   └── location.service.ts
    ├── repositories/
    │   └── user.repository.ts
    └── utils/
        ├── util.ts
        └── sms.ts
```

---

## Features

### OTP-based User Login

* **POST /api/user/login/request-otp**: Login with mobile number (supports international format)
* **POST /api/user/login/verify-otp**: Verify OTP and receive JWT token

### Authentication

* JWT-based secured routes.

### User Profile

* **PUT /api/user/profile**: Add or update user details

### Vehicle Management

* **POST /api/vehicle**: Register new vehicles (any type)
* **PUT /api/vehicle/\:id**: Update existing vehicle details

### Real-time Tracking

* **POST /api/location/\:vehicleId**: Drivers send live location
* **GET /api/location/stream?v=1,2,3**: Stream real-time location data (private or shared vehicles)

### Permissions

* **POST /api/vehicle/\:id/permission**: Allow tracking by phone number
* Vehicles marked PRIVATE must grant access per user/phone

### Vehicle Search

* **GET /api/vehicle/search?query=...**: Full-text search by name, number, or phone

### Public Vehicle Discovery

* **GET /api/public/vehicle/search?startLoc=A\&endLoc=B**: Search public vehicles by route
* **GET /api/public/nearby?lat=12.9716\&lng=77.5946**: Find public vehicles within 10km radius of user

---

## Internationalization & Phone Format

* ✅ Supports multi-language UI (e.g., English and Hindi)
* ✅ Accepts mobile numbers from different countries (E.164 format)

---

## API Reference

### 1. Request OTP

**POST /api/user/login/request-otp**  
Auth: ❌ Public

**Body:**
```json
{ "phone": "+919876543210" }
```

---

### 2. Verify OTP

**POST /api/user/login/verify-otp**  
Auth: ❌ Public

**Body:**
```json
{ "phone": "+919876543210", "otp": "123456" }
```

**Response:**
```json
{ "token": "JWT_TOKEN" }
```

---

### 3. Update User Profile

**PUT /api/user/profile**  
Auth: ✅ JWT

**Body:**
```json
{ "name": "John Doe", "email": "john@example.com" }
```

---

### 4. Register Vehicle (Any Type)

**POST /api/vehicle**  
Auth: ✅ JWT

**Body:**
```json
{
  "name": "BUS123",
  "deviceType": "bus",
  "deviceNumber": "TN01X1111",
  "shareType": "PRIVATE", // or "PUBLIC" or "RESTRICTED"
  "startLoc": "School",   // optional, for public vehicles
  "endLoc": "Home",       // optional, for public vehicles
  "owner": "1"            // required if shareType is "PRIVATE"
}
```

**Response:**
```json
{ "id": 1, "name": "BUS123", "shareType": "PRIVATE", ... }
```

---

### 5. Update Vehicle

**PUT /api/vehicle/:id**  
Auth: ✅ JWT

**Body:**
```json
{
  "name": "BUS123",
  "deviceType": "bus",
  "deviceNumber": "TN01X1111",
  "shareType": "PRIVATE",
  "startLoc": "School",
  "endLoc": "Home"
}
```

---

### 6. Post Location

**POST /api/location/:vehicleId**  
Auth: ✅ JWT

**Body:**
```json
{ "lat": 12.9716, "lng": 77.5946 }
```

---

### 7. Stream Locations

**GET /api/location/stream?v=1,2,3**  
Auth: ✅ JWT

**Response:**  
SSE stream of location updates for vehicle IDs 1, 2, and 3.

---

### 8. Set Tracking Permission

**POST /api/vehicle/:id/permission**  
Auth: ✅ JWT

**Body:**
```json
{ "phone": "+919876543210" }
```

---

### 9. Search Vehicles

**GET /api/vehicle/search?query=BUS123**  
Auth: ✅ JWT

---

### 10. Public Vehicle Route Search

**GET /api/public/vehicle/search?startLoc=School&endLoc=Home**  
Auth: ❌ Public

---

### 11. Nearby Public Vehicles

**GET /api/public/nearby?lat=12.97\&lng=77.59**
Auth: ❌ Public

---

## Notes

* All endpoints are prefixed with `/api`.
* Use `Authorization: Bearer <token>` for secured APIs.
* SSE is unsupported in Postman. Use browser or JS-based client.
* Phone numbers must be in international format (e.g., `+91...`, `+1...`).
