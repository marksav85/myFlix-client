---
artifactId: CONTEXT_SUMMARY
packId: "2026-10-09T13:50:22Z"
generatedAt: "2026-10-09T13:50:22Z"
generator: "prompt--artifact--generate-context-summary.md"
---

# myFlix React Client — Context Summary

## Project and source scope

React 18 movie-library SPA using React Router 6, Parcel 2, and Tailwind CSS 3.
The separate movie-api REST backend owns authentication, movies, and accounts.
`SRC_TREE.json` covers 16 JavaScript/JSX files in 12 directories under
`src/`, including test setup. Tests, stories, mocks, CSS, HTML, and static assets
are excluded from the source tree; empty source directories are retained.
One snapshot contains 15 runtime JavaScript/JSX files, excluding test setup.

## Entrypoints and routes

`src/index.html` is Parcel's entry. `src/index.jsx` validates API configuration,
mounts React with createRoot, imports global CSS, and wraps MainView in AppProvider.
`src/components/main-view/main-view.jsx` owns BrowserRouter and five screen routes:

- `/login`: login; signed-in users redirect to `/`.
- `/signup`: registration; signed-in users redirect to `/`.
- `/`: protected movie library with case-insensitive title substring search.
- `/movies/:movieId`: protected detail resolved from the fetched movie collection.
- `/profile`: protected account information, editing, favorites, and deletion.

Unauthenticated protected routes redirect to `/login`. No catch-all route exists.
Movie loading uses AbortController and maps backend fields to `id`, `title`,
`description`, `genre`, `director`, and `image`. Missing genre/director names use
an Unknown fallback. Loading, error, empty, search, and missing-detail states
have distinct feedback. Movies and search state are local to MainView.

## State, authentication, and API

`src/contexts/AppContext.jsx` shares user/token state, session notices, login,
logout, user updates, and API-error handling through React Context.
User and token persist under `user` and `token` in localStorage. Incomplete pairs,
invalid JSON, and stored users without Username are cleared during restoration.
Restoration does not validate token expiry. Handled protected-request ApiError
401/403 responses clear the session and prompt sign-in. Logout and successful
account deletion also clear storage. There is no Redux store.

`src/api/config.js` requires `MYFLIX_API_BASE_URL`, trims whitespace, and removes
trailing slashes. Parcel embeds this public setting during bundling. Local setup
uses the tracked `.env.example` template and an ignored `.env`; ignored environment
files and their contents are excluded from this pack. Changing the production
setting requires rebuilding and redeploying, not just changing a runtime binding.

`src/api/client.js` centralizes fetch, JSON bodies/responses, Bearer headers,
encoded path segments, structured ApiError status, and empty/204 responses.
Endpoints: POST `/login`, POST `/users`, GET `/movies`, PUT/DELETE
`/users/:username`, and POST/DELETE `/users/:username/movies/:movieId`.
Profile-update 422 validation errors identifying a required Password map to
password-specific feedback. Views otherwise show fixed failure messages.

## Components and account behavior

Components separate navigation, login, signup, library, cards, movie details,
and profile. Profile composes UserInfo, UpdateUser, and FavoriteMovies.
FavoriteMovies reuses MovieCard. `src/hooks/useFavorite.js` derives membership
from user.FavoriteMovies, guards duplicate requests, toggles via POST/DELETE,
and persists the API-returned user through Context. Pending/error state is local
to each hook instance; membership is shared through Context.

Signup checks password confirmation locally and sends Username, Password, Email,
and Birthday; account creation does not automatically sign in. Profile supports
Birthday or legacy BirthDate and normalizes dates for inputs. Every profile save,
including other account-detail changes, requires a password of at least five
characters and sends Username, Email, Birthday, and Password. The UI instructs
users to enter the current password to retain it or a different one to change it.
Changing Username signs out. Update/delete requests guard duplicates.
Deletion requires confirmation in the Danger Zone.

## Design and documentation

`README.md` documents features, setup, scripts, sessions, and deployment.
`docs/design/DESIGN.md` retains the Cinematic Obsidian specification and required
profile-password behavior. `src/index.css` defines semantic tokens and shared
controls; `tailwind.config.js` maps colors, typography, spacing, and radii.
Dark surfaces use amber primary controls and cyan focus accents. Plus Jakarta
Sans is a font-stack declaration with system fallbacks, not a bundled font.
Responsive layouts include library grids, detail panels, and mobile navigation.

Accessibility provisions include a skip link, visible focus, labelled inputs,
status/error feedback, reduced-motion support, and keyboard navigation.
The deletion dialog is portaled, traps focus, makes the root inert, locks scrolling,
and restores focus on close. Pending deletion disables controls and blocks Escape.
`public/favicon.svg` is the runtime favicon referenced by `src/index.html`.
`docs/design/assets/myflix-icon-source.png` is documentation-only reference art.
Build output and caches remain ignored.

## Tooling and validation scope

Node requirements are >=22.22.2 <25, npm >=10; `.nvmrc` selects Node 24.
Scripts: `npm start` (Parcel development), `npm run build` (Parcel production),
`npm test` (Vitest once), `npm run test:watch`, `npm run lint`, and `npm run check`
(lint then tests). Current declarations, including allowScripts, are embedded
in `PROJECT_OVERVIEW.json`; exact dependency resolutions reside in package-lock.json.
Vitest uses jsdom, React Testing Library, user-event, and jest-dom with mocked fetch.
Test setup resets storage, history, and mocks. Coverage includes auth/routes,
API interactions, favorites, profile actions, and keyboard/ARIA behavior.
No browser E2E or visual-regression suite is documented. This generation verifies
artifact consistency; it does not rerun application tests, builds, or security scans
and makes no current pass-count or security-advisory claims.

## Cloudflare Workers deployment

The README records Worker `myflix-react`, repository `marksav85/myFlix-client`,
and production branch `refactor/portfolio-update`. Cloudflare manages deployment
configuration externally; no Wrangler configuration is tracked.
Build command: `npm run build`; deploy command: `npx wrangler deploy`.
Root directory: `/`; static output: `dist/`; build Node: `24.21.0`;
Worker compatibility date: `2026-10-06`. The build environment supplies
`MYFLIX_API_BASE_URL` before Parcel generates browser assets.

React: https://react.myflix.marksavilledesigns.com
Workers: https://myflix-react.marksav85.workers.dev
API: https://api.myflix.marksavilledesigns.com
Related Angular client: https://angular.myflix.marksavilledesigns.com

The API runs on Contabo using Docker and Caddy, connected to MongoDB Atlas.
Backend CORS must allow the frontend origin. React Router deep links require
index.html fallback for unmatched page-navigation requests; the exact production
fallback setting remains unverified. No production infrastructure was accessed.
