---
artifactId: CONTEXT_SUMMARY
packId: "2026-10-02T14:29:24Z"
generatedAt: "2026-10-02T14:29:24Z"
generator: "prompt--artifact--generate-context-summary.md"
---

# myFlix React Client — Context Summary

## Project and source scope

Portfolio movie-library SPA using React 18, React Router 6, Parcel 2, and Tailwind
CSS 3. The separate movie-api REST backend owns authentication, catalog data, and
user accounts. This pack describes the finished refactor and Cinematic Obsidian
redesign in the current working tree, including intentional uncommitted files.

`SRC_TREE.json` covers 16 JavaScript/JSX files in 13 directories under
`src/`, including test setup; `.test` files, CSS, HTML, and static assets are
excluded by its generator. Empty source directories are retained. The snapshot
includes 15 runtime JavaScript/JSX files; test setup is excluded from the snapshot.

## Entrypoints and routes

`src/index.html` is Parcel's entry; `src/index.jsx` validates API configuration,
mounts React with createRoot, imports global CSS, and wraps MainView in AppProvider.
`src/components/main-view/main-view.jsx` owns BrowserRouter and five screen routes:

- `/login`: login; authenticated users redirect to `/`.
- `/signup`: registration; authenticated users redirect to `/`.
- `/`: authenticated Movie Library with case-insensitive title substring search.
- `/movies/:movieId`: authenticated detail resolved from the fetched catalog.
- `/profile`: authenticated account information, editing, favorites, and deletion.

Unauthenticated protected routes redirect to `/login`. No catch-all route exists.
Movie loading uses AbortController and maps backend fields to the client model:
`id`, `title`, `description`, `genre`, `director`, and `image`. Missing genre or
director names use an Unknown fallback. Loading, request failure, empty catalog,
no matching titles, and missing detail records have distinct user-facing states.

## State and API architecture

`src/contexts/AppContext.jsx` provides user/token state, session notices, login,
logout, updateUser, and shared API-error handling. Storage keys are `user` and
`token` in localStorage. Incomplete pairs, invalid JSON, and stored users without
Username are cleared on restoration. Restoration does not verify token validity.
Protected-request ApiError status 401/403 logs out and shows a sign-in notice.
Logout and successful account deletion clear both keys. There is no Redux state.

`src/api/config.js` requires `MYFLIX_API_BASE_URL`, trims it, and removes trailing
slashes. `.env.example` contains only public browser configuration with a local
backend URL. Parcel consumes the variable when bundling; never put secrets in it.
`.env` is ignored and must remain untracked. All configured values are client-visible.

`src/api/client.js` centralizes fetch, JSON bodies/responses, Bearer headers,
encoded username/movie path segments, structured ApiError status, and empty or
204 responses. Methods use POST `/login`, POST `/users`, GET `/movies`, PUT/DELETE
`/users/:username`, and POST/DELETE `/users/:username/movies/:movieId`.
Views display safe fixed failure messages rather than raw server details.

## Components and shared behaviors

`components/` separates navigation, login, signup, main/library, movie-card,
movie-view, and profile-view. Profile composes UserInfo, UpdateUser, and
FavoriteMovies. FavoriteMovies renders the same MovieCard as the library with
level-three headings. MovieView displays full supported metadata and a Back to
Movies link; no streaming, trailers, ratings, sorting, or genre filters are added.

`src/hooks/useFavorite.js` derives membership from user.FavoriteMovies. Cards and
detail views share POST/DELETE toggling, pending/request guards, safe failure
feedback, and Context updates from the API-returned user. Successful mutations
persist returned state; failures preserve it unless session expiry clears auth.
Pending/error state is per hook instance; membership is shared through Context.

Signup validates password confirmation locally and sends Username, Password,
Email, and Birthday. It announces account creation without automatically signing
in. Profile reads Birthday or legacy BirthDate, displays a normalized date, and
submits Username, Email, Birthday, plus Password only when nonblank. A changed
username requires signing in again. Update/delete operations guard duplicates.
Favorites distinguish loading, failures, no saved IDs, and unavailable catalog IDs.

## Design and interaction system

`docs/design/DESIGN.md` is the durable design specification. React implements
Cinematic Obsidian through semantic CSS variables in `src/index.css`, Tailwind
color mappings, typography, spacing, radii, and shared control/surface classes.
Canvas is #0B0F17; amber primary is #F59E0B and cyan focus is #38BDF8. Danger uses
#E11D48 at rest, #BE123C on hover/active, and #FFFFFF foreground.
Plus Jakarta Sans is a font-stack declaration only: no bundled or remote font;
system fallback renders when the face is unavailable locally.

The page container caps at 1440px with 16/32/48px responsive horizontal padding.
Movie grids use 1 column below 480px, 2 from 480px, 3 from 768px, and 4 from 1024px.
Detail stacks below 768px; account panels split from 1024px. Desktop navigation
starts at 640px; the mobile disclosure closes on selection, route/session change,
or Escape, restoring toggle focus on Escape.

Interaction includes a skip link, visible focus rings, labels/autocomplete,
associated error feedback, status/alert roles, aria-busy/pressed/current states,
44px practical control targets, and reduced-motion CSS. The deletion dialog is
portaled to document.body, initially focuses Cancel, traps focus, makes the root
inert, locks scrolling, and restores focus/scroll state on close. Escape is blocked
while deletion is pending; pending dialog controls are disabled.

`public/favicon.svg` is the canonical runtime asset, referenced as
`../public/favicon.svg` from src/index.html. Parcel emits a hashed SVG and rewrites
the HTML link. `docs/design/assets/myflix-icon-source.png` is documentation-only.
The old source PNG and tracked dist PNG are intentional pending deletions.
Generated dist/cache files remain ignored; no replacement dist artifact is intended
for tracking. Discarded Stitch exploration material is not part of durable docs.

## Tooling, validation, and deployment boundary

Node >=22.22.2 <25 and npm >=10 are supported; `.nvmrc` prefers Node 24.
Scripts: npm start (Parcel), npm test (Vitest run), npm run lint (ESLint on JS/JSX),
npm run build (Parcel production), and npm run check (lint then tests).
Vitest uses jsdom, React Testing Library, user-event, jest-dom, mocked fetch, and
`src/test/setup.js` cleanup with a synthetic API URL. Eight test files cover
registration/login, protected routes/session expiry, movie/search states,
favorites, profile updates/deletion, and keyboard/ARIA behavior. There is no
browser E2E or automated visual-regression suite.

The maintainer reports final lint, 42 tests, build, npm ls, favicon/hygiene checks,
and human browser acceptance passed. This documentation pass does not rerun
application validation. Accepted React Router v6 moderate advisories remain;
remediation requires the deliberately deferred Router v7 migration. Dependencies
are unchanged in this working-tree pass; the prior modernization is committed.

Parcel builds a static SPA into dist/. Set the public API URL before building;
the host must provide browser-route fallback and backend CORS must allow the
frontend. netlify.toml contains a catch-all rewrite to `/`. Hosting/backend
configuration is separate; no Contabo migration is represented as deployed.
