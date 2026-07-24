# ShadowProtocol - Frontend Architecture & Tech Stack Strategy

## Executive Summary

Enterprise-grade Crime Intelligence Platform frontend leveraging **Next.js 15 App Router**(whichever is the latest) with **Clean Architecture** and **Domain-Driven Design** principles. This document provides the complete technical strategy, patterns, and structure.

---

## 1. FRONTEND TECH STACK (COMPLETE)

### Core Framework & Runtime
```
Next.js 15.0+          # App Router (Server Components + Client Components)
React 19              # Latest with 19.0.0+ features
TypeScript 5.7+       # Strict mode, advanced types
Node.js 20 LTS+       # Runtime environment
```

### UI Framework & Components
```
TailwindCSS 4.0+      # Utility-first CSS (clean white theme)
ShadCN UI             # Accessible component library built on Radix UI
Radix UI              # Unstyled, accessible primitives
Framer Motion 11+     # Smooth animations (no glassmorphism)
Lucide React          # 500+ clean icons
Headless UI           # Accessible UI components
```

### State Management & Data
```
Zustand 4.5+          # Lightweight state (auth, user, filters)
React Query 5.x       # Server state management (TanStack)
Redux Toolkit (Optional) # For complex feature state
recoil               # Atom-based state (alternative)
```

### Forms & Validation
```
React Hook Form 7.x+  # Performant form management
Zod 3.24+            # TypeScript-first schema validation
Valibot (Optional)   # Lighter alternative to Zod
```

### Maps & Geospatial
```
React Leaflet 4.x    # Interactive maps
Leaflet 1.9+         # Map library
Mapbox GL (Premium)  # Vector maps with advanced features
```

### Data Visualization
```
Apache ECharts 5.x+  # Crime statistics & analytics dashboards
Recharts 2.x+        # Alternative charting library
Plotly.js            # Statistical visualizations
```

### Graph & Network Analysis
```
React Flow 11.x+     # Criminal network visualization
Cytoscape.js         # Complex graph rendering
Sigma.js             # Large graph visualization
```

### Tables & Data Grid
```
TanStack Table v8    # Headless table library
AG Grid Community    # Rich data grid
React DataGrid       # Lightweight alternative
```

### PDF & Reporting
```
React-PDF           # PDF rendering
PDFKit              # PDF generation (Node.js)
jsPDF               # Client-side PDF generation
html2canvas         # HTML to image conversion
```

### File Upload & Management
```
Dropzone.js         # File upload component
Uppy                # Modular file uploader
TUS Protocol        # Resumable uploads
```

### Real-time Communication
```
Socket.io-client    # WebSocket communication
SWR                 # Real-time data sync
Centrifugo (Optional) # Scalable real-time server
```

### Authentication & Security
```
next-auth           # OAuth/JWT integration
jose                # JWT library
crypto-js           # Encryption utilities
```

### Testing & Quality
```
Vitest              # Unit testing
Jest                # Testing framework
React Testing Library # Component testing
Playwright          # E2E testing
Cypress             # Alternative E2E
```

### Development Tools
```
ESLint              # Code linting
Prettier            # Code formatting
Husky               # Git hooks
lint-staged         # Staged file linting
```

---

## 2. PROJECT FOLDER STRUCTURE (Clean Architecture)

```
shadowprotocol-frontend/
│
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (public)/                     # Public routes group
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (protected)/                  # Protected routes group (with auth)
│   │   │   ├── layout.tsx                # Protected layout wrapper
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   │
│   │   │   ├── crimes/                   # Crime module
│   │   │   │   ├── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── [caseId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── create/
│   │   │   │
│   │   │   ├── analytics/                # Crime analytics module
│   │   │   │   ├── page.tsx
│   │   │   │   ├── hotspots/
│   │   │   │   ├── predictions/
│   │   │   │   └── patterns/
│   │   │   │
│   │   │   ├── network-analysis/         # Criminal network module
│   │   │   │   ├── page.tsx
│   │   │   │   └── [networkId]/
│   │   │   │
│   │   │   ├── ai-assistant/             # Conversational AI module
│   │   │   │   ├── page.tsx
│   │   │   │   └── [conversationId]/
│   │   │   │
│   │   │   ├── reports/                  # Reporting module
│   │   │   │   ├── page.tsx
│   │   │   │   └── [reportId]/
│   │   │   │
│   │   │   ├── cases/                    # Case management
│   │   │   │   ├── page.tsx
│   │   │   │   └── [caseId]/
│   │   │   │
│   │   │   ├── users/                    # User management (admin)
│   │   │   │   ├── page.tsx
│   │   │   │   └── [userId]/
│   │   │   │
│   │   │   ├── settings/                 # User settings
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   └── security/
│   │   │   │
│   │   │   └── audit-logs/               # Audit logs
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                          # API routes (middleware, auth checks)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── refresh/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── crimes/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   └── [...]
│   │   │
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Home page
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── modules/                          # Feature modules (DDD)
│   │   ├── auth/
│   │   │   ├── presentation/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   │   ├── types.ts
│   │   │   │   │   │   ├── hooks.ts
│   │   │   │   │   │   └── __tests__/
│   │   │   │   │   └── RegisterForm/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── LoginPage.tsx
│   │   │   │   │   └── RegisterPage.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useAuth.ts
│   │   │   │   │   ├── useLogin.ts
│   │   │   │   │   └── useRegister.ts
│   │   │   │   └── stores/
│   │   │   │       └── authStore.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── usecases/
│   │   │   │   │   ├── LoginUseCase.ts
│   │   │   │   │   ├── RegisterUseCase.ts
│   │   │   │   │   └── RefreshTokenUseCase.ts
│   │   │   │   ├── dto/
│   │   │   │   │   ├── LoginDTO.ts
│   │   │   │   │   ├── RegisterDTO.ts
│   │   │   │   │   └── AuthResponseDTO.ts
│   │   │   │   └── mappers/
│   │   │   │       └── AuthMapper.ts
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── User.ts
│   │   │   │   │   └── AuthToken.ts
│   │   │   │   ├── valueobjects/
│   │   │   │   │   ├── Email.ts
│   │   │   │   │   ├── Password.ts
│   │   │   │   │   └── Role.ts
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── IAuthRepository.ts
│   │   │   │   │   └── ITokenRepository.ts
│   │   │   │   └── services/
│   │   │   │       └── AuthenticationService.ts
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── AuthRepository.ts
│   │   │   │   │   └── TokenRepository.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── JWTService.ts
│   │   │   │   │   ├── EncryptionService.ts
│   │   │   │   │   └── ApiAuthService.ts
│   │   │   │   ├── http/
│   │   │   │   │   └── AuthApiClient.ts
│   │   │   │   └── config/
│   │   │   │       └── authConfig.ts
│   │   │   │
│   │   │   ├── tests/
│   │   │   │   ├── unit/
│   │   │   │   │   ├── useAuth.test.ts
│   │   │   │   │   └── LoginForm.test.tsx
│   │   │   │   ├── integration/
│   │   │   │   │   └── authFlow.test.tsx
│   │   │   │   └── e2e/
│   │   │   │       └── login.e2e.ts
│   │   │   │
│   │   │   ├── README.md
│   │   │   └── index.ts                  # Barrel export
│   │   │
│   │   ├── crimes/                       # Crime module (same structure)
│   │   │   ├── presentation/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   ├── tests/
│   │   │   └── index.ts
│   │   │
│   │   ├── analytics/                    # Analytics module
│   │   │   ├── presentation/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   ├── tests/
│   │   │   └── index.ts
│   │   │
│   │   ├── network-analysis/
│   │   ├── ai-assistant/
│   │   ├── cases/
│   │   ├── users/
│   │   ├── reports/
│   │   └── audit-logs/
│   │
│   ├── shared/                           # Shared across modules
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── Layout/
│   │   │   │   ├── index.ts
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── types.ts
│   │   │   ├── Cards/
│   │   │   ├── Tables/
│   │   │   ├── Forms/
│   │   │   ├── Modals/
│   │   │   ├── Loaders/
│   │   │   ├── Alerts/
│   │   │   └── __tests__/
│   │   │
│   │   ├── ui/                           # Base UI components (from ShadCN)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── [...]
│   │   │
│   │   ├── hooks/                        # Shared hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useFetch.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── useAsync.ts
│   │   │
│   │   ├── utils/                        # Utility functions
│   │   │   ├── api/
│   │   │   │   ├── client.ts             # Axios/fetch client
│   │   │   │   ├── interceptors.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── validators/
│   │   │   │   ├── email.ts
│   │   │   │   ├── password.ts
│   │   │   │   └── schemas.ts
│   │   │   ├── formatters/
│   │   │   │   ├── date.ts
│   │   │   │   ├── number.ts
│   │   │   │   └── currency.ts
│   │   │   ├── constants/
│   │   │   │   ├── app.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── roles.ts
│   │   │   │   └── permissions.ts
│   │   │   ├── helpers/
│   │   │   │   ├── array.ts
│   │   │   │   ├── object.ts
│   │   │   │   ├── string.ts
│   │   │   │   └── type-guards.ts
│   │   │   └── crypto/
│   │   │       ├── encryption.ts
│   │   │       └── hashing.ts
│   │   │
│   │   ├── stores/                       # Global Zustand stores
│   │   │   ├── index.ts
│   │   │   ├── authStore.ts              # Auth state
│   │   │   ├── userStore.ts              # User state
│   │   │   ├── uiStore.ts                # UI state (theme, sidebar)
│   │   │   ├── filterStore.ts            # Filter state
│   │   │   └── notificationStore.ts      # Toast/notification state
│   │   │
│   │   ├── types/                        # Global TypeScript types
│   │   │   ├── index.ts
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── crime.ts
│   │   │   ├── analytics.ts
│   │   │   ├── network.ts
│   │   │   └── common.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── api.ts
│   │   │   ├── app.ts
│   │   │   ├── routes.ts
│   │   │   ├── roles.ts
│   │   │   └── permissions.ts
│   │   │
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── cache.ts
│   │   │   └── logger.ts
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── request.ts
│   │   │   ├── response.ts
│   │   │   └── error.ts
│   │   │
│   │   └── __tests__/
│   │       └── [shared test files]
│   │
│   ├── styles/                           # Global styles
│   │   ├── globals.css
│   │   ├── variables.css                 # Design tokens
│   │   ├── animations.css                # Smooth animations
│   │   └── themes.css                    # Light/dark theme
│   │
│   ├── public/                           # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   ├── logos/
│   │   └── documents/
│   │
│   └── lib/                              # Utility library setup
│       ├── axios.ts
│       ├── queryClient.ts
│       ├── logger.ts
│       └── di.ts                         # Dependency Injection setup
│
├── tests/                                # Test configuration
│   ├── setup.ts
│   ├── mocks/
│   └── fixtures/
│
├── .env.local                            # Local environment
├── .env.example
├── .env.production
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── prettier.config.js
├── vitest.config.ts
├── playwright.config.ts
├── package.json
├── pnpm-lock.yaml                        # Use pnpm for performance
└── README.md
```

---

## 3. CLEAN ARCHITECTURE LAYERS EXPLAINED

### Layer 1: Presentation (UI)
- **Components**: Reusable, stateless UI components
- **Pages**: Route-specific page components
- **Hooks**: Custom React hooks for component logic
- **Stores**: Zustand for local component/feature state
- **No Business Logic**: Only UI rendering and user interaction

### Layer 2: Application
- **Use Cases**: Business logic orchestration
- **DTOs**: Data Transfer Objects for API communication
- **Mappers**: Transform domain entities to/from DTOs
- **Services**: Application-level services

### Layer 3: Domain
- **Entities**: Core business objects with identity
- **Value Objects**: Immutable business values
- **Repositories (Interfaces)**: Abstract data access
- **Domain Services**: Business rules and logic
- **No Framework Dependencies**: Pure TypeScript

### Layer 4: Infrastructure
- **Repositories (Implementation)**: Concrete data access
- **HTTP Clients**: API communication
- **External Services**: Third-party integrations
- **Config**: Environment and service configuration

---

## 4. STATE MANAGEMENT STRATEGY

### Zustand (Global Application State)
```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: true }),
        setToken: (token) => set({ token }),
        logout: () => set({ user: null, token: null, isAuthenticated: false }),
      }),
      { name: 'auth-storage' }
    )
  )
);
```

### React Query (Server State)
```typescript
// hooks/useGetCrimes.ts
import { useQuery } from '@tanstack/react-query';
import { getCrimesUseCase } from '@/modules/crimes';

export const useGetCrimes = (filters: CrimeFilters) => {
  return useQuery({
    queryKey: ['crimes', filters],
    queryFn: () => getCrimesUseCase.execute(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
  });
};
```

### State Hierarchy
```
Global (Zustand)
├── Auth (user, token, permissions)
├── UI (theme, sidebar state, notifications)
└── Filters (applied search/filter state)

Server (React Query)
├── Crimes
├── Analytics
├── Reports
└── Network Analysis

Component Local (useState)
├── Form inputs
├── Modal open/close
└── Temporary UI state
```

---

## 5. COMPONENT ARCHITECTURE

### Standard Component Structure
```typescript
// modules/crimes/presentation/components/CrimeCard/index.ts
export { CrimeCard } from './CrimeCard';
export type { CrimeCardProps } from './types';
export { useCrimeCardActions } from './hooks';

// types.ts
export interface CrimeCardProps {
  crime: Crime;
  onSelect?: (crimeId: string) => void;
  isLoading?: boolean;
}

// hooks.ts
export const useCrimeCardActions = () => {
  const { mutate: updateCrime } = useMutateCrime();
  return { updateCrime };
};

// CrimeCard.tsx
'use client';

import React from 'react';
import type { CrimeCardProps } from './types';
import { useCrimeCardActions } from './hooks';
import { Card, Button } from '@/shared/ui';
import { formatDate } from '@/shared/utils';

export const CrimeCard: React.FC<CrimeCardProps> = ({
  crime,
  onSelect,
  isLoading,
}) => {
  const { updateCrime } = useCrimeCardActions();

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{crime.title}</h3>
          <p className="text-sm text-gray-600">{crime.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatDate(crime.createdAt)}
          </p>
        </div>
        <Button
          onClick={() => onSelect?.(crime.id)}
          disabled={isLoading}
        >
          View
        </Button>
      </div>
    </Card>
  );
};
```

### Reusability Rules
- ✅ No inline styles (use Tailwind classes)
- ✅ Use `index.ts` for barrel exports
- ✅ Separate types in `types.ts`
- ✅ Extract hooks to `hooks.ts`
- ✅ Include `__tests__` folder
- ✅ One component per file
- ✅ Props interface for all components

---

## 6. ROUTING & LAYOUT PATTERNS

### App Router Convention
```typescript
// app/(protected)/crimes/page.tsx
import { CrimesList } from '@/modules/crimes';
import { CrimesPageLayout } from '@/modules/crimes/presentation';

export default async function CrimesPage() {
  return <CrimesPageLayout />;
}

// app/(protected)/crimes/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crimes | ShadowProtocol',
  description: 'Crime records and case management',
};

export default function CrimesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Crime Records</h1>
      </div>
      {children}
    </div>
  );
}

// app/(protected)/crimes/loading.tsx
import { CrimesSkeleton } from '@/modules/crimes/presentation';

export default function CrimesLoading() {
  return <CrimesSkeleton count={5} />;
}

// app/(protected)/crimes/error.tsx
'use client';

export default function CrimesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-12">
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## 7. SECURITY IMPLEMENTATION

### Authentication Flow
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(protected)/:path*', '/api/:path*'],
};
```

### RBAC Implementation
```typescript
// shared/middleware/rbac.middleware.ts
import { useAuthStore } from '@/shared/stores';

export const withRBACProtection = (
  requiredPermissions: Permission[]
) => {
  return (Component: React.ComponentType) => {
    return function ProtectedComponent(props: any) {
      const { user } = useAuthStore();

      const hasPermission = requiredPermissions.every((perm) =>
        user?.permissions?.includes(perm)
      );

      if (!hasPermission) {
        return <UnauthorizedPage />;
      }

      return <Component {...props} />;
    };
  };
};

// Usage in component
const ProtectedCrimesPage = withRBACProtection([
  'view:crimes',
  'edit:crimes',
])(CrimesPage);
```

### API Request Security
```typescript
// shared/utils/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/shared/stores';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor (handle 401, token refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Trigger token refresh
      const { refreshToken } = useAuthStore.getState();
      // ... refresh logic
    }
    return Promise.reject(error);
  }
);
```

---

## 8. DESIGN SYSTEM (Clean White Theme)

### Color Palette
```css
/* variables.css */
:root {
  /* Primary (Professional Blue) */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-900: #082f49;

  /* Neutral (Clean White) */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-300: #d1d5db;
  --color-neutral-500: #6b7280;
  --color-neutral-700: #374151;
  --color-neutral-900: #111827;

  /* Semantic (for status) */
  --color-success-500: #10b981;
  --color-warning-500: #f59e0b;
  --color-danger-500: #ef4444;
  --color-info-500: #3b82f6;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Spacing */
  --spacing-unit: 0.25rem;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
}
```

### Tailwind Config
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
    './src/shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      white: '#ffffff',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      blue: {
        50: '#f0f9ff',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        900: '#082f49',
      },
      green: {
        500: '#10b981',
      },
      amber: {
        500: '#f59e0b',
      },
      red: {
        500: '#ef4444',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animations: {
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-in': 'slideIn 300ms ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

### No Glassmorphism / Gradients Rule
```css
/* ❌ AVOID */
.card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* ✅ USE */
.card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: var(--shadow-md);
}
```

---

## 9. PERFORMANCE OPTIMIZATION

### Code Splitting
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const NetworkAnalysisChart = dynamic(
  () => import('@/modules/analytics/components/NetworkAnalysisChart'),
  { loading: () => <Skeleton />, ssr: false }
);
```

### Image Optimization
```typescript
import Image from 'next/image';

export function CrimeEvidenceImage({ src, alt }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/webp;base64,..." // Placeholder
      quality={80}
      priority={false}
    />
  );
}
```

### Caching Strategy
```typescript
// Query caching with React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      gcTime: 1000 * 60 * 10,        // 10 minutes (formerly cacheTime)
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

export const CrimeListItem = memo(
  ({ crime, onSelect }: Props) => {
    const status = useMemo(
      () => calculateCrimeStatus(crime),
      [crime]
    );

    const handleClick = useCallback(
      () => onSelect(crime.id),
      [crime.id, onSelect]
    );

    return <div onClick={handleClick}>{status}</div>;
  }
);
```

---

## 10. TESTING STRATEGY

### Unit Tests (Vitest)
```typescript
// modules/crimes/presentation/components/CrimeCard/__tests__/CrimeCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CrimeCard } from '../CrimeCard';

describe('CrimeCard', () => {
  const mockCrime = {
    id: '1',
    title: 'Robbery',
    description: 'Street robbery case',
    createdAt: new Date(),
  };

  it('renders crime card with title', () => {
    render(<CrimeCard crime={mockCrime} />);
    expect(screen.getByText('Robbery')).toBeInTheDocument();
  });

  it('calls onSelect when view button is clicked', async () => {
    const onSelect = vi.fn();
    render(<CrimeCard crime={mockCrime} onSelect={onSelect} />);

    await userEvent.click(screen.getByText('View'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

### Integration Tests (Vitest)
```typescript
// modules/crimes/presentation/__tests__/CrimesPage.integration.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CrimesPage } from '../pages/CrimesPage';

describe('CrimesPage Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('loads and displays crimes', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CrimesPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/crimes/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)
```typescript
// tests/e2e/crimes.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Crimes Module', () => {
  test('user can view crime list and click a crime', async ({ page }) => {
    await page.goto('http://localhost:3000/app/crimes');

    // Wait for crimes to load
    await page.waitForSelector('[data-testid="crime-card"]');

    // Get first crime card
    const firstCrime = page.locator('[data-testid="crime-card"]').first();
    await firstCrime.click();

    // Verify detail page loaded
    await expect(page).toHaveURL(/\/crimes\/\d+/);
    await expect(page.locator('h1')).toContainText(/crime details/i);
  });
});
```

---

## 11. DEPENDENCY INJECTION & COMPOSITION

```typescript
// lib/di.ts (Dependency Injection Container)
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  static getInstance(): DIContainer {
    if (!this.instance) {
      this.instance = new DIContainer();
    }
    return this.instance;
  }

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  get<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not registered`);
    }
    return factory();
  }
}

// Setup in root layout or initialization
const container = DIContainer.getInstance();

// Register repositories
container.register(
  'crimeRepository',
  () => new CrimeRepository(apiClient)
);

// Register use cases
container.register(
  'getCrimesUseCase',
  () => new GetCrimesUseCase(container.get('crimeRepository'))
);

// Usage in components
export const useGetCrimes = (filters: CrimeFilters) => {
  const container = DIContainer.getInstance();
  const getCrimesUseCase = container.get('getCrimesUseCase');

  return useQuery({
    queryKey: ['crimes', filters],
    queryFn: () => getCrimesUseCase.execute(filters),
  });
};
```

---

## 12. ERROR HANDLING & LOGGING

### Centralized Error Handler
```typescript
// shared/utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    logger.error(error.code, {
      message: error.message,
      context: error.context,
    });
    return error;
  }

  if (error instanceof AxiosError) {
    const appError = new AppError(
      'API_ERROR',
      error.response?.status || 500,
      error.message,
      error.response?.data
    );
    logger.error(appError.code, appError.context);
    return appError;
  }

  const unknownError = new AppError(
    'UNKNOWN_ERROR',
    500,
    'An unexpected error occurred'
  );
  logger.error(unknownError.code);
  return unknownError;
};
```

### Logger Setup
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, context?: any) => {
    console.log(`[INFO] ${message}`, context);
  },
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${message}`, context);
  },
  error: (message: string, context?: any) => {
    console.error(`[ERROR] ${message}`, context);
  },
  debug: (message: string, context?: any) => {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  },
};
```

---

## 13. CONFIGURATION MANAGEMENT

```typescript
// shared/config/env.ts
export const config = {
  // API
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: parseInt(process.env.API_TIMEOUT || '10000'),
  },

  // Auth
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  },

  // App
  app: {
    name: 'ShadowProtocol',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // Features
  features: {
    enableAI: process.env.NEXT_PUBLIC_ENABLE_AI === 'true',
    enableNetworkAnalysis: process.env.NEXT_PUBLIC_ENABLE_NETWORK === 'true',
    enablePredictions: process.env.NEXT_PUBLIC_ENABLE_PREDICTIONS === 'true',
  },
};
```

---

## 14. PACKAGE.JSON SCRIPTS

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "prepare": "husky install"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "typescript": "5.7.2",
    "@tanstack/react-query": "5.x",
    "zustand": "4.5.x",
    "tailwindcss": "4.0.x",
    "shadcn-ui": "latest",
    "react-hook-form": "7.x",
    "zod": "3.24.x",
    "axios": "1.x",
    "framer-motion": "11.x",
    "react-leaflet": "4.x",
    "echarts": "5.x",
    "react-flow": "11.x",
    "jose": "5.x"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "19.0.0",
    "@testing-library/react": "14.x",
    "@testing-library/jest-dom": "latest",
    "vitest": "latest",
    "playwright": "latest",
    "eslint": "latest",
    "prettier": "latest",
    "husky": "latest",
    "lint-staged": "latest"
  }
}
```

---

## 15. NEXT.JS CONFIG OPTIMIZATION

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimization
  compress: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
```

---

## 16. ENV VARIABLES

```env
# .env.local (Development)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_NETWORK=true
NEXT_PUBLIC_ENABLE_PREDICTIONS=true

JWT_SECRET=your-secret-key-for-jwt
REFRESH_TOKEN_EXPIRY=7d

DEBUG=true

# .env.production
NEXT_PUBLIC_API_URL=https://api.shadowprotocolpolice.gov.in
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_NETWORK=true
NEXT_PUBLIC_ENABLE_PREDICTIONS=true

DEBUG=false
```

---

## 17. CI/CD & DEPLOYMENT

### GitHub Actions
```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install

      - run: pnpm run lint

      - run: pnpm run type-check

      - run: pnpm run test

      - run: pnpm run build

      - run: pnpm run test:e2e

      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Docker
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

# Runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

---

## 18. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup & folder structure
- [ ] Base layout & navigation
- [ ] Authentication module (login/register)
- [ ] Design system & Tailwind setup
- [ ] API client & interceptors

### Phase 2: Core Features (Week 3-6)
- [ ] Dashboard module
- [ ] Crime management module
- [ ] Case management module
- [ ] User management (admin)
- [ ] Basic reporting

### Phase 3: Analytics & AI (Week 7-10)
- [ ] Analytics dashboard
- [ ] Crime hotspot visualization
- [ ] Network analysis component
- [ ] AI Chat integration
- [ ] Predictive analytics

### Phase 4: Polish & Scale (Week 11-12)
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Documentation
- [ ] Deployment setup

---

## 19. BEST PRACTICES CHECKLIST

- ✅ Never use `any` type
- ✅ Always use interfaces for contracts
- ✅ Dependency injection for all services
- ✅ Separate concerns (Presentation/Application/Domain/Infrastructure)
- ✅ No business logic in components
- ✅ All components have tests
- ✅ Use barrel exports (index.ts)
- ✅ Centralized error handling
- ✅ Request/response interceptors
- ✅ RBAC on frontend layer
- ✅ Clean white theme (no gradients)
- ✅ Responsive design (mobile-first)
- ✅ Accessibility (WCAG 2.1)
- ✅ Performance monitoring
- ✅ Comprehensive logging
- ✅ Security headers
- ✅ Input validation (Zod)
- ✅ Rate limiting awareness
- ✅ Environment-based configuration
- ✅ CI/CD ready

---

## 20. TOOLS & COMMANDS

```bash
# Project initialization
pnpm create next-app@latest shadowprotocol --typescript --tailwind

# Install core dependencies
pnpm add next@15 react@19 typescript@5.7

# Install UI & styling
pnpm add tailwindcss shadcn-ui framer-motion lucide-react

# Install state & data
pnpm add zustand @tanstack/react-query axios

# Install forms & validation
pnpm add react-hook-form zod

# Install maps & visualization
pnpm add react-leaflet leaflet echarts react-flow-renderer

# Install dev tools
pnpm add -D @types/node @types/react vitest playwright eslint prettier

# Install security
pnpm add jose next-auth

# Run development
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
pnpm test:coverage
pnpm test:e2e
```

---

## CONCLUSION

This frontend architecture ensures:
- **Enterprise-Grade**: Clean Architecture, DDD, SOLID principles
- **Scalable**: Modular feature-based structure, microservices-ready
- **Secure**: RBAC, JWT, rate limiting awareness, audit logging
- **Maintainable**: TypeScript strict mode, comprehensive testing
- **Performant**: Code splitting, lazy loading, caching strategies
- **Accessible**: WCAG 2.1 compliant with ShadCN UI
- **Professional**: Clean white theme, no decorative effects

The platform is ready to support **1,000,000+ users** with proper backend scaling and CDN distribution.

---

**Next Steps**: Begin with Phase 1 setup and foundation modules.
