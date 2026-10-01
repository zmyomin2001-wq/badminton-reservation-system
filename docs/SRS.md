# Software Requirements Specification (SRS)

## Badminton Court Reservation System

### 1. System Objectives

Develop a web application that allows members to view badminton courts, make reservations, and manage their own bookings. Administrators can manage badminton courts.

### 2. Functional Requirements

- Members can register and log in.
- Members can view available badminton courts.
- Members can make reservations.
- Members can view and cancel their own reservations.
- Administrators can add, view, update, and delete courts.
- The system prevents double bookings for the same court and time slot.

### 3. Non-Functional Requirements

- Responsive interface using Angular and Bootstrap 5.
- Secure JWT authentication and role-based access control.
- Client-side and server-side form validation.
- Asynchronous data handling using RxJS Observables.
- The system uses MongoDB for data storage.

### 4. User Roles

- **Member:** Register, log in, view courts, make reservations, and manage personal reservations.
- **Administrator:** Manage badminton courts.