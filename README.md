# myFlix React Client

myFlix is a React portfolio application for browsing a movie catalogue and managing an account. The frontend communicates with a separately maintained Movie API for authentication, account data, and movie information.

**[Explore the live application](https://react.myflix.marksavilledesigns.com)**

## Features

- Register and sign in, then browse and search the movie catalogue.
- View movie descriptions, genres, directors, and posters.
- Add or remove favorites from movie cards, detail pages, and the profile.
- Update account details and delete an account through a confirmation dialog.
- Use responsive navigation, keyboard support, accessible feedback, and reduced-motion preferences.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React, JavaScript, React Router, Tailwind CSS |
| API | Separately maintained Movie API REST service |
| Build and hosting | Parcel, Cloudflare Workers static assets |
| Testing | Vitest, React Testing Library, jsdom |

## How it works

The React application uses declarative browser routes for login, signup, the movie library, movie details, and the protected profile. React Context stores the signed-in user and token in browser `localStorage`. A shared API client sends requests to the Movie API, which remains responsible for authentication, authorization, persistence, and server-side validation.

The frontend retrieves and normalizes the movie catalogue, then shares favorite changes using the user object returned by the API. The public API base URL is embedded in the browser bundle at build time.

## Getting started

Use Node.js 24 as specified by `.nvmrc` and npm 10 or later.

```sh
npm ci
cp .env.example .env
```

Set `MYFLIX_API_BASE_URL` in `.env` to a reachable Movie API base URL. The API must allow the frontend origin through its CORS configuration. Then start Parcel:

```sh
npm start
```

## Checks and production build

```sh
npm test
npm run lint
npm run check
npm run format:check
npm run build
```

See the [Development Handbook](docs/development-handbook.md) for implementation details and the [Operations Runbook](docs/operations-runbook.md) for configuration, build, and maintenance procedures.

## Deployment

The repository contains a Cloudflare Workers static-assets configuration in `wrangler.jsonc`, including single-page-application fallback for browser routes. The project has previously been documented as using a Cloudflare Git integration that builds from `main`; the deployment pipeline itself is not defined in this repository.

## Design

The visual system is documented in [docs/design-assets/DESIGN.md](docs/design-assets/DESIGN.md). The source icon artwork is retained at [docs/design-assets/myflix-icon-source.png](docs/design-assets/myflix-icon-source.png); `public/favicon.svg` is the runtime favicon.
