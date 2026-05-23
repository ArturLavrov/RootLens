RootLence frontend prototype

This scaffold follows the frontend architecture specified in rootlence/docs/architecture/frontend-architecture.md.

Quick start:

1. cd apps/web
2. npm install
3. npm run dev

Notes:
- Uses Vite + React + TypeScript + Tailwind for a simple static SPA suitable for S3 + CloudFront deployment.
- Images from /assets/img are copied into apps/web/public/assets in this scaffold so they are served by the dev server.
