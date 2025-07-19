# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Development Server
- Default port: 8080
- Hot reload enabled
- Accessible on `::` (all interfaces)

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC plugin
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Animations**: Framer Motion

### Core Application Structure

**Mindo** is a learning management application with spaced repetition features. The app supports both mobile and desktop interfaces with separate components for each layout.

#### Key Features:
- **Learning Entries**: Users can create, edit, and manage learning content
- **Spaced Repetition**: Intelligent review system using custom algorithms
- **AI Integration**: Text improvement and audio transcription
- **Authentication**: Supabase-based user management
- **Responsive Design**: Separate mobile and desktop experiences

### Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── learning/       # Learning management UI
│   ├── navigation/     # Navigation components
│   ├── ui/            # Reusable UI components (shadcn/ui)
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── contexts/          # React context providers
├── utils/             # Utility functions
├── integrations/      # External service integrations
└── lib/              # Library configurations
```

### Key Components and Patterns

#### Authentication System
- **AuthContext**: Manages user authentication state
- **ProtectedRoute**: Wraps authenticated pages
- **AuthPage**: Handles login/signup flows
- Uses Supabase for authentication with email/password

#### Learning Management
- **Home.tsx**: Main dashboard with mobile/desktop variants
- **LearningCard**: Displays individual learning entries
- **AddLearningModal**: Form for creating new learning entries
- **MindoReviewScreen**: Review interface for spaced repetition

#### State Management
- **useLearning**: Core hook for learning data management
- **useAuth**: Authentication state and methods
- **React Query**: Server state management and caching
- **useToast**: Notification system

#### Database Schema
- **revisoes**: Main learning entries table
- **lixeira_aprendizados**: Trash/deleted entries
- User-scoped data with proper RLS policies

### Development Patterns

#### Component Architecture
- Functional components with hooks
- Separate mobile and desktop component variants
- Context providers for global state
- Custom hooks for business logic

#### Styling Conventions
- Tailwind CSS classes for styling
- Custom animations with Framer Motion
- Responsive design using Tailwind breakpoints
- Dark theme support with gradient backgrounds

#### Data Flow
- Supabase client for database operations
- React Query for server state caching
- Optimistic updates for better UX
- Error handling with toast notifications

### Testing

Current test setup includes:
- Jest for unit testing
- React Testing Library for component tests
- Test files in `__tests__` directories

### Code Quality

#### ESLint Configuration
- TypeScript ESLint rules
- React hooks rules
- React refresh rules
- Unused variables check disabled

#### TypeScript Configuration
- Strict null checks disabled
- Base URL aliasing (`@/` for `src/`)
- Skip lib check enabled
- Allow JS files

### Common Development Tasks

#### Adding New Learning Features
1. Create components in `src/components/learning/`
2. Add hooks in `src/hooks/` if needed
3. Update `useLearning` hook for data operations
4. Add database migrations in `supabase/migrations/`

#### UI Component Development
1. Use shadcn/ui components as base
2. Extend with custom styling using Tailwind
3. Add animations with Framer Motion
4. Test on both mobile and desktop layouts

#### Database Changes
1. Create migration files in `supabase/migrations/`
2. Update TypeScript types in `src/integrations/supabase/types.ts`
3. Update hook logic in `src/hooks/useLearning.tsx`

### Environment and Configuration

#### Required Environment Variables
- Supabase URL and keys are hardcoded in client (development setup)
- Check `src/integrations/supabase/client.ts` for current values

#### Build Configuration
- Vite configuration in `vite.config.ts`
- Path aliases configured for `@/src/*`
- SWC plugin for fast compilation
- Component tagging for development

### Performance Considerations

#### Database Optimization
- Use React Query for caching
- Implement proper loading states
- Use optimistic updates for better UX

#### Bundle Optimization
- Vite handles code splitting automatically
- Lazy loading for route components
- Tree shaking enabled by default

### Mobile vs Desktop Implementation

The application has separate implementations for mobile and desktop:

- **Mobile**: Full-screen immersive experience with bottom navigation
- **Desktop**: Sidebar navigation with multi-column layout
- **Detection**: Uses `useIsMobile` hook for responsive behavior
- **Shared Logic**: Business logic is shared between implementations

### Supabase Integration

#### Authentication
- Email/password authentication
- Session management with automatic refresh
- Protected routes with `ProtectedRoute` component

#### Database
- PostgreSQL with Row Level Security
- Real-time subscriptions available
- Proper user isolation for multi-tenant data

When working on this codebase:
1. Always test on both mobile and desktop layouts
2. Use the existing UI components from shadcn/ui
3. Follow the established patterns for data fetching and state management
4. Maintain proper TypeScript types
5. Use the toast system for user feedback
6. Test authentication flows thoroughly

## Git Guidelines

### Version Control Best Practices
- Nunca dê um hard reset ou volte a algum commit anterior sem antes confirmar com o usuário