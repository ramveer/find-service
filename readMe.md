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

### ✅ Authentication
- OTP-based login using phone number (`POST /user/login/request-otp`).
- Verifies OTP, issues JWT token (`POST /user/login/verify-otp`).

### ✅ Real-time Tracking
- Drivers send location (`POST /location/:vehicleId`).
- Users stream live updates for 1 or more vehicles (`GET /location/stream?v=1,2,3`).
- SSE (Server-Sent Events) used for low-latency, push-based streaming.

### ✅ Permissions (planned)
- A user can subscribe to many vehicles.
- Permissions stored in DB to validate access.

---

## 🔐 User Model Design (Multi-DB Support)