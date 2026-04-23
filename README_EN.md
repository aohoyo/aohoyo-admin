# aohoyo-admin

Vue 3 admin template built with Vite + Pinia + Element Plus.

## Tech Stack

- Vue 3 + Composition API + TypeScript
- Vite 6 (ESM)
- Pinia (state management)
- Element Plus (UI components)
- Vue Router 4
- Axios (HTTP client)
- Vitest (unit testing)
- ESLint + commitlint

## Quick Start

```bash
npm install
npm run dev
```

## Dev Commands

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start dev server         |
| `npm run build`         | Production build         |
| `npm run preview`       | Preview build output     |
| `npm run type-check`    | TypeScript type checking |
| `npm run lint`          | ESLint linting           |
| `npm run lint:fix`      | ESLint auto-fix          |
| `npm run test`          | Run unit tests           |
| `npm run test:coverage` | Test coverage report     |

## Project Structure

```
src/
  api/           # Axios wrapper + API modules
  assets/        # Static assets
  components/    # Business components
  composables/   # Composables
  layouts/       # Layout components
  router/        # Router config
  stores/         # Pinia stores
  styles/        # Global styles
  types/         # TypeScript definitions
  utils/         # Utilities
  views/         # Page views
  App.vue
  main.ts
```

## GitHub Actions CI

Runs automatically on push to main or PR:

```
lint → type-check → test → build
```

Any failure blocks the merge.

## License

MIT
