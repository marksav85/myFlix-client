# Development Handbook

This handbook describes the current myFlix React implementation. `README.md` is the project introduction; the [Operations Runbook](operations-runbook.md) covers local setup, builds, deployment boundaries, and maintenance.

## Application structure

`src/index.html` is the Parcel entry document. `src/index.jsx` validates the public API base URL, mounts the React root, and wraps the application in `AppProvider`. `MainView` in `src/components/main-view/main-view.jsx` owns the `BrowserRouter`, route definitions, and movie catalogue loading.

The browser routes are `/login`, `/signup`, `/`, `/movies/:movieId`, and `/profile`. Login and signup routes redirect signed-in users to the library. The library, movie-detail, and profile views redirect signed-out visitors to login. These guards shape the interface; authorization remains the Movie API's responsibility.

Feature components live under `src/components/`:

- `navigation-bar/` provides signed-in/signed-out links and a responsive menu.
- `login-view/` and `signup-view/` handle authentication forms and feedback.
- `movie-card/` and `movie-view/` render catalogue items and details.
- `profile-view/` presents account data, profile editing, favorites, and account deletion.

`src/index.css` contains global styles, shared component classes, and design tokens. `tailwind.config.js` maps utility classes to the project's semantic colors, typography, and spacing. Retained design references are in `docs/design-assets/`.

## Session and API integration

`src/contexts/AppContext.jsx` owns the current user, token, session notices, login/logout, and persisted session state. It stores the user and token in `localStorage`; incomplete or malformed stored sessions are discarded. Protected API responses with HTTP 401 or 403 clear the local session. The browser does not independently validate tokens, and UI route guards are not an authorization boundary.

`src/api/client.js` centralizes request construction, JSON parsing, authentication headers, endpoint methods, and safe API errors. `src/api/config.js` reads `MYFLIX_API_BASE_URL`, trims whitespace and trailing slashes, and throws when it is missing. The Movie API owns authentication, authorization, persistence, and validation. Keep its existing endpoint paths, PascalCase request/response fields, bearer-token use, and response assumptions aligned when changing the client.

The API base URL is public build-time configuration included in the frontend bundle. It must not contain credentials or secrets. Changing it for a deployed frontend requires rebuilding that frontend.

## Movie catalogue and favorites

When a token is present, `MainView` requests the catalogue through `api.getMovies`. It aborts an in-flight request when the session changes or the view unmounts, validates that the response is an array, and maps the API's `_id`, `Title`, `Description`, `Genre.Name`, `Director.Name`, and `ImagePath` fields to the view model used by the movie components. Search is local to the library and case-insensitive.

`useFavorite` in `src/hooks/useFavorite.js` reads favorite membership from the current user in context and sends add/remove operations through the shared API client. It uses the user returned by the API as the updated source of truth and prevents duplicate pending requests. Cards and detail views expose pending, pressed, and error state accessibly. The profile matches stored favorite IDs to the currently loaded catalogue and distinguishes an empty list from favorites missing from that catalogue.

## Authentication and profile workflows

Signup validates username, password, email, and an optional birthday before calling the registration endpoint. The client requires at least five ASCII letters or digits for new usernames, at least eight password characters, and a maximum of 72 UTF-8 password bytes. Birthday is optional; when supplied, it must be a valid date no later than the current local date. A blank birthday is omitted from the registration request. API validation errors are mapped to fields when available.

Login only stores a session when the response includes both a user and token. Failed login feedback does not reveal whether a username or password was incorrect.

Profile editing permits an unchanged legacy username shorter than the current minimum, but applies the five-character minimum when the username changes. A replacement password is sent only when nonblank; the client checks the 72-byte UTF-8 maximum, while the backend enforces the eight-character minimum. This permits an unchanged legacy short password to remain in place; do not apply new-password checks to an omitted or blank update. Backend validation errors for username and password are surfaced beside the relevant fields.

Birthday is optional for accounts that have no saved birthday. The profile form uses the account's original saved value to decide whether the field is required, including legacy `BirthDate` data. An account without a saved birthday can leave it blank or add a date. An account with one must keep a non-empty valid date when saving; the frontend omits a blank value from updates, and the backend preserves an omitted birthday. The form does not support clearing an existing birthday. The current form validates presence for such accounts, while date validity and future-date enforcement are principally established by signup checks and backend validation.

Changing the username causes the application to log out after the API returns the changed user because the existing token is no longer used for the old username. Account deletion uses a confirmation dialog with focus containment, Escape handling, background inertness, and focus restoration; deletion errors are announced within the dialog.

## Accessibility and error handling

The shared styles provide visible focus indicators, semantic form and navigation styles, and reduced-motion handling. Navigation includes a skip link and a mobile menu that closes after navigation or authentication changes. Forms associate validation messages with fields, and asynchronous actions expose busy/pending state. API failures are shown as user-safe messages instead of exposing raw server details.

## Tests and future changes

Vitest and React Testing Library tests are colocated with feature components; `src/phase2.test.jsx` covers cross-feature session, routing, and API regressions. The suite uses jsdom and mocked `fetch`, so it verifies frontend behavior and request shapes but does not establish live Movie API compatibility, browser rendering, or production behavior.

When changing API requests, session state, profile validation, route guards, or favorite updates, review the focused component tests and the cross-feature regression tests. Keep backend contracts authoritative for server validation and access control. Consult `package.json` for current dependency versions and commands rather than copying them into long-lived technical descriptions.
