# AI Testing Tool Frontend — Architecture & Engineering Guidelines

This document outlines the mandatory engineering rules, architectural patterns, and quality standards for developing and maintaining the `ai_testing_tool_frontend` codebase.

---

## 1. How to Start & Run the Frontend

### Prerequisites
- Node.js 18+ and `npm` installed.
- FastAPI backend running (default: `http://192.168.1.111:8001/api/v1` or `http://localhost:8000/api/v1`).
- Celery worker active with Redis.

### Starting the Development Server
From the project root:
```bash
# Standard dev server with Turbopack (defaults to localhost:3000)
npm run dev
```

To expose the dev server to your local network (e.g. `192.168.1.111`):
```bash
npx next dev -H 0.0.0.0 -p 3000
```

### Environment Configuration (`.env` / `.env.local`)
```env
# Disable mock in-memory store to connect directly to the live backend
NEXT_PUBLIC_USE_MOCK=false

# Backend API v1 Base URL
NEXT_PUBLIC_API_URL=http://192.168.1.111:8001/api/v1
NEXT_PUBLIC_STORAGE_URL=http://192.168.1.111:8001/storage
```

---

## 2. Component Size & Modularity Standards

> [!IMPORTANT]
> **Strict Line Limit**: No single component or page file should exceed **250 lines** of code. Any file approaching 200 lines must be evaluated for decomposition into modular subcomponents.

### Deconstruct Monoliths
- **Page files (`src/app/**/page.tsx`)** are **orchestrators only**.
  - Responsible for: route state, data hook queries/mutations, high-level layouts, breadcrumbs.
  - Must **not** contain massive inline JSX trees (drawers, complex accordions, dialogs, large forms).
- **Subcomponents (`src/components/<feature>/`)** are **focused presenters**.
  - Extract sections into dedicated files (e.g. `UrlProtocolInput.tsx`, `QualityPillarsSection.tsx`, `AuthenticationDrawer.tsx`, `AdvancedExecutionAccordion.tsx`).
  - Keep each subcomponent focused on a single responsibility with explicit, typed TypeScript props.

---

## 3. Directory & File Organization

```
src/
├── app/                      # Next.js App Router (Routes & Layouts only)
│   ├── (auth)/               # Authentication route group
│   └── (dashboard)/          # Dashboard route group
│       ├── websites/         # Lean page orchestrators (< 250 lines)
│       ├── test-runs/
│       ├── test-packs/
│       └── reports/
├── components/               # UI Components
│   ├── common/               # Reusable atomic UI (Button, Card, Input, Modal, Badge)
│   ├── layout/               # Layout chrome (Sidebar, Taskbar)
│   ├── websites/             # Decomposed feature components for website testing
│   ├── dashboard/            # Dashboard widgets and cards
│   └── reports/              # Report findings and charts
├── features/                 # Domain logic & services
│   ├── test-runs/            # Queries, mutations, API client endpoints
│   ├── websites/
│   └── test-packs/
├── lib/                      # Core configuration & utilities
│   ├── api/                  # Axios instance, interceptors, config
│   └── utils.ts              # cn() Tailwind class merger
└── types/                    # Shared TypeScript interfaces & models
```

---

## 4. TypeScript & Data Safety Rules

### 1. Guard Against Null & Undefined
Never assume numbers or strings are non-null when reading from backend responses:
```tsx
// ❌ BAD: Crashes if overall_score is null (common when run is queued/running)
{run.overall_score !== undefined ? run.overall_score.toFixed(1) : "Calculating..."}

// ✅ GOOD: Type-safe numeric check
{typeof run.overall_score === "number" && !isNaN(run.overall_score)
  ? `${run.overall_score.toFixed(1)} / 100`
  : "Calculating..."}
```

### 2. Disallow Unsafe `any`
- Type all function parameters, API responses, and hook payloads using domain interfaces in `src/types/`.
- If an unknown error is caught, use `err instanceof Error ? err.message : String(err)`.

### 3. API Response Envelope Adherence
All backend endpoints return standardized `ResponseEnvelope<T>`:
```ts
interface ResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}
```
Always unwrap `res.data.data` in the API service layer.

---

## 5. UI, Accessibility & Design Aesthetics

1. **Curated Color Palette**:
   - Avoid generic web colors (plain red, blue, green).
   - Brand Primary: `#FF6C37` (Coral Orange)
   - Secondary / Typography: `#212121` (Heading text), `#594139` (Labels), `#6B6B6B` (Body/captions)
   - Accent Pillars:
     - Functional: `#0BA5EC` (Sky Blue)
     - Security: `#12B76A` (Emerald)
     - Performance: `#F79009` (Amber)
     - Accessibility: `#9333EA` (Purple)
2. **Interactive Toggles & Click Targets**:
   - Switches, checkboxes, and pills must toggle when clicking either the control or its descriptive label text.
   - Support keyboard navigation (`Tab`, `Space`, `Enter`).
3. **Responsive Viewport Support**:
   - Always ensure mobile and small screen compatibility (`sm:`, `md:`, `lg:` breakpoints).
   - Use flexible grid layouts (`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4`).

---

## 6. Development & HMR Configuration

In `next.config.ts`, include your network host in `allowedDevOrigins` to prevent Next.js from blocking cross-origin Hot Module Replacement (HMR):
```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.111", "localhost", "127.0.0.1"],
  turbopack: { ... },
};
```

---

## 7. Verification Checklist Before Committing

Before closing any feature or refactoring task:
1. **Type Check & Build**:
   ```bash
   npm run build
   ```
   Must compile with 0 TypeScript and 0 bundling errors.
2. **Component Size Review**:
   Ensure no newly created or modified component exceeds 250 lines.
3. **Interactive Validation**:
   Test in the browser on desktop and responsive viewports.
