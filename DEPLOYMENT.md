# Render Deployment

## Recommended Service

Deploy this repo as one Render Web Service. Express serves both `/api/*` routes and the Vite production build from `dist/`.

## Render Settings

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`
- Runtime: Node

The included `render.yaml` can be used as a Render Blueprint.

## Required Environment Variables

Set these in Render. Do not commit production secrets.

```env
DATABASE_URL=...
AUTH_SECRET=...
INTERNAL_SIGNUP_CODE=...
DATAFORSEO_LOGIN=...
DATAFORSEO_PASSWORD=...
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...
NODE_ENV=production
```

## After Deploy

1. Open `/api/health`.
2. Open `/api/seo/status` and confirm Neon, DataForSEO, and Anthropic are configured.
3. Sign up the first internal user. The first account becomes `admin`.
4. Run the Applaa Education preset audit.
5. Run the Sanathan preset audit.
