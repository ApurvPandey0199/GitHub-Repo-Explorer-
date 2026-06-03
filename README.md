# GitHub Repo Explorer

GitHub Repo Explorer is a full-stack web application developed as Exercise 3 for the Studio Graphene assessment. It allows users to search for GitHub profiles, view user statistics, and browse their repositories with filtering, sorting, and inline language visualizations.

## Live Demo
🚀 **[Click here to view the Live Application](https://ApurvPandey0199.github.io/GitHub-Repo-Explorer-/)**

*(Deployed via GitHub Pages)*

## Tech Stack
- **Backend:** Node.js, Express, Axios. Chosen for lightweight routing, rapid development, and easy integration with external REST APIs.
- **Frontend:** React, Vite, Recharts, CSS Modules. Chosen for fast component-driven UI development, out-of-the-box performant bundling, and robust visualization primitives without relying on heavy external UI frameworks.

## How to Run Locally

### Backend
```bash
cd server
cp .env.example .env   # optionally add GITHUB_TOKEN to bypass rate limits
npm install
npm run dev            # http://localhost:4000
```

### Frontend (new terminal)
```bash
cd client
npm install
npm run dev            # http://localhost:5173
```

## API Documentation

| Method | Path | Query Params | Description | Sample Response |
|---|---|---|---|---|
| `GET` | `/api/github/users/:username` | None | Fetches GitHub user profile | `{ "login": "octocat", "name": "The Octocat", "public_repos": 8, ... }` |
| `GET` | `/api/github/users/:username/repos` | `page` (default 1), `sort` (updated, stars, name) | Fetches user repositories | `[{ "name": "Hello-World", "language": "Ruby", "stargazers_count": 1200, ... }]` |
| `GET` | `/api/github/repos/:owner/:repo` | None | Fetches detailed repository stats | `{ "open_issues_count": 5, "default_branch": "master", ... }` |
| `GET` | `/health` | None | Health check endpoint | `{ "ok": true }` |

## Project Structure

```text
github-repo-explorer/
├── client/                     # Frontend (Vite + React)
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios configuration and API wrappers
│   │   ├── components/         # UI Components (ProfileCard, RepoList, LanguageChart, etc.)
│   │   ├── hooks/              # Custom React Hooks (e.g., useDebounce)
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main Application State & Layout
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend (Node + Express)
│   ├── routes/
│   │   └── github.js           # Express routers for GitHub endpoints
│   ├── cache.js                # Custom In-Memory caching utility
│   ├── github.js               # GitHub API Axios client configuration
│   ├── index.js                # Express App Entry Point
│   └── package.json
├── .gitignore
└── README.md
```

## Cache & Rate Limit Design
- **60-Second TTL Cache:** An in-memory Map structure caches successful GitHub API responses for 60 seconds. This massively reduces redundant outbound network requests for commonly searched users and keeps the application snappy.
- **Rate-Limit Handling:** The backend securely proxies the requests and passes forward appropriate HTTP status codes (e.g., `403` or `429`). The frontend catches these specific status codes to render a tailored `ErrorMessage` component alerting the user that the rate limit has been hit, urging the addition of a `GITHUB_TOKEN`.

## Next Steps
While the core functionality is robust, future improvements could include:
- **Comprehensive Testing:** Implement Unit and Integration tests using Jest/React Testing Library.
- **Deep Pagination:** Currently maps basic pagination; could be improved using endless scrolling with Intersection Observers or cursor-based routing.
- **GraphQL Integration:** Migrating from GitHub REST API v3 to GraphQL v4 to query deeply nested data (like multiple repo languages) in a single network trip.

## Honesty Note
AI tools (ChatGPT/Cursor) were used for scaffolding and boilerplate. Every line understood. Caching strategy and error handling designed by me.
