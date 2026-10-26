# Frontend Development Guide: Step-by-Step API Integration & UI Architecture
**AI Website Testing Platform (Next.js 15+ App Router & FastAPI Backend)**

This developer guide provides a step-by-step blueprint for building new pages, integrating backend REST APIs, managing shared constants and types, and maintaining a decoupled mock-first architecture.

---

## Table of Contents
1. [Core Architectural Principles](#1-core-architectural-principles)
2. [Managing Constants, Enums & TypeScript Types](#2-managing-constants-enums--typescript-types)
3. [Step-by-Step API Integration Workflow](#3-step-by-step-api-integration-workflow)
4. [Step-by-Step UI & Page Creation Workflow](#4-step-by-step-ui--page-creation-workflow)
5. [Real-World Walkthrough: Adding a New Feature End-to-End](#5-real-world-walkthrough-adding-a-new-feature-end-to-end)
6. [Critical Next.js 15+ Gotchas & Best Practices](#6-critical-nextjs-15-gotchas--best-practices)

---

## 1. Core Architectural Principles

When building features from scratch in this platform, always follow the **Layered MVC-Style Architecture**:

```
┌────────────────────────────────────────────────────────┐
│ 1. View Tier (Next.js Pages & UI Components)           │
│    - Renders tables, cards, forms, and score gauges    │
│    - Consumes custom React Query hooks ONLY            │
│    - Location: src/app/ & src/components/              │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 2. Feature Slices / "Apps" (Modular Domains)           │
│    - Endpoints: src/features/<app>/api/endpoints.ts    │
│    - Service:   src/features/<app>/api/<app>Service.ts │
│    - Hooks:     src/features/<app>/hooks/use<App>.ts   │
│    - Exports:   src/features/<app>/index.ts            │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 3. Shared Network Engine (Axios & Interceptors)        │
│    - Central Axios instance with Bearer JWT interceptor│
│    - Global error unwrapping & 401 token cleanup       │
│    - Location: src/lib/api/axios.ts                    │
└────────────────────────────────────────────────────────┘
```

### Data Models (`src/types/`)
All tiers share TypeScript interfaces mirroring backend Pydantic models and Enums.

### Mock-First Mode
- Keep a toggle flag `NEXT_PUBLIC_USE_MOCK` in your environment config (`.env.local`).
- When `NEXT_PUBLIC_USE_MOCK=true`, the service functions route requests to local in-memory stores (`src/lib/mock/store.ts`). This lets you build, test, and style UI even when offline or before backend services are deployed.
- When `NEXT_PUBLIC_USE_MOCK=false`, the service functions invoke `axiosClient` to execute real HTTP requests against `http://localhost:8000/api/v1`.

---

## 2. Managing Constants, Enums & TypeScript Types

Always mirror the backend Pydantic models and Enums from `app/common/constants.py` and `app/common/serializers.py` to prevent data mismatch bugs.

### 2.1 Enums & Shared Constants (`src/types/api.ts`)
Define TypeScript union types or string enums that exactly match FastAPI:

```typescript
// src/types/api.ts

// API Response Envelope (mirrors RAMS SuccessResponse)
export interface ResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, any>;
}

export interface ErrorEnvelope {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// 4 Quality Pillars
export type PillarType = "functional" | "security" | "performance" | "accessibility";

// Lifecycle Run Statuses
export type RunStatus = "pending" | "queued" | "running" | "completed" | "failed" | "cancelled";

// Finding Severities
export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

// Domain Verification Statuses
export type VerificationStatus = "pending" | "verified" | "suspended";

// Target Environment Tiers
export type TargetEnvironment = "local" | "test" | "staging" | "production";
```

### 2.2 Constant Weights & Rubrics (`src/lib/constants/scoring.ts`)
Store formulas, pillar weights, and thresholds in a centralized constants file:

```typescript
// src/lib/constants/scoring.ts
import { PillarType, FindingSeverity } from "@/types/api";

export const PILLAR_WEIGHTS: Record<PillarType, number> = {
  functional: 0.35,     // 35%
  security: 0.25,       // 25%
  performance: 0.20,    // 20%
  accessibility: 0.20,  // 20%
};

export const SEVERITY_DEDUCTIONS: Record<FindingSeverity, number> = {
  critical: 15.0,
  high: 8.0,
  medium: 3.0,
  low: 1.0,
  info: 0.0,
};

// Calculate letter grade based on numerical score (0 - 100)
export function calculateGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
```

### 2.3 Constant UI Mapping Helpers (`src/lib/constants/ui.ts`)
Map constants to visual styles (badge colors, icons, human-readable labels) in one place so changes reflect across every page:

```typescript
// src/lib/constants/ui.ts
import { RunStatus, FindingSeverity } from "@/types/api";

export const STATUS_UI: Record<RunStatus, { label: string; badgeClass: string; dotClass: string }> = {
  completed: {
    label: "Completed",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dotClass: "bg-emerald-400",
  },
  running: {
    label: "Running",
    badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    dotClass: "bg-indigo-400 animate-pulse",
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dotClass: "bg-amber-400",
  },
  queued: {
    label: "Queued",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dotClass: "bg-amber-400",
  },
  failed: {
    label: "Failed",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    dotClass: "bg-rose-400",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-slate-700/40 text-slate-400 border-slate-700",
    dotClass: "bg-slate-400",
  },
};
```

---

## 3. Step-by-Step API Integration Workflow

Follow this **7-step process** whenever integrating any backend endpoint into the frontend using **Axios**, **separate endpoint constants**, and **app-specific service functions**:

```
[FastAPI Backend]
       │
       ▼
1. Inspect Route & Schema (app/apps/<feature>/)
       │
       ▼
2. Define TypeScript Models (src/types/<feature>.ts)
       │
       ▼
3. Register Feature Route Constants (src/features/<feature>/api/endpoints.ts)
       │
       ▼
4. Add Mock Store Method (src/lib/mock/store.ts)
       │
       ▼
5. Implement Feature Service Functions (src/features/<feature>/api/<feature>Service.ts) ──► Uses Axios & returns typed data
       │
       ▼
6. Create Feature React Query Hook (src/features/<feature>/hooks/use<Feature>.ts)
       │
       ▼
7. Consume in UI Component / Page (src/app/ or src/components/)
```

---

### Step 1: Inspect the Backend Route & Schema
Check the backend FastAPI route definition in `app/apps/<feature>/urls.py` and serializer in `app/apps/<feature>/serializers.py`.
- Note the HTTP Method (`GET`, `POST`, `PUT`, `DELETE`).
- Note the URL path (e.g. `/api/v1/websites`).
- Note the Request Body schema (e.g. `WebsiteCreateRequest`).
- Note the Response envelope model (e.g. `ResponseEnvelope[WebsiteResponse]`).

---

### Step 2: Create TypeScript Interfaces (`src/types/<feature>.ts`)
Define strongly-typed TypeScript models matching the backend Pydantic schemas:

```typescript
// src/types/website.ts
import { TargetEnvironment, VerificationStatus } from "./api";

export interface WebsiteCreateRequest {
  name: string;
  base_url: string;
  environment: TargetEnvironment;
  allowed_domains: string[];
}

export interface WebsiteResponse {
  id: string;
  name: string;
  base_url: string;
  environment: TargetEnvironment;
  allowed_domains: string[];
  is_authorized: boolean;
  is_active: boolean;
  verification_token?: string;
  verification_status: VerificationStatus;
  verified_at?: string;
}
```

---

### Step 3: Register Route Constants (`src/features/<feature>/api/endpoints.ts`)
Avoid hardcoding URL strings inside services or components. Register named constants inside the feature's `api/endpoints.ts`:

```typescript
// src/features/websites/api/endpoints.ts
export const WEBSITE_ENDPOINTS = {
  LIST: "/websites",
  CREATE: "/websites",
  DETAIL: (id: string) => `/websites/${id}`,
  VERIFY: (id: string) => `/websites/${id}/verify`,
  CREDENTIALS: (id: string) => `/websites/${id}/credentials`,
} as const;
```

---

### Step 4: Add Mock Store Handler (`src/lib/mock/store.ts`)
Provide in-memory mock handlers to enable offline development and zero-backend testing:

```typescript
// src/lib/mock/store.ts
async getWebsites(): Promise<WebsiteResponse[]> {
  await this.delay(200);
  return [...this.websites];
}

async createWebsite(data: WebsiteCreateRequest): Promise<WebsiteResponse> {
  await this.delay(300);
  const newSite: WebsiteResponse = {
    id: `web-${Date.now().toString(36)}`,
    ...data,
    is_authorized: false,
    is_active: true,
    verification_status: "pending",
  };
  this.websites.unshift(newSite);
  return newSite;
}
```

---

### Step 5: Implement App-Specific API Service Functions (`src/features/<feature>/api/<feature>Service.ts`)
Create a dedicated service file inside the feature's `api/` folder. Each function:
- Is a standalone `async` function.
- Branches on `API_CONFIG.useMock`.
- Executes the HTTP request using the centralized `axiosClient`.
- Returns the typed payload (`Promise<T>`) by unwrapping `res.data.data`.

```typescript
// src/features/websites/api/websiteService.ts
import { axiosClient } from "@/lib/api/axios";
import { API_CONFIG } from "@/lib/api/config";
import { WEBSITE_ENDPOINTS } from "./endpoints";
import { mockStore } from "@/lib/mock/store";
import { ResponseEnvelope } from "@/types/api";
import { WebsiteResponse, WebsiteCreateRequest, WebsiteVerificationResponse } from "@/types/website";

/**
 * Fetch all registered target websites.
 * Dedicated API function returning Promise<WebsiteResponse[]>
 */
export async function getWebsites(): Promise<WebsiteResponse[]> {
  if (API_CONFIG.useMock) {
    return mockStore.getWebsites();
  }
  const res = await axiosClient.get<ResponseEnvelope<WebsiteResponse[]>>(
    WEBSITE_ENDPOINTS.LIST
  );
  return res.data.data;
}

/**
 * Register a new target website domain.
 * Dedicated API function sending payload and returning Promise<WebsiteResponse>
 */
export async function createWebsite(data: WebsiteCreateRequest): Promise<WebsiteResponse> {
  if (API_CONFIG.useMock) {
    return mockStore.createWebsite(data);
  }
  const res = await axiosClient.post<ResponseEnvelope<WebsiteResponse>>(
    WEBSITE_ENDPOINTS.CREATE,
    data
  );
  return res.data.data;
}

/**
 * Trigger domain ownership verification.
 */
export async function verifyWebsite(id: string): Promise<WebsiteVerificationResponse> {
  if (API_CONFIG.useMock) {
    return mockStore.verifyWebsite(id);
  }
  const res = await axiosClient.post<ResponseEnvelope<WebsiteVerificationResponse>>(
    WEBSITE_ENDPOINTS.VERIFY(id)
  );
  return res.data.data;
}
```

---

### Step 6: Create the Feature React Query Hook (`src/features/<feature>/hooks/use<Feature>.ts`)
Hooks act as state controllers between your View (UI) and Model/Service. They import the dedicated service functions directly:

```typescript
// src/features/websites/hooks/useWebsites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as websiteService from "../api/websiteService";
import { WebsiteCreateRequest } from "@/types/website";

// GET Controller: auto-caches and provides isLoading / error states
export function useWebsites() {
  return useQuery({
    queryKey: ["websites"],
    queryFn: websiteService.getWebsites,
  });
}

// POST Mutation Controller: invalidates query cache upon success
export function useCreateWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WebsiteCreateRequest) => websiteService.createWebsite(data),
    onSuccess: () => {
      // Invalidate cache so all subscribers automatically re-fetch the latest list
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}
```

Export everything cleanly from `src/features/websites/index.ts`:
```typescript
// src/features/websites/index.ts
export * as websiteEndpoints from "./api/endpoints";
export * as websiteService from "./api/websiteService";
export * from "./hooks/useWebsites";
```

---

### Step 7: Consume the Hook in UI Components (View)
In pages or modals, consume the hook. The UI remains 100% decoupled from Axios, URLs, and HTTP logic:

```tsx
// src/components/websites/AddWebsiteModal.tsx
"use client";

import React, { useState } from "react";
import { useCreateWebsite } from "@/hooks/useWebsites";

export function AddWebsiteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const createWebsite = useCreateWebsite();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWebsite.mutateAsync({
        name,
        base_url: baseUrl,
        environment: "production",
        allowed_domains: [new URL(baseUrl).hostname],
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error creating website";
      alert(message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} required />
      <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} required />
      <button type="submit" disabled={createWebsite.isPending}>
        {createWebsite.isPending ? "Registering..." : "Submit"}
      </button>
    </form>
  );
}
```

---

## 4. Step-by-Step UI & Page Creation Workflow

Next.js 15+ uses the **App Router** (`src/app/`).

### 4.1 Route Directory Conventions
To add a new route, create a folder inside `src/app/`:

| URL Path | File Location | Purpose |
|---|---|---|
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | Dashboard view |
| `/websites` | `src/app/(dashboard)/websites/page.tsx` | Target websites inventory |
| `/websites/[id]` | `src/app/(dashboard)/websites/[id]/page.tsx` | Website details (Dynamic route) |
| `/test-runs/[id]` | `src/app/(dashboard)/test-runs/[id]/page.tsx` | Live test execution monitor |
| `/reports/[runId]` | `src/app/(dashboard)/reports/[runId]/page.tsx` | Multi-pillar test report |

> **Note on Route Groups:** The `(dashboard)` folder with parentheses is a Route Group. It shares a common layout (`src/app/(dashboard)/layout.tsx`) with the sidebar and topbar without adding `/(dashboard)` into the public URL!

### 4.2 Standard Page Structure Pattern
Every page should implement 4 standard visual states:
1. **Loading State:** Skeleton cards or animated spinners.
2. **Error State:** Descriptive error banner with a retry button.
3. **Empty State:** Helpful empty placeholder explaining what to do next.
4. **Data State:** The populated UI.

```tsx
"use client";

import React, { useState } from "react";
import { useWebsites } from "@/hooks/useWebsites";

export default function WebsitesPage() {
  const { data: websites = [], isLoading, error, refetch } = useWebsites();

  // 1. Loading State
  if (isLoading) {
    return <div className="py-20 text-center text-slate-400">Loading targets...</div>;
  }

  // 2. Error State
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
        <p>Failed to load websites: {error.message}</p>
        <button onClick={() => refetch()} className="mt-2 text-xs underline">Retry</button>
      </div>
    );
  }

  // 3. Empty State
  if (websites.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 border border-slate-800 rounded-2xl">
        No targets registered yet. Click "Add Target" to get started.
      </div>
    );
  }

  // 4. Data State
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {websites.map((site) => (
        <div key={site.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="font-bold text-white">{site.name}</h3>
          <p className="text-xs text-slate-400 font-mono">{site.base_url}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 5. Real-World Walkthrough: Adding a New Feature End-to-End

Let's walk through adding a **"Trigger Scan" Modal & Polling Monitor** feature.

### Step 1: Backend Contract
Backend has:
- `POST /api/v1/test-runs` with `{ website_id, scan_profile_id, test_pack_id }`
- Returns `TestRunResponse` (`status: "pending" | "running" | "completed"`)
- `GET /api/v1/test-runs/{id}` returns latest status.

### Step 2: Types (`src/types/test-run.ts`)
```typescript
export interface TriggerScanRequest {
  website_id: string;
  scan_profile_id?: string;
  test_pack_id?: string;
}

export interface TestRunResponse {
  id: string;
  website_id: string;
  scan_profile_id?: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  overall_score?: number;
  grade?: string;
  started_at?: string;
  completed_at?: string;
}
```

### Step 3: Auto-Polling React Query Hook (`src/hooks/useTestRuns.ts`)
To poll an active test run every 2 seconds until it finishes:

```typescript
// src/hooks/useTestRuns.ts
import { useQuery } from "@tanstack/react-query";
import * as testRunService from "@/lib/api/services/testRunService";
import { TestRunResponse } from "@/types/test-run";

export function useTestRun(id: string) {
  return useQuery({
    queryKey: ["test-run", id],
    queryFn: () => testRunService.getTestRun(id),
    enabled: !!id,
    // Automatically poll every 2000ms while running or pending
    refetchInterval: (query) => {
      const data = query.state.data as TestRunResponse | undefined;
      if (data && (data.status === "pending" || data.status === "running")) {
        return 2000;
      }
      return false; // Stop polling once completed, failed, or cancelled
    },
  });
}
```

### Step 4: Live Execution Monitor Page (`src/app/(dashboard)/test-runs/[id]/page.tsx`)
```tsx
"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { useTestRun } from "@/hooks/useTestRuns";

function MonitorContent() {
  const params = useParams();
  const runId = params.id as string;
  const { data: run, isLoading } = useTestRun(runId);

  if (isLoading) return <div>Connecting to test runner...</div>;
  if (!run) return <div>Test run not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold font-mono">{run.id}</h1>
        <span className="px-2 py-0.5 rounded text-xs uppercase font-bold bg-indigo-500/20 text-indigo-300">
          {run.status}
        </span>
      </div>

      {run.status === "completed" ? (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
          <p className="font-bold text-emerald-400">Scan Complete! Score: {run.overall_score} ({run.grade})</p>
          <a href={`/reports/${run.id}`} className="mt-2 inline-block px-4 py-2 bg-indigo-600 rounded-lg text-white">
            View Multi-Pillar Report
          </a>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 animate-pulse">
          <p className="text-indigo-400 font-mono">Running 4 quality pillars (Functional, Security, Perf, A11y)...</p>
        </div>
      )}
    </div>
  );
}

// Next.js 15+ App Router wrapper
export default function TestRunMonitorPage() {
  return (
    <Suspense fallback={<div>Loading execution stream...</div>}>
      <MonitorContent />
    </Suspense>
  );
}
```

---

## 6. Critical Next.js 15+ Gotchas & Best Practices

### Gotcha 1: URL Hooks Require `<Suspense>` Boundaries
In Next.js 15+ App Router, using client-side URL hooks like `usePathname()`, `useSearchParams()`, or `useParams()` in a client component will trigger a build-time prerender warning if outside `<Suspense>`:
```
Error: Next.js encountered URL data in a Client Component outside of <Suspense>.
```
**Solution:**
Always wrap the component using the hook inside a `<React.Suspense fallback={...}>` boundary:
```tsx
function InnerPage() {
  const params = useParams();
  // ...
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <InnerPage />
    </Suspense>
  );
}
```

### Gotcha 2: Third-Party Libraries Requiring Browser APIs (Monaco Editor, Charts)
Libraries that access `window` or `document` (like Monaco Editor or canvas charts) must be imported dynamically with SSR disabled:
```tsx
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p>Loading Code Editor...</p>,
});
```

### Gotcha 3: React Query Cache Invalidation
Whenever you perform a mutation (`create`, `update`, `delete`), always invalidate the queries whose data has changed. Otherwise, the UI will continue displaying stale cached records:
```typescript
import * as websiteService from "@/features/websites/api/websiteService";

const queryClient = useQueryClient();

const createMutation = useMutation({
  mutationFn: (data) => websiteService.createWebsite(data),
  onSuccess: () => {
    // Tells React Query to automatically refetch the list
    queryClient.invalidateQueries({ queryKey: ["websites"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
  },
});
```

### Gotcha 4: Environment Variables in Next.js Client
Variables accessed in browser/client components **MUST** be prefixed with `NEXT_PUBLIC_`:
- `NEXT_PUBLIC_USE_MOCK` (accessible in client)
- `NEXT_PUBLIC_API_URL` (accessible in client)
- Any variable without `NEXT_PUBLIC_` is only accessible inside Server Components or Route Handlers!

---

## Quick Checklist for New Features

- [ ] **Contract:** Verified backend route and Pydantic model in `ai_testing_tool_backend/app/apps/`.
- [ ] **Types:** Created/updated types in `src/types/<feature>.ts` with `ResponseEnvelope<T>`.
- [ ] **Endpoints:** Registered route paths in `src/features/<feature>/api/endpoints.ts`.
- [ ] **Mock Store:** Added dummy fixture data and CRUD handler in `src/lib/mock/store.ts`.
- [ ] **Service:** Created pure async API functions in `src/features/<feature>/api/<feature>Service.ts` using `axiosClient` and returning typed data.
- [ ] **Hooks:** Created React Query `useQuery` / `useMutation` in `src/features/<feature>/hooks/use<Feature>.ts`.
- [ ] **Index:** Exported endpoints, services, and hooks from `src/features/<feature>/index.ts`.
- [ ] **Page:** Created route under `src/app/(dashboard)/<feature>/page.tsx`.
- [ ] **Suspense:** Wrapped components using `useParams()` or `useSearchParams()` in `<Suspense>`.
- [ ] **Validation:** Ran `npm run build` and `npx eslint src/` to verify 0 errors.
