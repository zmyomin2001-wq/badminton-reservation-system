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