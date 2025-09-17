
# OVIS UI Revamp

A modern React + Vite web application for healthcare and wellness management.

## Features
- User authentication & onboarding
- Medication tracking
- Achievements & badges
- Appointments
- Chatbot (text & voice)
- Multi-language support
- Articles & help center

## Prerequisites
- Node.js (v18+ recommended)
- npm

## Installation & Setup

```bash
git clone "project URL"
cd ovis-ui-revamp
npm install
```

### Environment Variables
Create a `.env` file in the project root for sensitive config (API endpoints, keys, etc.). Example:

```env
VITE_API_URL=https://your-api-url.com
```

## Running Locally

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## Project Structure

```
src/
├── App.jsx              # Main app and routing
├── main.jsx             # Entry point
├── i18n.js              # i18next config
├── assets/              # Images and static assets
│   └── images/          # App images (avatars, onboarding, etc.)
├── components/          # Reusable UI and layout components
│   ├── layout/          # Layout components (nav, header, cards)
│   ├── picker/          # Picker UI components (date, fitness, etc.)
│   └── ui/              # General UI elements (buttons, modals, etc.)
├── context/             # Context providers (auth, scale)
├── data/                # Static JSON data (appointments, articles, etc.)
├── hooks/               # Custom React hooks
├── locales/             # Language files for i18n
├── pages/               # Main app pages (home, onboarding, medication, etc.)
├── styles/              # CSS files
│   ├── components/      # Component-specific styles
│   └── pages/           # Page-specific styles
├── utils/               # Utility functions
public/                  # Static files (favicon, vite.svg, etc.)
```

## Backend/API Integration
Currently, all data is local and mock data is stored under `src/data/` as JSON files. Backend API integration is **not yet connected**.

Comments in the code indicate where API calls should be placed for future backend integration. To swap to real APIs, update the functions in `src/services/api.js`.

## Documentation for Backend Developers
- See [`API_REFERENCE.md`](./docs/API_Reference.md) for expected API endpoints and response formats.
- See [`DATABASE_STRUCTURE.md`](./docs/Database_Structure.md) for suggested database schema and relationships.
- See [`FRONTEND_DATA_INTEGRATION.md`](./docs/Frontend_Data_Integration.md) for a summary of all frontend locations where hardcoded data should be replaced with API calls, and guidance on integrating backend data throughout the app.
