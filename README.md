# TaskFlow - Enterprise Task Management Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Built](https://img.shields.io/badge/Built-January%202026-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

TaskFlow is a production-grade SaaS platform designed to streamline project management for enterprise teams and high-performance consultants. It enables real-time collaboration through a sophisticated analytics-driven approach, ensuring efficient workflow execution and data transparency suitable for scaling organizations.

[Live Demo](https://task-flow-demo-v1.web.app)  
*Note: The demo features full authentication and database functionality.*

## Key Features

*   **Real-time Collaboration**: Instant task updates and state synchronization across all connected clients via WebSockets.
*   **Advanced Analytics Dashboard**: Comprehensive visualization of project health, including velocity tracking, burn-down charts, and productivity metrics.
*   **Interactive Kanban Board**: intuitive drag-and-drop interface for managing task states and workflows.
*   **Role-Based Access Control (RBAC)**: Granular permission management ensuring secure access for Admins, Managers, and Viewers.
*   **Secure Data Infrastructure**: Powered by a robust PostgreSQL database with strict Row-Level Security (RLS) policies.
*   **Mobile-Responsive Design**: Fully optimized UI/UX with a sleek dark mode for seamless usage across devices.
*   **Enterprise-Grade Authentication**: Secure sign-up/login flows with email verification and session management.

## Tech Stack

### Frontend
*   **Core**: React 18+, TypeScript
*   **Styling**: Tailwind CSS, shadcn/ui
*   **Visualization**: Recharts

### Backend
*   **Database & Auth**: Supabase (PostgreSQL, GoTrue)
*   **Realtime**: Supabase Realtime (WebSockets)
*   **Storage**: Supabase Storage

### State Management
*   **Server State**: React Query (TanStack Query)
*   **Client State**: Zustand

### Development
*   **Build Tool**: Vite
*   **Linting/Formatting**: ESLint, TypeScript
*   **Language**: Strict TypeScript

### Deployment
*   **Hosting**: Firebase Hosting

## Architecture Highlights

*   **Normalized Database Schema**: Utilizing 6 strictly normalized tables with cascading foreign keys to ensure data integrity.
*   **Row-Level Security (RLS)**: Server-side security policies enforced directly on the database level to prevent unauthorized access.
*   **Real-time Subscriptions**: Event-driven architecture utilizing Postgres CDC (Change Data Capture) to push updates to clients instantly.
*   **Optimistic UI Updates**: Immediate interface feedback for user actions while synchronizing with the server in the background.
*   **Robust Error Handling**: Comprehensive boundary management and user-friendly error states.

## Getting Started

Follow these steps to set up the project locally:

```bash
# Clone repository
git clone https://github.com/thribhuvan003/task-flow-main.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Open .env and add your Supabase credentials:
# VITE_SUPABASE_URL=your_project_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_public_key

# Run development server
npm run dev
```


# Updated on 2026-01-21
Daily contribution maintained! 🚀

# Updated on 2026-01-29
Keeping the streak alive! 💪
