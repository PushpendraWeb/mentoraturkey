# Mentora Turkey

A **Node.js / Express** REST API for a mentoring platform. It supports **Parents**, **Students**, and **Mentors**: parents create students, mentors create and manage lessons, and students join assigned lessons. Includes **JWT authentication**, **MongoDB** persistence, and an **OpenAI-powered text summarization** endpoint.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Deployment (Vercel)](#deployment-vercel)

---

## Features

- **Roles**: Parent (1), Student (2), Mentor (3). Signup allowed for Parent and Mentor only; Students are created by Parents.
- **Auth**: Signup, Login (mobile + password), JWT-protected routes, optional role-based guard (e.g. only Parent can create students).
- **Users**: CRUD for users; get current user, get by ID, list all (with auth where applicable).
- **Lessons**: Create/update/delete lessons (mentor-linked), list all, get by ID, get by mentor ID.
- **Assign Lessons**: Assign a lesson to a student with topic/summary and status (Pending, Success, Process, Failed).
- **Join Lessons**: Students join an assigned lesson; join status: Join / failed.
- **LLM Summarization**: POST text to get a short bullet-point summary via OpenAI (rate-limited, configurable max length).

---

## Tech Stack

| Layer        | Technology |
|-------------|------------|
| Runtime     | Node.js    |
| Framework   | Express 5  |
| Database    | MongoDB (Mongoose 9) |
| Auth        | JWT (jsonwebtoken), bcryptjs |
| LLM         | OpenAI Chat API (e.g. gpt-4o-mini) |
| Rate limit  | express-rate-limit (summarize endpoint) |
| Deployment  | Vercel (optional) |

---

## Project Structure

```
mentoraturkey/
├── server.js                 # Entry point, Express app, DB connect, routes
├── package.json
├── vercel.json               # Vercel serverless config
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── env.js            # App config (Mongo URI, JWT, OpenAI, etc.)
│   ├── constants/
│   │   └── roles.js          # ROLE_ID (PARENT, STUDENT, MENTOR), SIGNUP_ALLOWED_ROLES
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── role.controller.js
│   │   ├── lesson.controller.js
│   │   ├── assign_lesson.controller.js
│   │   ├── join_lesson.controller.js
│   │   └── llm.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js # JWT auth, requireParent
│   ├── models/
│   │   ├── user.model.js
│   │   ├── role.model.js
│   │   ├── lesson.model.js
│   │   ├── assign_lesson.model.js
│   │   └── join_lesson.model.js
│   ├── routes/
│   │   ├── index.js          # Mounts all route modules
│   │   ├── auth/
│   │   ├── user/
│   │   ├── Role/
│   │   ├── lessons/
│   │   ├── Join_lessons/
│   │   └── llm/
│   ├── services/
│   │   └── llm.service.js    # OpenAI summarize
│   └── validation/           # Request validators per domain
└── README.md
```

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas)
- **OpenAI API key** (optional; required only for `/llm/summarize` and `/api/llm/summarize`)

---

## Installation

```bash
git clone <repository-url>
cd mentoraturkey
npm install
```

---

## Environment Variables

Configure via environment variables or by editing `src/config/env.js` (not recommended for production).

| Variable           | Description                          | Default (if any)     |
|--------------------|--------------------------------------|----------------------|
| `JWT_SECRET`       | Secret for signing JWTs              | (dev default in code)|
| `JWT_EXPIRES_IN`  | Token expiry (e.g. `7d`)             | `7d`                 |
| `OPENAI_API_KEY`  | OpenAI API key for summarization     | —                    |
| `LLM_MAX_TEXT_LENGTH` | Max characters for summarize input | `10000`              |

**MongoDB**: Connection string is read from `env.mongoUri` in `src/config/env.js`. For production, set it via your own env mechanism (e.g. `process.env.MONGO_URI`) and use that in `env.js`.

---

## Running the Server

- **Production mode**:  
  `npm start`  
  (runs `node server.js`)

- **Development mode** (auto-reload):  
  `npm run dev`  
  (uses `nodemon server.js`)

Server listens on **port 2000** (configurable in `server.js` and `env.js`).  
Root: `GET /` returns a simple “Hello World! Project is running” message.

---

## API Overview

| Base path           | Description                    |
|---------------------|--------------------------------|
| `/api/auth`         | Signup, Login                  |
| `/api/user`         | User CRUD, create student      |
| `/api/role`         | Role CRUD                      |
| `/api/lessons`      | Lessons + assign-lessons       |
| `/api/join_lessons` | Join lesson, list, get, delete |
| `/api/llm` or `/llm`| Text summarization             |

Protected routes expect:  
`Authorization: Bearer <jwt_token>`

---

## Authentication

- **Signup** (`POST /api/auth/signup`): Body `name`, `role_id` (1 or 3), `address` (optional), `mobile_no`, `password`. Returns user + token.
- **Login** (`POST /api/auth/login`): Body `mobile_no`, `password`. Returns user + token.
- Use the returned `token` in the `Authorization` header for protected endpoints.

Role IDs (see `src/constants/roles.js`):

- `1` = Parent  
- `2` = Student (created only by Parent via `/api/user/create-student`)  
- `3` = Mentor  

---

## API Reference

### Auth

| Method | Endpoint               | Auth | Description        |
|--------|------------------------|------|--------------------|
| POST   | `/api/auth/signup`     | No   | Register Parent/Mentor |
| POST   | `/api/auth/login`      | No   | Login, get token   |

### User

| Method | Endpoint                        | Auth | Description           |
|--------|---------------------------------|------|-----------------------|
| GET    | `/api/user/getbyAuth`           | Yes  | Current user          |
| GET    | `/api/user/getall`              | Yes  | List all users        |
| GET    | `/api/user/getbyid/:id`         | Yes  | User by `user_id`     |
| PUT    | `/api/user/update`              | Yes  | Update user (body `id`) |
| DELETE | `/api/user/delete/:id`         | Yes  | Soft delete user      |
| POST   | `/api/user/create-student`     | Yes (Parent) | Create student  |
| POST   | `/api/user/create`             | No   | Create user (admin)   |
| GET    | `/api/user/all`                | No   | List all users        |

### Role

| Method | Endpoint                 | Auth | Description    |
|--------|--------------------------|------|----------------|
| POST   | `/api/role/create`       | No   | Create role    |
| PUT    | `/api/role/update`       | No   | Update role    |
| DELETE | `/api/role/delete/:id`   | No   | Soft delete    |
| GET    | `/api/role/getall`       | No   | List roles     |
| GET    | `/api/role/getbyid/:id`  | No   | Role by Role_id |

### Lessons

| Method | Endpoint                           | Auth | Description           |
|--------|------------------------------------|------|------------------------|
| GET    | `/api/lessons/getall`              | No   | List lessons          |
| GET    | `/api/lessons/getbyid/:id`         | No   | Lesson by ID          |
| POST   | `/api/lessons/create`              | Yes  | Create lesson         |
| PUT    | `/api/lessons/update`              | Yes  | Update lesson         |
| DELETE | `/api/lessons/delete/:id`          | Yes  | Delete lesson         |
| GET    | `/api/lessons/getbymentorId/:mentorId` | Yes | Lessons by mentor |
| GET    | `/api/lessons/:id/sessions`        | Yes  | Assign-lessons for lesson |
| POST   | `/api/lessons/assign/create`       | Yes  | Assign lesson to student |
| PUT    | `/api/lessons/assign/update`       | Yes  | Update assignment     |
| DELETE | `/api/lessons/assign/delete/:id`   | Yes  | Delete assignment     |
| GET    | `/api/lessons/assign/getbyid/:id`  | Yes  | Assignment by ID      |
| GET    | `/api/lessons/assign/getall`       | No   | List assignments      |

### Join lessons

| Method | Endpoint                      | Auth | Description      |
|--------|-------------------------------|------|------------------|
| POST   | `/api/join_lessons/join`      | Yes  | Join assignment  |
| DELETE | `/api/join_lessons/delete/:id`| Yes  | Delete join      |
| GET    | `/api/join_lessons/getbyid/:id`| Yes | Get by ID        |
| GET    | `/api/join_lessons/getall`    | No   | List all         |

### LLM (Summarization)

| Method | Endpoint                | Auth | Description                    |
|--------|-------------------------|------|--------------------------------|
| POST   | `/api/llm/summarize` or `/llm/summarize` | No | Summarize text (rate-limited) |

**Request body**: `{ "text": "Your long text here..." }`  
- Min length: 50 characters.  
- Max length: `LLM_MAX_TEXT_LENGTH` (default 10000).  

**Response**: `{ "success": true, "summary": "...", "model": "gpt-4o-mini" }`  
Requires `OPENAI_API_KEY`; otherwise returns 503.

---

## Deployment (Vercel)

The repo includes `vercel.json` that points all routes to `server.js`. Deploy with Vercel CLI or Git integration. Set environment variables (e.g. `JWT_SECRET`, `OPENAI_API_KEY`, MongoDB URI) in the Vercel project settings.

---

## License

ISC (see `package.json`).
