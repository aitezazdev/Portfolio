# Contributing

Thanks for your interest in contributing. This guide covers the workflow for reporting bugs, suggesting changes, and submitting pull requests.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Portfolio.git
   cd Portfolio
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b your-branch-name
   ```
5. **Start** the dev server to test your changes:
   ```bash
   npm run dev
   ```

## Code Quality

This project uses Prettier for formatting and ESLint for linting. Run both before committing:

```bash
npm run format
npm run lint
```

To auto-fix lint issues:

```bash
npm run lint:fix
```

**Prettier config** (from `.prettierrc`):
- Single quotes
- Semicolons
- Trailing commas
- 100 character print width
- 2 space indentation

## Commits

Use short, clear commit messages with a conventional prefix:

- `feat:` new feature or component
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting or CSS changes (no logic changes)
- `refactor:` code restructuring without changing behavior

Example: `feat: add dark mode toggle to navbar`

## Pull Requests

1. Make sure your branch is up to date with `main`.
2. Run `npm run lint` and `npm run build` to verify nothing is broken.
3. Open a PR targeting the `main` branch.
4. Provide a short description of what changed and why.
5. Include screenshots if you changed any UI.

A maintainer will review your PR and may request changes before merging.

## Reporting Issues

Before opening an issue, check if it already exists. If not, include:

- Steps to reproduce the problem
- Expected vs actual behavior
- Your Node.js version and operating system

## Feature Requests

Open an issue with the `enhancement` label describing what you would like to see and why it would be useful.
