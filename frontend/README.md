# PortfolioHub - Frontend Application

A Nuxt.js application for connecting developers with real-world projects.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Features

- 🔐 **Authentication**: Integrated with backend API for user registration and login
- 👥 **Multi-Role Support**: Volunteer, Project Owner, and Mentor roles
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🎨 **Modern UI**: Beautiful interface with smooth animations
- 🚀 **Fast Performance**: Optimized with Nuxt.js and Vue 3

## Demo Credentials

For quick demo access without backend, use these credentials:

### Volunteer Account
- **Email:** volunteer1@portfoliohub.com
- **Password:** password123

### Project Owner Account
- **Email:** owner@portfoliohub.com
- **Password:** password123

### Mentor Account
- **Email:** mentor@portfoliohub.com
- **Password:** password123

## API Integration

This application integrates with a backend API for authentication. See [FRONTEND_API_INTEGRATION.md](FRONTEND_API_INTEGRATION.md) for detailed documentation.

### Quick Setup

1. **Configure API endpoint** (optional - defaults to localhost:3000):
```bash
# Create .env file
cp .env.example .env

# Edit .env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

2. **Toggle between Mock and Real API**:
   - Demo accounts (`@portfoliohub.com`) always use mock API
   - Other accounts will use real backend API
   - Change `useMockApi` flag in `stores/auth.ts` to force mock mode

See [Backend API Documentation](AUTHENTICATION_API_DOCUMENTATION.md) for API details.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
