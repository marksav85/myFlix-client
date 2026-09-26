---
artifactId: CONTEXT_SUMMARY
packId: "2026-09-26T20:00:43Z"
generatedAt: "2026-09-26T20:00:43Z"
generator: "prompt--artifact--generate-context-summary.md"
---

# myFlix-client context summary

## Project type

Legacy React single-page movie catalogue client built with Parcel. It is a JavaScript/JSX application with Tailwind directives and a small global SCSS stylesheet.

## Routing

React Router v6 `BrowserRouter` is mounted inside `MainView`. The application uses custom client-side routes rather than Next.js routing:

- `/login` for authentication
- `/signup` for registration
- `/` for the authenticated movie list and client-side title filter
- `/movies/:movieId` for a selected movie
- `/profile` for account management and favourite movies

Routes redirect unauthenticated users to `/login`; logged-in users are redirected from login and signup to `/`.

## Source scope

The source root is `src/`. `SRC_TREE.json` contains 12 JavaScript/JSX source files in 9 included directories. `src/index.jsx` mounts the root component, wraps it in `AppProvider`, and renders `MainView`.

## Component architecture

`MainView` owns the main application state: current user, token, fetched movie list, and title filter. It coordinates the router and renders the navigation, authentication views, movie list/detail view, and profile view.

Feature components are grouped by view beneath `src/components/`: login, signup, main, movie card, movie detail, navigation, and profile. The profile feature is split into `ProfileView`, `UserInfo`, `UpdateUser`, and `FavoriteMovies`. Components communicate through props; no Redux store is present.

## State and API integration

`AppContext` provides one hard-coded API base URL: `https://movie-api-mreb.onrender.com`. Authentication state is initialized from browser `localStorage` keys `user` and `token`. The token is sent as a Bearer token for protected movie and user requests. The API response is locally mapped from capitalized server fields (for example, `Title` and `FavoriteMovies`) to the movie-card shape used in the UI.

## Supporting configuration

`package.json` declares Parcel start/build scripts and no working automated test command. `netlify.toml` supplies a single-page-app redirect from all paths to `/`. Tailwind scans `src/**/*.{js,jsx,ts,tsx}` and adds a `customDark` colour. ESLint uses the recommended and React plugin configurations. No environment-file contract is present; the API endpoint is source-coded.

## Legacy baseline signals

The repository uses React 18 and React Router 6 but keeps all application-level state in one route-owning component and relies on browser local storage. Bootstrap and React Bootstrap are installed, while the inspected source uses Tailwind classes and no Bootstrap imports. The README names React Redux as a requirement, but the inspected implementation uses Context plus local state instead.
