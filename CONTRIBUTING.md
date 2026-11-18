# Contributing Guidelines

Thank you for contributing to Izmir Open Data Maps. This project follows strict code quality, type safety, and testing standards.

---

## Code of Conduct

All contributors and maintainers are expected to maintain professional, respectful collaboration. Technical feedback must focus on architecture, correctness, and performance.

---

## Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm 9+ or compatible package manager
- CARTO Basemaps API key (free tier available at [carto.com/basemaps/apikey](https://carto.com/basemaps/apikey))

### Getting Started

```bash
# 1. Clone repository
git clone https://github.com/AtaCanYmc/izbb-acikveri-haritalari.git
cd izbb-acikveri-haritalari

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Branching Model

Create feature branches directly from `main`:

```bash
git checkout -b feat/add-ev-charging-map
```

Branch naming convention:
- `feat/feature-name`: New features, map datasets, or visual components.
- `fix/issue-description`: Bug fixes, layout corrections, data mapping repairs.
- `docs/doc-topic`: Documentation updates or additions.
- `refactor/scope`: Code cleanup or structural changes without behavioral difference.
- `test/test-scope`: Adding or updating test suites.
- `chore/tool-name`: Build configuration, dependencies, or CI updates.

---

## Commit Guidelines

This project strictly follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>(<scope>): <short description>
```

### Allowed Types

| Type | Purpose |
| --- | --- |
| `feat` | New map dataset, layer, or user interface feature |
| `fix` | Bug fix or incorrect data parser remediation |
| `docs` | Documentation modifications |
| `refactor` | Code restructuring without feature addition or bug fix |
| `test` | Adding or updating unit tests |
| `chore` | Dependency bumps, build tools, or CI workflows |

### Examples

- `feat(maps): add public library coordinates parser`
- `fix(carto): append basemap api key to tile layer urls`
- `test(maps): add coordinate builder edge case coverage`

---

## Verification Pipeline

Before opening a pull request, run all verification checks locally:

```bash
# Check code style and linting
npm run lint

# Verify TypeScript types
npm run type-check

# Execute unit test suite
npm test -- --run

# Validate production build output
npm run build
```

Every pull request must pass all four checks in GitHub Actions CI prior to merge.

---

## Pull Request Checklist

1. Ensure all new functions and data mappers have corresponding unit tests in `src/**/*.test.ts`.
2. Do not commit `.env` or sensitive credentials.
3. Keep pull requests focused on a single logical change.
4. Fill out the pull request template completely, detailing changes and verification steps.
