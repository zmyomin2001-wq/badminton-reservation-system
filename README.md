# Badminton Court Reservation System

A web application for badminton court reservation.

## Team Member

| Name | Student ID |

|---|---|

| Myo Min Zaw | 671103025 |

## Features

- User registration and login

- JWT authentication

- View badminton courts

- Make court reservations

- View and cancel personal bookings

- Admin court management

- Prevent double bookings

- Responsive interface using Bootstrap 5

## System Architecture

The system uses a full-stack architecture:

```text

User

  |

  v

Angular Frontend

  |

  | HTTP Requests

  v

Node.js + Express Backend

  |

  v

MongoDB Database

```

### Docker Architecture

The backend and database run as separate Docker containers:

```text

Angular Frontend

       |

       | HTTP Requests

       v

+----------------------+

| Express API          |

| badminton-api        |

| Port: 3000           |

+----------------------+

       |

       | MongoDB Connection

       v

+----------------------+

| MongoDB              |

| badminton-mongodb    |

| Port: 27017          |

+----------------------+

       |

       v

MongoDB Persistent Volume

```

Both containers communicate through the Docker network defined in `docker-compose.yml`.

# API Documentation

## Base URL

```text

http://localhost:3000/api

```

## Authentication

Protected endpoints require a JWT Bearer token.

Include the token in the request header:

```http

Authorization: Bearer <JWT_TOKEN>

```

The JWT token is returned after a successful login and expires after 1 hour.

# 1. Authentication

## Register

### Endpoint

```http

POST /auth/register

```

### Request Body

```json

{

  "name": "John Doe",

  "email": "john@example.com",

  "password": "123456"

}

```

### Validation

- Name is required.

- Name must contain at least 2 characters.

- Email is required and must have a valid format.

- Password is required and must contain at least 6 characters.

- Email must be unique.

### Success Response

**201 Created**

```json

{

  "message": "Registration successful",

  "user": {

    "id": "USER_OBJECT_ID",

    "name": "John Doe",

    "email": "john@example.com"

  }

}

```

The password is never returned in the response.

### Error Responses

| Status | Description |

|---|---|

| 400 | All fields are required |

| 400 | Name must be at least 2 characters |

| 400 | Invalid email address |

| 400 | Password must be at least 6 characters |

| 409 | Email already registered |

| 500 | Server error |

## Login

### Endpoint

```http

POST /auth/login

```

### Request Body

```json

{

  "email": "john@example.com",

  "password": "123456"

}

```

### Success Response

**200 OK**

```json

{

  "message": "Login successful",

  "token": "JWT_TOKEN",

  "user": {

    "id": "USER_OBJECT_ID",

    "name": "John Doe",

    "email": "john@example.com",

    "role": "user"

  }

}

```

### Error Responses

| Status | Description |

|---|---|

| 400 | Email and password are required |

| 401 | Invalid email or password |

| 500 | Server error |

# 2. Court Management

Court management endpoints are protected by JWT authentication and require the `admin` role for create, update, and delete operations.

## Get All Courts

### Endpoint

```http

GET /courts

```

### Authentication

No authentication required.

### Success Response

**200 OK**

```json

[

  {

    "_id": "COURT_OBJECT_ID",

    "name": "Court 1",

    "pricePerHour": 100,

    "status": "active"

  }

]

```

Courts are sorted by name.

### Error Response

| Status | Description |

|---|---|

| 500 | Server error |

## Create Court

### Endpoint

```http

POST /courts

```

### Authentication

JWT + Admin required.

### Request Body

```json

{

  "name": "Court 1",

  "pricePerHour": 100,

  "status": "active"

}

```

### Validation

- `name` must be a non-empty string.

- `pricePerHour` must be a number greater than or equal to 0.

- `status` defaults to `active` if not provided.

### Success Response

**201 Created**

```json

{

  "_id": "COURT_OBJECT_ID",

  "name": "Court 1",

  "pricePerHour": 100,

  "status": "active"

}

```

### Error Responses

| Status | Description |

|---|---|

| 400 | Valid court name and price are required |

| 400 | Validation error |

| 401 | Authentication required |

| 403 | Admin permission required |

| 409 | Court name already exists |

| 500 | Server error |

## Update Court

### Endpoint

```http

PUT /courts/:id

```

### Authentication

JWT + Admin required.

### Request Body

```json

{

  "name": "Court 1",

  "pricePerHour": 120,

  "status": "active"

}

```

### Allowed Status Values

```text

active

maintenance

```

### Success Response

**200 OK**

```json

{

  "_id": "COURT_OBJECT_ID",

  "name": "Court 1",

  "pricePerHour": 120,

  "status": "active"

}

```

### Error Responses

| Status | Description |

|---|---|

| 400 | Invalid court ID |

| 400 | Valid court name and price are required |

| 400 | Invalid court status |

| 401 | Authentication required |

| 403 | Admin permission required |

| 404 | Court not found |

| 409 | Court name already exists |

| 500 | Server error |

## Delete Court

### Endpoint

```http

DELETE /courts/:id

```

### Authentication

JWT + Admin required.

### Success Response

**200 OK**

```json

{

  "message": "Court deleted successfully"

}

```

### Error Responses

| Status | Description |

|---|---|

| 400 | Invalid court ID |

| 401 | Authentication required |

| 403 | Admin permission required |

| 404 | Court not found |

| 500 | Server error |

# 3. Booking

All booking endpoints require JWT authentication.

## Create Booking

### Endpoint

```http

POST /bookings

## Create Booking

### Endpoint

```http

POST /bookings

```

### Authentication

JWT required.

### Request Body

```json

{

  "courtId": "COURT_OBJECT_ID",

  "date": "2026-10-05",

  "startTime": "10:00",

  "endTime": "11:00"

}

```

### Validation

- All fields are required.

- `courtId` must be a valid MongoDB ObjectId.

- Date must use `YYYY-MM-DD` format.

- Time must use `HH:mm` format.

- End time must be later than start time.

- The selected time must be in the future.

- The court must be active.

- Confirmed bookings cannot overlap.

### Success Response

**201 Created**

```json

{

  "message": "Booking successful",

  "booking": {

    "_id": "BOOKING_OBJECT_ID",

    "user": "USER_OBJECT_ID",

    "court": "COURT_OBJECT_ID",

    "date": "2026-10-05",

    "startTime": "10:00",

    "endTime": "11:00",

    "status": "confirmed"

  }

}

```

### Error Responses

| Status | Description |

|---|---|

| 400 | All fields are required |

| 400 | Invalid court ID |

| 400 | Invalid date or time format |

| 400 | Please select a valid future time |

| 400 | Court is unavailable |

| 401 | Authentication required |

| 409 | This court is already booked at that time |

| 500 | Server error |

## Update My Booking

### Endpoint

```http

PUT /bookings/

```

### Authentication

JWT required.

### URL Parameter

`` = Booking ObjectId

### Request Body

```json

{
"courtId": "COURT_OBJECT_ID",
"date": "2026-10-05",
"startTime": "15:00",
"endTime": "16:00"
}

```

### Validation

Booking ID must be a valid MongoDB ObjectId.

All fields are required.

`courtId` must be a valid MongoDB ObjectId.

Date must use `YYYY-MM-DD` format.

Time must use `HH` format.

The booking time must be in the future.

Start time must be earlier than end time.

The court must exist and have `active` status.

The new time must not overlap with another confirmed booking.

Cancelled bookings cannot be updated.

Users can only update their own bookings.

### Success Response

**200 OK**

```json

{
"message": "Booking updated successfully",
"booking": {
"_id": "BOOKING_OBJECT_ID",
"user": "USER_OBJECT_ID",
"court": "COURT_OBJECT_ID",
"date": "2026-10-05",
"startTime": "15:00",
"endTime": "16:00",
"status": "confirmed"
}
}

```

### Error Responses

| Status | Description |

|---|---|

| 400 | Invalid booking ID |

| 400 | All fields are required |

| 400 | Invalid court ID |

| 400 | Invalid date or time format |

| 400 | Please select a valid future time |

| 400 | Cannot update a cancelled booking |

| 400 | Court is unavailable |

| 401 | Authentication required |

| 404 | Booking not found |

| 409 | This court is already booked at that time |

| 500 | Server error |

## Get My Bookings

### Endpoint

```http

GET /bookings/my

```

### Authentication

JWT required.

### Success Response

**200 OK**

```json

[

  {

    "_id": "BOOKING_OBJECT_ID",

    "user": "USER_OBJECT_ID",

    "court": {

      "_id": "COURT_OBJECT_ID",

      "name": "Court 1",

      "pricePerHour": 100

    },

    "date": "2026-10-05",

    "startTime": "10:00",

    "endTime": "11:00",

    "status": "confirmed"

  }

]

```

Bookings are sorted by date and start time.

### Error Responses

| Status | Description |

|---|---|

| 401 | Authentication required |

| 500 | Server error |

## Cancel My Booking

### Endpoint

```http

PATCH /bookings/:id/cancel

```

### Authentication

JWT required.

### Success Response

**200 OK**

```json

{

  "message": "Booking cancelled successfully",

  "booking": {

    "_id": "BOOKING_OBJECT_ID",

    "status": "cancelled"

  }

}

```

### Error Responses

| Status | Description |

|---|---|

| 400 | Invalid booking ID |

| 400 | Booking is already cancelled |

| 401 | Authentication required |

| 404 | Booking not found |

| 500 | Server error |

## Delete My Booking

### Endpoint

```http

DELETE /bookings/

```

### Authentication

JWT required.

### URL Parameter

`` = Booking ObjectId

### Success Response

**200 OK**

```json

{
"message": "Booking deleted successfully"
}

```

### Error Responses

| Status | Description |

|---|---|

| 400 | Invalid booking ID |

| 401 | Authentication required |

| 404 | Booking not found |

| 500 | Server error |

# HTTP Status Codes

| Status Code | Meaning |

|---|---|

| 200 | Request successful |

| 201 | Resource created successfully |

| 400 | Bad request / validation error |

| 401 | Authentication required or invalid credentials |

| 403 | Permission denied |

| 404 | Resource not found |

| 409 | Conflict |

| 500 | Internal server error |

# Docker Setup

## Requirements

- Docker Desktop

- Docker Compose

## Start the Backend

Open a terminal in the `backend` directory:

```bash

docker compose up -d --build

```

## Check Running Containers

```bash

docker compose ps

```

The following containers should be running:

```text

badminton-api

badminton-mongodb

```

## Stop Containers

```bash

docker compose down

```

MongoDB data is stored in a persistent Docker volume.

# Project Structure

```text

badminton-reservation-system/

├── backend/

│   ├── .dockerignore

│   ├── .env.example

│   ├── .gitignore

│   ├── Dockerfile

│   ├── docker-compose.yml

│   ├── package.json

│   ├── server.js

│   └── src/

│       ├── config/

│       │   └── database.js

│       ├── controllers/

│       │   ├── auth-controller.js

│       │   ├── court-controller.js

│       │   └── booking-controller.js

│       ├── middleware/

│       │   ├── auth-middleware.js

│       │   └── admin-middleware.js

│       ├── models/

│       │   ├── user-model.js

│       │   ├── court-model.js

│       │   └── booking-model.js

│       └── routes/

│           ├── auth-routes.js

│           ├── court-routes.js

│           └── booking-routes.js

│

├── docs/

│   ├── architecture-diagram.png

│   └── er-diagram.png

│

├── frontend/

│

└── README.md

```

# Technologies

## Frontend

- Angular

- Bootstrap 5

## Backend

- Node.js

- Express.js

- Mongoose

- MongoDB

- JSON Web Token (JWT)

- bcryptjs

- CORS

- dotenv

## Deployment / Development

- Docker

- Docker Compose

- Git

- GitHub

# Security

The backend implements the following security features:

- Password hashing with bcryptjs

- JWT-based authentication

- Bearer token authentication

- Admin role authorization

- Passwords are never returned in API responses

- Protected booking operations

- Protected admin court management

- Environment variables for sensitive configuration

- `.env` excluded from Git using `.gitignore`