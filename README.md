# myFlix React Client

A portfolio movie-library frontend built with React. It communicates with the
separate **movie-api** REST backend for authentication, movies, and user accounts.

## Features

- Register with username, password confirmation, email, and birthday; log in and out.
- Browse a poster-led movie library and search titles without case sensitivity.
- View movie descriptions, genres, directors, and posters.
- Add and remove favorites from the library, detail view, and profile.
- View and update account details; leave the password blank to keep it unchanged.
- Delete an account through a confirmation dialog in the Danger Zone.
- Use responsive navigation and layouts with keyboard focus, accessible feedback,
  loading/empty/error states, and reduced-motion support.

## Stack and structure

React 18, React Router 6, Parcel 2, and Tailwind CSS 3 power the application.
Vitest, React Testing Library, jest-dom, and jsdom provide automated tests;
ESLint checks JavaScript and JSX.

- `src/index.html` / `src/index.jsx`: Parcel entry and React application root.
- `src/components/`: navigation, authentication, library, detail, and profile views.
  `main-view` owns browser routes and movie loading.
- `src/contexts/AppContext.jsx`: shared user/session state and persistence.
- `src/api/`: environment configuration, fetch wrapper, and endpoint methods.
- `src/hooks/useFavorite.js`: shared favorite toggling, pending/error handling, and
  synchronization with the user returned by the API.
- `src/index.css` / `tailwind.config.js`: semantic tokens and shared UI styles.

Routes are `/login`, `/signup`, `/`, `/movies/:movieId`, and `/profile`.
The library, detail, and profile routes require a restored or newly signed-in
session. Search state is local to the library; session state uses React Context.

## Local development

Use **Node 24** (`.nvmrc`). Supported Node versions are `>=22.22.2 <25`, with
npm `>=10`.

```sh
nvm use
npm ci
cp .env.example .env
npm start
```

Set `MYFLIX_API_BASE_URL` in `.env` to the movie-api base URL. The supplied example
uses `http://localhost:8080`; start the backend separately and allow the frontend
origin in its CORS configuration. Parcel reports the local frontend URL when it
starts.

The base URL is required and trailing slashes are normalized. It is public browser
configuration, read during bundling; do not place secrets in it or commit `.env`.

## Quality checks

```sh
npm test          # Run the Vitest suite once
npm run lint      # Check JavaScript/JSX with ESLint
npm run build     # Generate production assets in dist/
npm run check     # Run lint followed by tests
```

Tests exercise components, routing/session flows, API requests with mocked fetch,
favorite updates, account actions, and keyboard/ARIA interactions in jsdom.
They do not provide browser E2E or visual-regression coverage.

## Design

The React visual system is **Cinematic Obsidian**: dark surfaces, amber primary
controls, and cyan focus accents. The durable specification is
[docs/design/DESIGN.md](docs/design/DESIGN.md).

`public/favicon.svg` is the canonical runtime favicon, bundled by Parcel through
`src/index.html`. `docs/design/assets/myflix-icon-source.png` is documentation-only
reference artwork. Generated `dist/` output is ignored.

## Session behavior

Protected API requests send a Bearer token. User and token state are persisted in
`localStorage`; incomplete or malformed stored user data is cleared during session
restoration. Protected-request 401/403 responses clear the session and prompt a
new login. Changing the username also requires signing in again.

The frontend does not verify token validity during restoration; the backend
remains responsible for authentication and authorization.

## Deployment

`npm run build` produces a static SPA in `dist/`. Supply the public API base URL
before building and configure the host to serve the SPA entry for browser routes.
`netlify.toml` contains a catch-all SPA rewrite; hosting and backend deployment are
configured separately. No future infrastructure migration is implied by this
repository configuration.
