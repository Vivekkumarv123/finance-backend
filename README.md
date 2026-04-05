# Finance Backend API

A secure, role-based RESTful API for managing personal and organizational financial records. Built with Node.js, Express, TypeScript, and MongoDB.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Role & Permission Model](#role--permission-model)
- [Security](#security)

---

## Overview

Finance Backend provides a structured backend service for tracking income and expense records, managing users, and delivering aggregated financial insights through a dashboard API. The system enforces strict role-based access control (RBAC) to ensure data integrity and operational security.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Language | TypeScript |
| Database | MongoDB via Mongoose |
| Authentication | JWE (JSON Web Encryption) via `jose` |
| Validation | Zod |
| Security | Helmet, CORS, express-rate-limit |
| Password Hashing | bcryptjs |

---

## Architecture

The project follows a modular, feature-based structure where each domain (auth, users, records, dashboard) is self-contained with its own controller, service, repository, schema, and routes.

```
src/
├── app.ts                  # Express app setup
├── server.ts               # Server entry point
├── config/
│   └── env.ts              # Validated environment config (Zod)
├── database/
│   └── connection.ts       # MongoDB connection
├── common/
│   ├── errors/             # Centralized error class
│   ├── middleware/         # Auth, authorization, validation, rate limiting
│   └── utils/              # JWE token helpers, password hashing, pagination
└── modules/
    ├── auth/               # Registration & login
    ├── users/              # User management (admin only)
    ├── records/            # Financial records CRUD
    └── dashboard/          # Aggregated financial analytics
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Port the server listens on (default: `5000`) | No |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWE_SECRET` | 32+ character secret for token encryption | Yes |

Example `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-db
JWE_SECRET=your_32_character_minimum_secret_here
```

> The application will exit on startup if any required environment variable is missing or invalid.

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Authenticate and receive a token | No |

### Users

> Admin role required for all user management endpoints.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users` | Create a new user |
| `GET` | `/users` | List all users (paginated) |
| `PATCH` | `/users/:id/role` | Assign a role to a user |
| `PATCH` | `/users/:id/status` | Activate or deactivate a user |

### Records

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| `POST` | `/records` | Create a financial record | `record:create` |
| `GET` | `/records` | List records (paginated, filterable) | `record:read` |
| `PATCH` | `/records/:id` | Update a record | `record:update` |
| `DELETE` | `/records/:id` | Soft-delete a record | `record:delete` |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/summary` | Total income, expenses, and net balance |
| `GET` | `/dashboard/category` | Breakdown by category |
| `GET` | `/dashboard/monthly` | Month-over-month trends |
| `GET` | `/dashboard/recent` | Most recent transactions |

---

## Role & Permission Model

The system uses a fixed role hierarchy with predefined permission sets.

| Permission | viewer | analyst | admin |
|---|:---:|:---:|:---:|
| `dashboard:read` | ✓ | ✓ | ✓ |
| `record:read` | | ✓ | ✓ |
| `record:create` | | | ✓ |
| `record:update` | | | ✓ |
| `record:delete` | | | ✓ |
| `user:create` | | | ✓ |
| `user:read` | | | ✓ |
| `user:update` | | | ✓ |

New users are assigned the `viewer` role by default upon registration.

---

## Security

- **JWE Tokens** — Authentication tokens are fully encrypted (not just signed) using AES-256-GCM, preventing payload inspection. Tokens expire after 1 hour.
- **Password Hashing** — All passwords are hashed with bcryptjs before storage.
- **Helmet** — Sets secure HTTP response headers.
- **Rate Limiting** — Global rate limiter applied to all routes to mitigate brute-force attacks.
- **Input Validation** — All request bodies and query parameters are validated with Zod schemas before reaching business logic.
- **Soft Deletes** — Financial records are never permanently deleted; they are flagged with `isDeleted: true` to preserve audit history.
