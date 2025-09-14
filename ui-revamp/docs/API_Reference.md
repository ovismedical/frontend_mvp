# API Reference

This document lists the expected API endpoints for backend integration, based on the mock data files in `src/data/`.

## Endpoints

### 1. Appointments
- **Endpoint:** `/api/appointments`
- **Method:** GET
- **Mock file:** `src/data/appointments.json`
- **Response Example:**
```json
{
  "appointments": [
    {
      "id": 1,
      "doctorId": 2,
      "userId": 3,
      "date": "2025-09-13T10:00:00Z",
      "status": "confirmed"
    }
  ]
}
```
- **TODO:** Define POST/PUT payloads for creating/updating appointments
**POST/PUT Payload Example:**
```json
{
  "doctorId": 2,
  "userId": 3,
  "date": "2025-09-13T10:00:00Z",
  "status": "confirmed", // scheduled, completed, cancelled
  "notes": "Follow-up required", // optional
  "timeslotId": 1
}
```

### 2. Articles
- **Endpoint:** `/api/articles`
- **Method:** GET
- **Mock file:** `src/data/articles.json`
- **Response Example:**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "Health Tips",
      "content": "...",
      "author": "Dr. Smith"
    }
  ]
}
```
- **TODO:** Define POST/PUT payloads for creating/updating articles
**POST/PUT Payload Example:**
```json
{
  "title": "Health Tips",
  "content": "...",
  "author": "Dr. Smith",
  "publishedAt": "2025-09-14T09:00:00Z",
  "tags": ["wellness", "tips"] // optional
}
```

### 3. Doctors
- **Endpoint:** `/api/doctors`
- **Method:** GET
- **Mock file:** `src/data/doctors.json`
- **Response Example:**
```json
{
  "doctors": [
    {
      "id": 2,
      "name": "Dr. Smith",
      "specialty": "Oncology"
    }
  ]
}
```
- **TODO:** Define POST/PUT payloads for creating/updating doctors
**POST/PUT Payload Example:**
```json
{
  "name": "Dr. Smith",
  "specialty": "Oncology",
  "profileImageUrl": "https://...", // optional
  "bio": "Expert in cancer treatment.", // optional
  "contactInfo": "dr.smith@hospital.com" // optional
}
```

### 4. Medications
- **Endpoint:** `/api/medications`
- **Method:** GET
- **Mock file:** `src/data/medications.json`
- **Response Example:**
```json
{
  "medications": [
    {
      "id": 1,
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "daily"
    }
  ]
}
```
- **TODO:** Define POST/PUT payloads for creating/updating medications
**POST/PUT Payload Example:**
```json
{
  "name": "Paracetamol",
  "dosage": "500mg",
  "frequency": "daily",
  "imageUrl": "https://...", // optional
  "description": "Pain relief medication." // optional
}
```

### 5. Time Slots
- **Endpoint:** `/api/timeSlots`
- **Method:** GET
- **Mock file:** `src/data/timeSlots.json`
- **Response Example:**
```json
{
  "timeSlots": [
    {
      "id": 1,
      "start": "09:00",
      "end": "10:00"
    }
  ]
}
```
- **TODO:** Define POST/PUT payloads for creating/updating time slots
**POST/PUT Payload Example:**
```json
{
  "doctorId": 2,
  "start": "2025-09-13T09:00:00Z",
  "end": "2025-09-13T10:00:00Z"
}
```

### 6. Users
- **Endpoint:** `/api/users`
- **Method:** GET
- **Mock file:** `src/data/users.json`
- **Response Example:**
```json
{
  "users": [
    {
      "id": 3,
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  ]
}
```
- **TODO:** Define POST/PUT payloads for creating/updating users
**POST/PUT Payload Example:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "plaintext-or-hash", // for registration only
  "avatarUrl": "https://...", // optional
  "dateOfBirth": "1990-01-01", // optional
  "gender": "female", // optional
  "isActive": true
}
```
