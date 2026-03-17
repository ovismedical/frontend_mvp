# OVIS Frontend

React + Vite web application for the OVIS healthcare platform. Features patient dashboards, AI nurse chat (Florence), symptom tracking, medication management, and multi-language support (EN/ZH).

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
cd frontend_mvp
npm install
```

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=http://localhost:8000
```

The Vite dev server proxies `/api` requests to `localhost:8000` automatically via [vite.config.js](vite.config.js).

## Running

```bash
npm run dev
```

Open http://localhost:5173 in your browser. Make sure the backend is running on port 8000.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── App.jsx              # Main app and routing
├── main.jsx             # Entry point
├── i18n.js              # i18next config (EN/ZH)
├── assets/              # Images and static assets
├── components/          # Reusable UI and layout components
│   ├── layout/          # Nav, header, cards
│   ├── picker/          # Date, fitness pickers
│   ├── questionnaire/   # Symptom questionnaire components
│   └── ui/              # Buttons, modals, general UI
├── context/             # React context providers (auth, scale)
├── fixtures/            # Static JSON mock data (appointments, articles, etc.)
├── hooks/               # Custom React hooks
├── locales/             # i18n language files (en/, zh/)
├── pages/               # App pages
│   ├── patient/         # Patient views (dashboards, medication, etc.)
│   ├── doctor/          # Doctor views
│   └── onboarding/      # Onboarding flow
├── styles/              # CSS files
│   ├── components/      # Component-specific styles
│   └── pages/           # Page-specific styles
└── utils/               # Utility functions and API helpers
```

## Backend Integration

API calls are made through utility functions in `src/utils/api.js`. The Vite proxy forwards `/api` requests to the backend during development.

For production deployment, see [Deployment Guide](../docs/deployment.md).

## Documentation

Additional docs in the project root [`docs/`](../docs/) directory:

- [API Reference](../docs/api-reference.md) - Expected API endpoints and response formats
- [Database Structure](../docs/database-structure.md) - Suggested database schema
- [Frontend Data Integration](../docs/frontend-data-integration.md) - Where hardcoded data needs API replacement
- [Deployment Guide](../docs/deployment.md) - Cloudflare Pages deployment
