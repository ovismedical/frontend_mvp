# Frontend Data Integration Summary

This document lists all places in the codebase where hardcoded `const` data is used and should be replaced with API calls, as well as all locations where data should be fetched (GET) or pushed (POST/PUT/DELETE) for backend integration. This is based on standard React patterns and your folder structure.

---

## Pages: Hardcoded Data to Replace

| File                                      | Hardcoded Const Data Example         | Purpose/Should Fetch From API         |
|-------------------------------------------|-------------------------------------|---------------------------------------|
| `help_center.jsx`                         | `quickStartGuides`                  | Guides/FAQs                          |
| `home.jsx`                                | `notifications`, `achievements`     | User notifications, achievements     |
| `medication/medication.jsx`               | `medications`                       | Medication list                      |
| `medication/medication_details.jsx`       | `medicationDetails`                 | Medication details                   |
| `dashboards/dashboard.jsx`                | `stats`, `progress`                 | Dashboard stats, progress            |
| `dashboards/daily.jsx`                    | `dailyStats`                        | Daily dashboard data                 |
| `dashboards/weekly.jsx`                   | `weeklyStats`                       | Weekly dashboard data                |
| `dashboards/monthly.jsx`                  | `monthlyStats`                      | Monthly dashboard data               |
| `articles/articles.jsx`                   | `articles`                          | Articles list                        |
| `articles/articles_details.jsx`           | `articleDetails`                    | Article details                      |
| `appointments/appointment_scheduler.jsx`  | `appointments`, `timeSlots`         | Appointments, available slots        |
| `appointments/appointment.jsx`            | `appointmentDetails`                | Appointment details                  |
| `achievements/achievements_library.jsx`   | `achievementsLibrary`               | Achievements library                 |
| `achievements/achievements.jsx`           | `achievements`                      | Achievements list                    |
| `achievements/badge_details.jsx`          | `badgeDetails`                      | Badge details                        |

---

## Pages: Data Fetch/Push Locations

- **Fetch (GET):**
  - User info, notifications, achievements, medication, appointments, articles, dashboard stats, onboarding content, settings, FAQs, guides, time slots, badge details, etc.
- **Push (POST/PUT/DELETE):**
  - Login, registration, password reset, OTP verification, add/edit medication, schedule/cancel appointment, update profile/settings, add comments, invite users, etc.

---

## Components: Hardcoded Data to Replace

| File                                      | Hardcoded Const Data Example         | Purpose/Should Fetch From API         |
|-------------------------------------------|-------------------------------------|---------------------------------------|
| `layout/homeNotifications.jsx`            | `notifications`                     | User notifications                   |
| `layout/todaysMedication.jsx`             | `todaysMedications`                 | Today's medications                  |
| `layout/medication_list.jsx`              | `medicationList`                    | Medication list                      |
| `layout/careLibrary.jsx`                  | `careLibraryItems`                  | Care library items                   |
| `layout/wellnessCard.jsx`                 | `wellnessStats`                     | Wellness stats                       |

---

## Components: Data Fetch/Push Locations

- **Fetch (GET):**
  - Notifications, medication, care library, wellness stats, user header info, etc.
- **Push (POST/PUT/DELETE):**
  - Login/register form submission, medication updates, profile changes, etc.

---

## General Guidance

- All hardcoded `const` data should be replaced with API calls using the service layer (`src/services/api.js`).
- Use React hooks (`useEffect`, `useState`) for data fetching.
- Use service functions for all data push operations.
- Add TODO comments in code to indicate where changes are needed for backend integration.

---

Note: In-line comments such as `// Backend Handling:` or `// TODO: ` have been added throughout the codebase to clearly indicate where data should be fetched from or pushed to the backend. These comments mark all major logic points for backend interaction, making it easier to identify integration tasks.

Backend developers can use this summary to identify all places where frontend data integration is required and update the code accordingly.