# Contributing Guidelines

Thank you for choosing to contribute to nextjs-3d-gsap-portfolio. We welcome issues, bug reports, feature requests, and pull requests to help improve the project.

Please review these guidelines to ensure a clear and efficient review process.

---

## Reporting Issues

If you find a bug or have a suggestion:
1. Search the issue tracker to check if your topic is already documented.
2. If it is new, open a detailed issue. Include reproduction steps, expected behavior, your operating system, and Node.js version.

---

## Local Development Workflow

Follow these rules when writing code locally.

### 1. Set Up Your Environment
Follow the installation steps in the [README.md](file:///home/aitezaz/Code/Portfolio-Nextjs/README.md) to set up your local server.

### 2. Code Quality & Linting
This repository relies on Prettier for formatting and ESLint for code verification. Run validation checks before committing files:
* **Lint Check**—run ESLint rules to identify syntax errors or quality violations:
  ```bash
  npm run lint
  ```
* **Auto-Fix**—run ESLint with the fix flag to resolve simple issues automatically:
  ```bash
  npm run lint:fix
  ```
* **Format Code**—format your files using Prettier to maintain a clean style:
  ```bash
  npm run format
  ```

---

## Commit Guidelines

Keep your commit messages short, direct, and structured. We prefer conventional-like prefixes to categorize changes:

* `feat:` for new capabilities or components (e.g., `feat: add custom cursor component`)
* `fix:` for bug fixes (e.g., `fix: resolve page transition scroll drift`)
* `docs:` for documentation updates (e.g., `docs: update setup steps in readme`)
* `style:` for changes that do not affect code logic—such as formatting or CSS edits
* `refactor:` for code changes that neither fix bugs nor add features

Provide a concise description. Avoid long sentences or buzzwords.

---

## Pull Request Process

When you are ready to submit your contributions, follow this process:

1. **Branching**—create a branch off the main branch. Use a descriptive name (e.g., `feature/custom-cursor` or `fix/transition-drift`).
2. **Coding Standards**—write clean TypeScript and CSS. Test your changes locally to ensure animations remain smooth—maintaining target frame rates during scroll events.
3. **Submit PR**—open a pull request targeting the `main` branch. Provide a brief explanation of the changes, references to any relevant issues, and screenshots if you modified UI components.
4. **Code Review**—maintainers will review your submission. Address any requested changes or code styling adjustments. Once approved, a maintainer will merge your code.
