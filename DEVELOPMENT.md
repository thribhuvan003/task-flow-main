# TaskFlow - Development Guide

Comprehensive guide for setting up and contributing to TaskFlow development.

## Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn** or **bun** (bun recommended for faster builds)
- **Git**: For version control
- **Supabase Account**: For database and authentication
- **Firebase Account**: (Optional) For hosting and additional services

## Project Structure

```
task-flow-main/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API and external service calls
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main App component
├── public/                # Static assets
├── .firebase/             # Firebase configuration
├── supabase/              # Supabase migrations and functions
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/thribhuvan003/task-flow-main.git
cd task-flow-main
```

### 2. Install Dependencies

#### Using Bun (Recommended)
```bash
bun install
```

#### Using npm
```bash
npm install
```

#### Using yarn
```bash
yarn install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:
- Supabase project ID, URL, and keys
- Firebase configuration (if needed)
- Other optional services

**Important**: Never commit `.env` file to version control.

### 4. Database Setup

#### Initialize Supabase

```bash
# Install Supabase CLI globally
npm install -g @supabase/supabase-cli

# Link your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase migration up
```

#### Apply Database Migrations

```bash
# List all migrations
supabase migration list

# Create new migration (if needed)
supabase migration new <migration_name>
```

## Development Commands

### Start Development Server

```bash
bun dev
# or
npm run dev
```

Server will be available at `http://localhost:5173`

### Build for Production

```bash
bun run build
# or
npm run build
```

### Run Tests

```bash
bun run test
# or
npm test
```

### Lint Code

```bash
bun run lint
# or
npm run lint
```

### Format Code

```bash
bun run format
# or
npm run format
```

### Deploy to Firebase

```bash
bun run build
firebase deploy --project=<project-id>
# or
npm run build
firebase deploy
```

## Debugging

### Chrome DevTools

Press `F12` while development server is running to open DevTools.

### Vite Debug Mode

Add `?debug=true` to URL for additional debug logging.

### Environment Logging

Set `VITE_LOG_LEVEL=debug` in `.env` for verbose logging.

## Database Queries

### Supabase Client Usage

```typescript
import { supabase } from '@/services/supabase';

// Query example
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('id', someId);

if (error) console.error('Error:', error);
```

### Real-time Subscriptions

```typescript
supabase
  .from('tasks')
  .on('*', payload => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

## Performance Optimization

### Code Splitting

Components are automatically code-split by React Router for better performance.

### Image Optimization

Place optimized images in `public/` directory.

### Bundle Analysis

```bash
bun run build -- --analyze
```

## Common Issues & Solutions

### Issue: Port 5173 already in use

```bash
# Use different port
bun dev -- --port 3000
```

### Issue: Supabase connection failed

- Verify `.env` variables are correct
- Check Supabase project is active
- Ensure IP is whitelisted in Supabase

### Issue: TypeScript errors

```bash
# Regenerate types
bun run type-check
```

## Contributing Guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## Getting Help

- Check existing [Issues](https://github.com/thribhuvan003/task-flow-main/issues)
- Review [Documentation](./README.md)
- Create a new issue with detailed description

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
