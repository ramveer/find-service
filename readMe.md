# Vehicle Tracking Platform — Project Summary

## 🧠 Purpose
A real-time location tracking system for:
- **Drivers** to share the location of buses/trucks.
- **Users** (e.g., parents or fleet owners) to track one or many vehicles they have permission for.

The platform is mobile-first, with OTP-based login using phone numbers.

---

## 🏗️ Architecture

### 🧱 Tech Stack
| Component          | Tech Used                          |
|---------------------|------------------------------------|
| Backend            | Node.js (TypeScript) + Express     |
| Database           | MySQL (via Prisma ORM)             |
| Auth               | JWT (Bearer Tokens)                |
| Messaging (future) | Kafka (location ingestion)         |
| Real-time          | Server-Sent Events (SSE)          |
| Deployment         | Microservices w/ per-location DBs  |

---

## 📁 Project Structure
project-root/
├── .env
├── package.json
├── tsconfig.json
├── nodemon.json
├── prisma/
│   └── schema.prisma         # Prisma schema
└── src/
    ├── app.ts                # Entry point
    ├── controller.ts         # All endpoint handlers
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

---

## 🧩 Features & Modules

### ✅ OTP-based User Login API

### ✅ Authentication
- OTP-based login using phone number (`POST /user/login/request-otp`).
- Verifies OTP, issues JWT token (`POST /user/login/verify-otp`).

### ✅ Real-time Tracking - Use Google Geolocation API
- Drivers share/send location (`POST /location/:vehicleId`).
- Users stream live updates for 1 or more vehicles (`GET /location/stream?v=1,2,3`).
~~- SSE (Server-Sent Events) used for low-latency, push-based streaming.~~
- Public Vehicle:: user can search by location (`GET /vehicle/search?query=...`)  startLoc to endLoc,
  it returns all vehicles current location live tracking in that range. it only works for public vehicles. it search only active vehicles.

### ✅ Vehicle Management -Search API
 - Users can search vehicles by name, phoneNumber or vehicleId/deviceNumber (`GET /vehicle/search?query=searchTerm`).
 - Search supports full matches on vehicle name, phone number, or device number.
 - Search is applicable to all Vehicle.
 - 

### ✅ Permissions : Api to manage user permissions for Private vehicles/devices.
- A user can subscribe to many vehicles.
- Permissions stored in DB to validate access.
- Only Private vehicles are required permission to see by other user.

---

## 🔐 User Model Design (Multi-DB Support)

---

## 🧪 API Testing Guide

### Test Real-time Location Streaming (`/location/stream`)

- **Endpoint:** `GET /location/stream`
- **How to test in Postman:**
  1. Set method to **GET**.
  2. Set the URL to:  
     ```
     http://localhost:PORT/location/stream?v=1,2,3
     ```
     Replace `PORT` with your server port and `1,2,3` with the vehicle IDs you want to stream.
  3. **No request body is needed**.  
     Vehicle IDs are provided as a comma-separated list in the `v` query parameter.
  4. Send the request.  
     You should see a stream of location updates (as SSE events) in the response.

- **Note:**  
  Postman may not display SSE events properly. For best results, use a browser or an SSE-compatible client.  
  **SSE streaming works in browsers (e.g., Chrome, Firefox) and with EventSource in JavaScript. Postman does not support SSE.**

### Test Posting Location (`/location/:vehicleId`)

- **Endpoint:** `POST /location/:vehicleId`
- **How to test in Postman:**
  1. Set method to **POST**.
  2. Set the URL to:  
     ```
     http://localhost:PORT/location/123
     ```
     Replace `PORT` with your server port and `123` with the vehicle ID you want to post location for.
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
