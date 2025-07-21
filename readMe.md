# Vehicle Tracking Platform

## Overview

A real-time location tracking system designed for:
- **Drivers**: Share the live location of buses or trucks.
- **Users** (e.g., parents, fleet owners): Track one or more vehicles they have permission to access.

The platform is mobile-first and uses OTP-based login via phone numbers.

---

## Architecture

### Tech Stack

| Component    | Technology                        |
|--------------|-----------------------------------|
| Backend      | Node.js (TypeScript), Express     |
| Database     | MySQL (via Prisma ORM)            |
| Auth         | JWT (Bearer Tokens)               |
| Messaging    | Kafka (planned, for ingestion)    |
| Real-time    | Server-Sent Events (SSE)          |
| Deployment   | Microservices, per-location DBs   |

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

- Request OTP using phone number (`POST /user/login/request-otp`)
- Verify OTP and receive JWT token (`POST /user/login/verify-otp`)

### Authentication

- Secure endpoints using JWT tokens.

### Real-time Tracking

- Drivers send location updates (`POST /location/:vehicleId`)
- Users stream live location updates for one or more vehicles (`GET /location/stream?v=1,2,3`)
- Public vehicles: Search by location (`GET /vehicle/search?query=...`) to get live tracking for vehicles in a specific range (only for public and active vehicles).

### Vehicle Management

- Search vehicles by name, phone number, or device number (`GET /vehicle/search?query=searchTerm`)
- Search supports exact matches and applies to all vehicles.

### Permissions

- Users can subscribe to multiple vehicles.
- Permissions are stored in the database and validated for private vehicles.
- Only private vehicles require explicit permission for access.

---

## User Model

- Supports multi-database architecture.
- User roles: NORMAL, DRIVER.
- User status: Verified, Active.

---

## API Testing Guide

### Test Real-time Location Streaming (`/location/stream`)

- **Endpoint:** `GET /location/stream`
- **How to test:**
  1. Set method to **GET**.
  2. Use URL:  
     ```
     http://localhost:PORT/location/stream?v=1,2,3
     ```
     Replace `PORT` with your server port and `1,2,3` with the vehicle IDs you want to stream.
  3. **No request body is needed**.
     Vehicle IDs are provided as a comma-separated list in the `v` query parameter.
  4. Send the request.
     You should see a stream of location updates (as SSE events) in the response.

- **Note:**  
  Postman does **not** support SSE. Use a browser or an SSE-compatible client (e.g., JavaScript `EventSource`).

### Test Posting Location (`/location/:vehicleId`)

- **Endpoint:** `POST /location/:vehicleId`
- **How to test:**
  1. Set method to **POST**.
  2. Use URL:  
     ```
     http://localhost:PORT/location/123
     ```
     Replace `PORT` with your server port and `123` with the vehicle ID.
  3. Set **Body** type to `raw` and select `JSON`.
  4. Provide a JSON body, for example:
     ```json
     {
       "lat": 12.9716,
       "lng": 77.5946
     }
     ```
  5. Send the request.  
     You should receive a response:
     ```json
     { "success": true }
     ```

- **Note:**  
  Both `lat` and `lng` are required in the body. The vehicle ID is provided in the URL path.

---

