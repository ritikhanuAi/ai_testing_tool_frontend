# AI Testing Platform - Frontend

Autonomous multi-pillar testing platform monitoring functional, security, performance, and accessibility health. Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Axios**, and **TanStack Query**.

---

## Architecture Overview (Layered MVC)

The frontend uses an enterprise layered architecture ensuring complete separation of concerns:

```
src/
├── features/ (or apps/)             # [Feature Slices] Domain-driven modular structure
│   ├── websites/
│   │   ├── api/
│   │   │   ├── endpoints.ts         # Route path constants (/websites)
│   │   │   └── websiteService.ts    # getWebsites(), createWebsite(), verifyWebsite()
│   │   ├── hooks/
│   │   │   └── useWebsites.ts       # React Query hooks (useWebsites, useCreateWebsite)
│   │   └── index.ts                 # Barrel exports
│   ├── test-runs/                   # Endpoints, service functions, and hooks for runs
│   ├── test-packs/                  # Endpoints, service functions, and hooks for YAML packs
│   ├── scan-profiles/               # Endpoints, service functions, and hooks for profiles
│   ├── reports/                     # Endpoints, service functions, and hooks for reports
│   ├── dashboard/                   # Endpoints, service functions, and hooks for dashboard
│   └── auth/                        # Endpoints and service functions for authentication
├── lib/
│   └── api/
│       ├── axios.ts                 # [HTTP Client] Central Axios instance with JWT interceptor
│       └── config.ts                # Base URL and mock mode configuration
├── types/                           # [Model] TypeScript domain schemas & response envelopes
└── app/                             # [View] Lean Next.js App Router pages and layouts
```

---

## Pattern: Adding an API Call with Separated Functions & Returns

When integrating an endpoint, follow this pattern:

### 1. Register the Endpoint Path (`src/features/<app>/api/endpoints.ts`)
```typescript
export const WEBSITE_ENDPOINTS = {
  LIST: "/websites",
  CREATE: "/websites",
} as const;
```

### 2. Implement the API Service Function (`src/features/<app>/api/websiteService.ts`)
Each function makes the Axios request and returns a typed `Promise<T>`:
```typescript
import { axiosClient } from "@/lib/api/axios";
import { API_CONFIG } from "@/lib/api/config";
import { WEBSITE_ENDPOINTS } from "./endpoints";
import { mockStore } from "@/lib/mock/store";
import { ResponseEnvelope } from "@/types/api";
import { WebsiteResponse, WebsiteCreateRequest } from "@/types/website";

export async function getWebsites(): Promise<WebsiteResponse[]> {
  if (API_CONFIG.useMock) return mockStore.getWebsites();
  const res = await axiosClient.get<ResponseEnvelope<WebsiteResponse[]>>(WEBSITE_ENDPOINTS.LIST);
  return res.data.data;
}

export async function createWebsite(data: WebsiteCreateRequest): Promise<WebsiteResponse> {
  if (API_CONFIG.useMock) return mockStore.createWebsite(data);
  const res = await axiosClient.post<ResponseEnvelope<WebsiteResponse>>(WEBSITE_ENDPOINTS.CREATE, data);
  return res.data.data;
}
```

### 3. Wrap in a Custom Controller Hook (`src/features/<app>/hooks/useWebsites.ts`)
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as websiteService from "../api/websiteService";

export function useWebsites() {
  return useQuery({
    queryKey: ["websites"],
    queryFn: websiteService.getWebsites,
  });
}
```

### 4. Export from Feature Index (`src/features/<app>/index.ts`)
```typescript
export * as websiteEndpoints from "./api/endpoints";
export * as websiteService from "./api/websiteService";
export * from "./hooks/useWebsites";
```

### 5. Consume in UI Component (`src/app/...`)
```tsx
import { useWebsites } from "@/features/websites";

export function WebsitesList() {
  const { data: websites = [], isLoading } = useWebsites();
  // ...
}
```


For the complete in-depth guide, see [FRONTEND_DEVELOPMENT_GUIDE.md](./FRONTEND_DEVELOPMENT_GUIDE.md).

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build

# Run linter
npm run lint
```
