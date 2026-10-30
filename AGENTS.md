# myFlix React Client

## Project overview

This repository contains the React frontend for browsing movies and managing myFlix accounts. It communicates with a separately maintained Movie API, which owns authentication, authorization, persistence, and server-side validation.

## Architecture and integration

- `src/components/main-view/` defines browser routes and loads the movie catalogue; feature views live under `src/components/`.
- `src/contexts/AppContext.jsx` owns shared user and session state. `src/api/` centralizes API configuration, requests, and endpoint methods.
- Preserve the Movie API contract when changing requests or user data: existing routes, PascalCase fields, authentication headers, and response handling are shared integration behavior. Frontend checks do not replace backend validation or authorization.
- The frontend bundle uses a public API base URL configured at build time. Do not treat frontend configuration as a place for secrets.
- `wrangler.jsonc` configures static asset serving and SPA fallback; `README.md` documents setup and deployment details.

## Repository orientation

- `src/components/` — navigation, authentication, movie, and profile UI.
- `src/hooks/` and `src/contexts/` — reusable UI behavior and shared session state.
- `src/api/` — backend integration.
- `docs/design-assets/` — retained design specification and source artwork.
