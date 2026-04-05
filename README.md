# Finance Backend API

A secure, role-based RESTful API for managing personal and organizational financial records.
Built with Node.js, Express, TypeScript, and MongoDB — designed for production-grade reliability
and clean separation of concerns.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Role & Permission System](#role--permission-system)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Security Design](#security-design)
- [API Documentation (Swagger)](#api-documentation-swagger)

---

## Overview

Finance Backend provides a structured service layer for:

- Tracking income and expense records per user
- Managing users and their access levels (admin only)
- Delivering aggregated financial analytics via a dashboard API

The system enforces strict Role-Based Access Control (RBAC) — every protected route
validates both the token and the caller's permission set before executing any business logic.

---

## Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Runtime          | Node.js 18+ (ESM)                   |
| Framework        | Express 5                           |
| Language         | TypeScript                          |
| Database         | MongoDB via Mongoose 9              |
| Authentication   | JWE (AES-256-GCM) via `jose`        |
| Validation       | Zod 4                               |
| Security Headers | Helmet                              |
| Rate Limiting    | express-rate-limit                  |
| Password Hashing | bcryptjs                            |

---

## Architecture

The project follows a modular, feature-based structure. Each domain is fully self-contained
with its own controller, service, repository, schema, and routes.

```
src/
├── app.ts                    # Express app — middleware + route registration
├── server.ts                 # Entry point — DB connection + server start
├── config/
│   └── env.ts                # Zod-validated environment config
├── database/
│   └── connection.ts         # MongoDB connection handler
├── common/
│   ├── errors/
│   │   └── AppError.ts       # Typed operational error class
│   ├── middleware/
│   │   ├── authenticate.ts   # JWE token verification
│   │   ├── authorize.ts      # RBAC permission enforcement
│   │   ├── errorHandler.ts   # Centralized error response formatter
│   │   ├── rateLimiter.ts    # Global rate limiting
│   │   └── validate.ts       # Zod schema validation middleware
│   └── utils/
│       ├── jwe.ts            # Token encrypt / decrypt helpers
│       ├── password.ts       # bcrypt hash / verify helpers
│       └── pagination.ts     # Pagination meta builder
└── modules/
    ├── auth/                 # POST /register, POST /login
    ├── users/                # User management (admin only)
    ├── records/              # Financial record CRUD
    └── dashboard/            # Aggregation analytics
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local instance or MongoDB Atlas)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Start development server (with hot reload)
npm run dev
```

### Production

```bash
# Compile TypeScript
npm run build

# Start compiled server
npm start
```

---

## Environment Variables

| Variable     | Description                                      | Required | Default |
|--------------|--------------------------------------------------|----------|---------|
| `PORT`       | Port the HTTP server listens on                  | No       | `5000`  |
| `MONGO_URI`  | MongoDB connection string                        | Yes      | —       |
| `JWE_SECRET` | Encryption secret — minimum 32 characters       | Yes      | —       |

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-db
JWE_SECRET=your_32_character_minimum_secret_here
```

> The application validates all environment variables at startup using Zod.
> It will exit immediately with a descriptive error if any required variable is missing or invalid.

---

## Role & Permission System

The system uses a fixed role hierarchy. Roles are embedded in the encrypted token
and enforced on every protected route.

| Permission       | viewer | analyst | admin |
|------------------|:------:|:-------:|:-----:|
| `dashboard:read` | ✓      | ✓       | ✓     |
| `record:read`    |        | ✓       | ✓     |
| `record:create`  |        |         | ✓     |
| `record:update`  |        |         | ✓     |
| `record:delete`  |        |         | ✓     |
| `user:create`    |        |         | ✓     |
| `user:read`      |        |         | ✓     |
| `user:update`    |        |         | ✓     |

**Data scoping rules:**
- `viewer` / `analyst` — see only their own records and dashboard data
- `admin` — sees all records and users across the system

New users who self-register via `/auth/register` are always assigned the `viewer` role.
Only an admin can create users with elevated roles via `POST /api/v1/users`.

---

## API Reference

All endpoints are prefixed with `/api/v1`.
Protected routes require: `Authorization: Bearer <token>`

### Authentication

| Method | Endpoint         | Auth | Description                          |
|--------|------------------|------|--------------------------------------|
| POST   | /auth/register   | No   | Register — returns token + user info |
| POST   | /auth/login      | No   | Login — returns token + user info    |

**Register / Login request body:**
```json
{
  "email": "jane@example.com",
  "password": "secret123",
  "name": "Jane Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "viewer"
  },
  "token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..."
}
```

---

### Users (Admin only)

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | /users                | Create a user with a set role  |
| GET    | /users                | List users (paginated)         |
| PATCH  | /users/:id/role       | Assign a new role to a user    |
| PATCH  | /users/:id/status     | Activate or deactivate a user  |

**Query parameters for GET /users:**

| Param    | Type    | Description                    |
|----------|---------|--------------------------------|
| page     | integer | Page number (default: 1)       |
| limit    | integer | Items per page (default: 10)   |
| role     | string  | Filter by role                 |
| isActive | boolean | Filter by active status        |

---

### Records

| Method | Endpoint       | Permission       | Description                        |
|--------|----------------|------------------|------------------------------------|
| POST   | /records       | record:create    | Create a financial record          |
| GET    | /records       | record:read      | List records (paginated, filtered) |
| PATCH  | /records/:id   | record:update    | Update a record                    |
| DELETE | /records/:id   | record:delete    | Soft-delete a record               |

**Query parameters for GET /records:**

| Param    | Type   | Description                          |
|----------|--------|--------------------------------------|
| page     | int    | Page number (default: 1)             |
| limit    | int    | Items per page (default: 10)         |
| type     | string | `income` or `expense`                |
| category | string | Filter by category name              |
| dateFrom | string | ISO date — start of range            |
| dateTo   | string | ISO date — end of range              |

**Create record request body:**
```json
{
  "amount": 2500.00,
  "type": "income",
  "category": "Freelance",
  "date": "2024-04-01T00:00:00.000Z",
  "notes": "Project payment received"
}
```

---

### Dashboard

All dashboard endpoints require `dashboard:read` permission (all roles).

| Method | Endpoint               | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | /dashboard/summary     | Total income, expenses, and net balance  |
| GET    | /dashboard/category    | Totals grouped by category               |
| GET    | /dashboard/monthly     | Month-over-month income/expense trends   |
| GET    | /dashboard/recent      | 5 most recent transactions               |

**GET /dashboard/monthly** accepts an optional `?year=2024` query parameter.

**Summary response:**
```json
{
  "totalIncome": 12500.00,
  "totalExpense": 4300.00,
  "netBalance": 8200.00
}
```

**Monthly trend response:**
```json
[
  { "month": 1, "year": 2024, "income": 5000.00, "expense": 1200.00, "net": 3800.00 },
  { "month": 2, "year": 2024, "income": 4500.00, "expense": 1800.00, "net": 2700.00 }
]
```

---

## Error Handling

All errors follow a consistent JSON structure.

**Operational error (AppError):**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

**Validation error (Zod):**
```json
{
  "status": "validation_error",
  "errors": [
    { "path": ["email"], "message": "Invalid email address" },
    { "path": ["password"], "message": "String must contain at least 6 character(s)" }
  ]
}
```

| Status Code | Meaning                                      |
|-------------|----------------------------------------------|
| 400         | Validation failed (Zod schema rejection)     |
| 401         | Missing, invalid, or expired token           |
| 403         | Authenticated but insufficient permissions   |
| 404         | Resource not found                           |
| 409         | Conflict (e.g. email already in use)         |
| 500         | Unexpected internal server error             |

---

## Security Design

- **JWE Tokens** — Tokens are fully encrypted (not just signed) using `dir` + `A256GCM`.
  The payload (userId, role) is unreadable without the server secret. Tokens expire in 1 hour.
- **Password Hashing** — Passwords are hashed with bcryptjs before storage. Plain-text passwords
  are never persisted or logged.
- **Helmet** — Sets secure HTTP response headers (CSP, HSTS, X-Frame-Options, etc.).
- **Rate Limiting** — A global rate limiter is applied to all routes to mitigate brute-force
  and denial-of-service attempts.
- **Input Validation** — Every request body and query string is validated through a Zod schema
  before reaching the service layer. Invalid input is rejected with a structured 400 response.
- **Soft Deletes** — Financial records are never permanently removed. Deleted records are flagged
  with `isDeleted: true`, preserving a complete audit trail.
- **Environment Validation** — All environment variables are validated at startup via Zod.
  The process exits immediately if configuration is incomplete or malformed.

---

## API Documentation (Swagger)

A full OpenAPI 3.0 specification is available at `swagger.yaml` in the project root.

To view it interactively, paste the contents of `swagger.yaml` into:

> [https://editor.swagger.io](https://editor.swagger.io)

Or serve it locally by installing `swagger-ui-express`:

```bash
npm install swagger-ui-express js-yaml
npm install -D @types/swagger-ui-express
```

Then mount it in `app.ts`:

```ts
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { parse } from 'js-yaml';

const swaggerDoc = parse(readFileSync('./swagger.yaml', 'utf8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
```

Swagger UI will be available at: `http://localhost:5000/api/docs`
