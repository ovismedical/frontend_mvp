# Database Structure Suggestion

Based on the mock data in `src/data/`, here is a comprehensive suggested database schema for backend integration.

**Note:** This suggested database schema might miss some smaller details that are assigned as constants in code files. For additional context, please refer to any "Backend Handling" or "To do" comments in the codebase.

## Core Entities

### 1. User
- `id`: integer, primary key
- `name`: string
- `email`: string, unique
- `password_hash`: string
- `avatar_url`: string (optional)
- `date_of_birth`: date (optional)
- `gender`: string (optional)
- `created_at`: datetime
- `updated_at`: datetime
- `is_active`: boolean

### 2. Doctor
- `id`: integer, primary key
- `name`: string
- `specialty`: string
- `profile_image_url`: string (optional)
- `bio`: text (optional)
- `contact_info`: string (optional)

### 3. Appointment
- `id`: integer, primary key
- `doctor_id`: integer, foreign key → Doctor
- `user_id`: integer, foreign key → User
- `date`: datetime
- `status`: string (e.g., scheduled, completed, cancelled)
- `notes`: text (optional)
- `timeslot_id`: integer, foreign key → TimeSlot

### 4. Article
- `id`: integer, primary key
- `title`: string
- `content`: text
- `author`: string
- `published_at`: datetime
- `tags`: array of strings (optional)

### 5. Medication
- `id`: integer, primary key
- `name`: string
- `dosage`: string
- `frequency`: string
- `image_url`: string (optional)
- `description`: text (optional)

### 6. UserMedication
- `id`: integer, primary key
- `user_id`: integer, foreign key → User
- `medication_id`: integer, foreign key → Medication
- `start_date`: date
- `end_date`: date (optional)
- `status`: string (e.g., active, completed, discontinued)

### 7. TimeSlot (Doctor Availability)
- `id`: integer, primary key
- `doctor_id`: integer, foreign key → Doctor
- `start`: datetime
- `end`: datetime

---

## Onboarding & Assessment

### 8. OnboardingAssessment
- `id`: integer, primary key
- `user_id`: integer, foreign key → User
- `step`: integer
- `completed_at`: datetime
- `responses`: JSON (stores answers to assessment questions)

### 9. Achievement
- `id`: integer, primary key
- `title`: string
- `description`: text
- `icon_url`: string (optional)

### 10. UserAchievement
- `id`: integer, primary key
- `user_id`: integer, foreign key → User
- `achievement_id`: integer, foreign key → Achievement
- `awarded_at`: datetime

---

## Notifications & Events

### 11. Notification
- `id`: integer, primary key
- `user_id`: integer, foreign key → User
- `type`: string (e.g., appointment, medication, system)
- `message`: text
- `created_at`: datetime
- `is_read`: boolean

### 12. Event
- `id`: integer, primary key
- `user_id`: integer, foreign key → User
- `type`: string (e.g., check-in, milestone)
- `details`: JSON
- `date`: datetime

---

## General Items

- **User Registration**: Store registration date, verification status, and password reset tokens.
- **User Onboarding**: Track onboarding progress and assessment responses.
- **User Preferences**: Store language, notification settings, and theme preferences.
- **Audit Logs**: Track user actions for security and analytics.

---

## Relationships

- **Appointment** links `User`, `Doctor`, and `TimeSlot`.
- **UserMedication** links `User` and `Medication`.
- **OnboardingAssessment** and **UserAchievement** link to `User`.
- **Notification** and **Event** are user-specific.

