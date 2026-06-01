# ASOLAA SEO/GEO Internal Launch

## Backend Layer

The site uses React/Vite for the dashboard and Node/Express for the API. Neon Postgres is the primary backend database for internal authentication, SEO audits, strategy outputs, content briefs, publishing drafts, and backlink outreach drafts.

## Required Environment Variables

Add these to `.env` or your deployment environment:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=replace-with-a-long-random-secret
INTERNAL_SIGNUP_CODE=optional-invite-code-for-team-signup
DATAFORSEO_LOGIN=your-dataforseo-login-email
DATAFORSEO_PASSWORD=your-dataforseo-api-password
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
```

DataForSEO uses a login and API password pair. Keep both on the server only.

## Launch Commands

```bash
npm install
npm run db:schema
npm run dev:all
```

Open:

```text
http://localhost:5173/seo-geo
```

## Team Workflow

1. Create the first internal user through the signup screen. The first user becomes `admin`.
2. Run an SEO/GEO audit for a website URL and niche.
3. Review technical, content, schema, AI/GEO, and trust scores.
4. Generate the SEO strategy.
5. Create briefs from priority long-tail keywords.
6. Queue social drafts for human approval.
7. Prepare backlink outreach drafts for review before sending.

## Safety Rules

- No DataForSEO, Neon, or LLM secrets should be exposed in browser code.
- Publishing queue items are drafts until a human approves them.
- Backlink outreach is draft-only and must be reviewed by a team member.
- If DataForSEO or LLM keys are missing, the API returns fallback outputs and status metadata so the team can still test the workflow.
