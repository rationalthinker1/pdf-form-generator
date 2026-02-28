# Issue: `http://localhost:PORT/` does not load in Windows 11 Edge from WSL2

**Date:** 2026-02-28
**Status:** Unresolved — server starts and is reachable from WSL2 (`curl` returns 200), but Edge on Windows still shows "localhost refused to connect"

---

## What the issue is

Running `bun dev src/examples/chp-contract/form.tsx` spawns Vite inside WSL2. The terminal prints:

```
Local:   http://localhost:PORT
```

Opening that URL in Windows 11 Edge shows:

> **Hmm… can't reach this page**
> localhost refused to connect.

---

## Environment

- Host OS: Windows 11
- Browser: Microsoft Edge (latest)
- WSL2 distro: Ubuntu (kernel 6.6.87.2-microsoft-standard-WSL2)
- Runtime: Bun v1.x
- Vite: 8.0.0-beta.13

---

## Root cause analysis

Edge on Windows resolves `localhost` → `::1` (IPv6) first, then falls back to `127.0.0.1`.
Vite must bind to `::` (IPv6 wildcard) to cover both addresses via dual-stack.

From WSL2, with `--host ::`:
- `curl -4 http://127.0.0.1:PORT/` → 200 ✅
- `curl -6 http://localhost:PORT/` → 200 ✅
- `ss -tlnp | grep PORT` → shows `*:PORT` (dual-stack) ✅
- PowerShell `Test-NetConnection -ComputerName localhost -Port PORT` → `TcpTestSucceeded: True` ✅

Despite all of the above passing, Edge still shows "refused to connect".

---

## What was attempted

### Attempt 1: `host: '0.0.0.0'`
IPv4-only binding. Edge's IPv6 attempt (`::1`) fails.
**Result:** No change.

### Attempt 2: `host: '::'`
IPv6 wildcard — covers both `::1` and `127.0.0.1` via Linux dual-stack.
`curl -6` returns 200. PowerShell `TcpTestSucceeded: True`.
**Result:** WSL2 curl works, Edge still fails.

### Attempt 3: Restructure to flat single-package + Vite 8 beta
Deleted monorepo (`packages/`), merged to `src/` with one `package.json`. Copied working Vite config from `~/Projects/pdf-form-gen` (Vite 8 + `@vitejs/plugin-react-swc` + `%VITE_ENTRY%` in `index.html`).
**Result:** Same — server reachable from WSL2 curl, Edge still fails.

### Attempt 4: Programmatic `vite.createServer()`
Used Vite's Node API instead of spawning the CLI.
**Result:** Server hung — HTTP requests returned connection refused. Reverted to spawning Vite CLI as child process.

### Attempt 5: Delete serve.ts abstraction (current state)
Removed `src/cli/serve.ts` entirely. Vite spawn logic moved inline into `src/cli/dev.ts` and `src/cli/index.ts`.
**Result:** Cleaner code, same underlying spawn approach.

---

## How to test (from WSL2)

```bash
# Start dev server
bun src/cli/index.ts dev src/examples/chp-contract/form.tsx

# In another terminal — check binding
ss -tlnp | grep <PORT>
# Should show *:PORT

# IPv4
curl -4 -s -o /dev/null -w "%{http_code}" http://127.0.0.1:<PORT>/

# IPv6
curl -6 -s -o /dev/null -w "%{http_code}" http://localhost:<PORT>/
```

From Windows PowerShell:
```powershell
Test-NetConnection -ComputerName localhost -Port <PORT>
```

---

## Suspected remaining cause

Windows hosts file may have `::1 localhost` commented out.

**Check:** Open PowerShell as admin and run:
```powershell
Get-Content C:\Windows\System32\drivers\etc\hosts | Select-String localhost
```

If `::1 localhost` is missing or commented out, that would prevent Edge from connecting even when the server binds `::`.

**Workaround:** Navigate to the Network/IP URL printed by Vite instead of `localhost`.

---

## Current state

- `serve.ts` deleted — no longer exists
- Vite spawn with `--host ::` is inlined directly in `dev.ts` (for `dev` command) and `index.ts` (for PDF generation)
- The server starts correctly and is reachable from WSL2
- Edge connectivity on Windows is still unconfirmed
