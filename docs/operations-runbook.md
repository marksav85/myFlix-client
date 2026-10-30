# Operations Runbook

This runbook covers local operation and repository-supported maintenance for the myFlix React frontend. It does not provide access credentials or independently verify current production infrastructure. See the [Development Handbook](development-handbook.md) for implementation details.

## Prerequisites

- Node.js 24 (`.nvmrc`); `package.json` allows supported Node 22.22.2 through 24 releases.
- npm 10 or later.
- A reachable Movie API and an API CORS policy that permits the frontend origin.

Install dependencies from the repository root:

```sh
npm ci
```

## Environment configuration

Copy the example environment file and set the public API URL:

```sh
cp .env.example .env
```

Set `MYFLIX_API_BASE_URL` to the Movie API base URL, without credentials. The application trims surrounding whitespace and trailing slashes. It fails early when the setting is missing. Parcel embeds this value at build time, so changing a Worker runtime setting does not alter an already-built frontend; rebuild and redeploy the frontend to change its API target. `.env` is ignored by Git and must not contain secrets because the value is public in the browser bundle.

The Movie API is deployed and operated separately. Frontend startup does not start the backend. For local API development, start the API using its own repository instructions and ensure its CORS policy permits the frontend origin.

## Local development

With dependencies installed and `.env` configured, run:

```sh
npm start
```

Parcel prints the local development URL. The frontend requires the configured API to be reachable for authentication and catalogue operations.

## Checks and build

Available scripts are defined in `package.json`:

```sh
npm test
npm run lint
npm run format:check
npm run check
npm run build
```

`npm run check` runs lint followed by the one-shot Vitest suite. Tests use mocked network responses and do not verify live backend behavior. The production build writes static output to `dist/`, which is generated and ignored by Git.

Parcel package export resolution is enabled in the root `package.json` under `@parcel/resolver-default.packageExports`. This supports resolving React Router 7 package exports used by `react-router-dom`; retain this setting unless the installed bundler and router configuration are deliberately changed and verified together.

## Cloudflare deployment

`wrangler.jsonc` names the Worker, sets its compatibility date, serves `./dist`, and configures `single-page-application` handling so browser routes can fall back to the app entry point. The README records a Git-based Cloudflare build and deployment arrangement from the project configuration/owner-maintained notes.

The repository does not contain a deployment workflow, Cloudflare credentials, dashboard configuration, or an independently verifiable rollback procedure. Use the configured Cloudflare deployment integration maintained by the project owner; do not infer that running `wrangler deploy` locally is the established production process. Confirm required build environment configuration is available to the deployment system without exposing its values.

After deployment, verify the public application loads, sign-in and the protected catalogue routes behave as expected, and direct navigation or refresh on `/profile` and `/movies/:movieId` returns the frontend application. Also verify a representative API-backed action against the intended Movie API. Production verification requires authorized access and is not established by a local build.

Before releasing changes, run the repository's current checks, confirm a successful production build, and verify the deployed application against the intended Movie API. Automated tests and local builds do not replace production verification.

## Dependency and security maintenance

Review dependency changes before applying them, then update the lockfile through the project's package manager. Use `npm audit` to inspect known advisories and assess whether affected functionality is reachable in this application. After a dependency or bundler change, run the relevant tests, lint, formatting check, package audit, and production build. Pay particular attention to the React Router and Parcel package-export configuration when changing either package.

## Troubleshooting

| Symptom | Checks |
| --- | --- |
| Application fails immediately with missing API URL | Confirm `.env` exists and `MYFLIX_API_BASE_URL` is set; restart Parcel after editing it. |
| API requests fail in the browser | Check the URL, API availability, network access, and API CORS allowance for the frontend origin. |
| Direct route refresh returns a host error | Confirm static-asset hosting applies the SPA fallback configured in `wrangler.jsonc`. |
| Parcel cannot resolve a React Router package subpath | Confirm `@parcel/resolver-default.packageExports` remains enabled and rebuild with the installed dependency state. |
| Production points to an old API URL | The URL is embedded at build time; update the deployment build environment and rebuild/redeploy. |

## Recovery and rollback

No repository-defined rollback procedure or prior-release retention mechanism was found. Follow the deployment platform's owner-maintained release controls and confirm the intended previous release before rollback. Do not treat a fresh local build as a rollback artifact unless it was produced from the desired known-good revision and configuration.
