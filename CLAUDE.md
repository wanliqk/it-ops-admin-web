# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> Note on the file above: its directory tree and command list describe the generic soybean-admin-elp
> scaffold and are mostly accurate, but two things have drifted: the enum folder is `src/enum` (singular,
> not `enums`), and there is **no `test` script** in `package.json` — there is no unit test runner
> configured in this repo at all, so don't run or propose `pnpm test`. Use `pnpm typecheck` and `pnpm lint`
> as the verification commands instead.

## Project context

This is the admin front end for an internal "IT repair ticket & asset management" platform
(`VITE_APP_TITLE` in `.env`). It is currently the **unmodified soybean-admin-elp template** — the business
pages under `src/views/manage` (users, roles, menus) are still the template's generic demo CRUD, not the
real domain pages (tickets, assets, FAQs, etc.). The backend is a separate FastAPI service already
documented in `admin-api-v1.md` at the repo root (`/api/v1` prefix, JWT bearer auth, `{code, message, data}`
response envelope, `code === 0` means success). When wiring real pages to that backend, see the "Response
envelope mismatch" note below before touching `src/service/request` — the default template config does not
match this backend's contract out of the box.

## Architecture flows not covered above

These flows span multiple files; read them together when touching auth, routing, or networking. (This
section was previously inaccurate in places — e.g. referencing `src/pinia/stores`, `src/http/axios.ts`, and
`src/router/config.ts`, none of which exist in this repo. The content below was re-verified against the
actual source.)

### Two parallel service layers — use `src/service`, not `src/service-alova`

The repo ships two independent request-library demos:

- **`src/service` + `src/views/manage`** — axios-based (`@sa/axios`'s `createFlatRequest`), wired into the
  real app via `src/store/modules/auth` and `src/router/guard`. **This is the one real pages should use.**
- **`src/service-alova` + `src/views/alova`** — an `alova` library demo (with its own mocks under
  `src/service-alova/mocks/`), reachable from the menu but not part of the real auth/routing flow. It exists
  to showcase the alternate request lib; don't extend it for real business features.

Each has its own `api/`, `request/`, and type conventions — don't mix imports between the two.

### Request/response layer (`src/service`)

- All HTTP calls go through `request` exported from [src/service/request/index.ts](src/service/request/index.ts)
  (built with `createFlatRequest` from the `@sa/axios` workspace package), not raw `axios`. API functions
  live in `src/service/api/*.ts` (e.g. `auth.ts`, `system-manage.ts`) and call `request<T>(...)`.
- `baseURL` comes from `VITE_SERVICE_BASE_URL` (set per-mode in `.env.test` / `.env.prod`, currently
  `http://localhost:8000/api/v1`), resolved via [src/utils/service.ts](src/utils/service.ts). In dev mode
  with `VITE_HTTP_PROXY=Y`, requests instead go through the Vite proxy (`build/config/proxy.ts`) to avoid
  CORS.
- Auth header is injected in `onRequest` via `getAuthorization()` in
  [src/service/request/shared.ts](src/service/request/shared.ts), which reads the token from
  `localStg.get('token')` (see `src/utils/storage.ts`) and sends `Authorization: Bearer <token>`.
- **Response envelope mismatch to watch for**: the template's `isBackendSuccess` check in
  `src/service/request/index.ts` compares `String(response.data.code) === VITE_SERVICE_SUCCESS_CODE`, and
  `VITE_SERVICE_SUCCESS_CODE=0000` (string) in `.env`. The actual FastAPI backend (`admin-api-v1.md`) returns
  integer `code: 0` for success and a `message` field (not `msg`, which the template's error-handling code
  reads in a few places). Until reconciled, this mismatch will make every real backend response look like a
  failure. Same applies to `VITE_SERVICE_LOGOUT_CODES` / `VITE_SERVICE_MODAL_LOGOUT_CODES` /
  `VITE_SERVICE_EXPIRED_TOKEN_CODES`, which are tuned for the template's demo backend (codes like
  `8888`/`9999`), not this backend's `401`/`40100` style codes.
- Token refresh: on a code in `VITE_SERVICE_EXPIRED_TOKEN_CODES`, `handleExpiredRequest` calls
  `fetchRefreshToken` and retries the original request once. This backend's API doc has no refresh-token
  endpoint, so this path is currently dead weight for real integration (decide explicitly whether to keep,
  stub, or remove it rather than leaving it half-wired).

### Auth + routing handshake (static route mode)

- `VITE_AUTH_ROUTE_MODE=static` in `.env` — this repo runs in **static** mode, not dynamic. In this mode,
  auth routes are generated at build time by the `@elegant-router/vue` Vite plugin
  ([build/plugins/router.ts](build/plugins/router.ts)) by scanning `src/views/**`, and emitted into the
  auto-generated `src/router/elegant/routes.ts` (do not hand-edit; it's regenerated by `pnpm gen-route` / on
  dev server start). File path → route name follows folder structure, e.g.
  `src/views/manage/user/index.vue` → route name `manage_user`.
- [src/router/guard/route.ts](src/router/guard/route.ts) is the actual guard logic (registered from
  [src/router/guard/index.ts](src/router/guard/index.ts), not a single flat `guard.ts`). It checks
  `localStg.get('token')` for login state and `to.meta.constant` to decide whether a route is public
  (constant routes: `login`, `403`, `404`, `500` — see `onRouteMetaGen` in `build/plugins/router.ts`).
- Role-gating in static mode is purely client-side: each route's `meta.roles` (set per-page, not by the
  router plugin) is compared against `authStore.userInfo.roles` in the guard; `authStore.isStaticSuper`
  (role `VITE_STATIC_SUPER_ROLE`, default `R_SUPER`) bypasses the check entirely. There is no RBAC
  permission-code based menu filtering here yet — `admin-api-v1.md`'s `permission_code` model
  (`/api/v1/auth/me`, `permissions` array) has no frontend wiring; the existing role check is a coarser
  role-string match, separate from that backend's RBAC tables.
- `src/store/modules/route` (`useRouteStore`) holds `initConstantRoute` / `initAuthRoute`, which branch on
  `authRouteMode` (static vs dynamic) — only the static branches (`createStaticRoutes`,
  `filterAuthRoutesByRoles`) are exercised in this repo's current config.
- Logout (`authStore.resetStore()`) clears storage and calls `routeStore.resetStore()`, which removes every
  route added via `router.addRoute` and re-runs `initConstantRoute`.

### Environment files

- `.env` — shared vars (router history mode, response envelope codes, `VITE_AUTH_ROUTE_MODE`,
  `VITE_STATIC_SUPER_ROLE`, etc.).
- `.env.test` / `.env.prod` — only these two per-mode files exist (no `.env.development` /
  `.env.staging` / `.env.production`). `VITE_SERVICE_BASE_URL` and `VITE_OTHER_SERVICE_BASE_URL` (a JSON5
  string) live here. `pnpm dev` runs `vite --mode test` (loads `.env.test`); `pnpm build:test` also uses
  `test` mode; `pnpm build` uses `prod` mode (`vite build --mode prod`).

### Auto-generated files — do not hand-edit

- `src/router/elegant/*` (routes, imports, transform helpers) — generated by `@elegant-router/vue` from
  `src/views/**` structure.
- `src/typings/auto-imports.d.ts` and `src/typings/components.d.ts` — generated by `unplugin-auto-import` /
  `unplugin-vue-components` (configured in `build/plugins/unplugin.ts`). Don't be surprised by unfamiliar
  global identifiers in `.vue`/`.ts` files (e.g. `ref`, `ElMessage`); they're auto-imported per
  `vite.config.ts`.

### Path aliases

`@/*` → `src/*`, `~/*` → repo root (see `tsconfig.json` and `vite.config.ts`).
