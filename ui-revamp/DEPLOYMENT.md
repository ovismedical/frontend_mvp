# Deployment Guide

## Environment Configuration

### Development (Local)
- Uses `.env.local` file
- API URL: `http://localhost:8000`
- Run with: `npm run dev`

### Production (Cloudflare Pages)
- Uses environment variables set in Cloudflare Pages dashboard
- API URL: `https://ovis-backend-mvp.onrender.com`
- Build with: `npm run build`

## Cloudflare Pages Configuration

### 1. Environment Variables
In your Cloudflare Pages dashboard, go to Settings > Environment Variables and add:

```
VITE_API_URL = https://ovis-backend-mvp.onrender.com
VITE_ENVIRONMENT = production
```

### 2. Build Settings
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (or your frontend folder path)

### 3. Custom Domain (Optional)
- Go to Custom domains in Cloudflare Pages
- Add your domain and follow the DNS setup instructions

## Local Development Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Start local development:
   ```bash
   npm run dev
   ```

3. Make sure your local backend is running on `http://localhost:8000`

## Build Commands

- **Development build**: `npm run build:dev` (uses local backend)
- **Production build**: `npm run build` (uses production backend)
- **Local development**: `npm run dev` (uses local backend)

## Environment Priority

Vite loads environment variables in this order:
1. `.env.production.local` (highest priority)
2. `.env.local`
3. `.env.production`
4. `.env` (lowest priority)

For production builds, Vite automatically uses `.env.production` and `.env.production.local` files.
