#!/usr/bin/env bash
# test-dev-server.sh
# Verifies the dev server works exactly as a Windows 11 Edge browser would use it:
#   1. Server starts and binds to both IPv4 and IPv6
#   2. localhost resolves and loads (Edge tries ::1 first, then 127.0.0.1)
#   3. All JS modules load without 404/500 errors (no broken imports)
#   4. React mounts cleanly with no duplicate-React hook errors

set -euo pipefail

REPO="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO"

PASS=0
FAIL=0
ok()   { echo "  PASS: $1"; PASS=$((PASS+1)); }
fail() { echo "  FAIL: $1"; FAIL=$((FAIL+1)); }

# ── Start dev server ──────────────────────────────────────────────────────────
echo ""
echo "Starting dev server..."
bun packages/cli/src/index.ts dev examples/chp-contract/form.tsx > /tmp/dev-test-out.txt 2>&1 &
SERVER_PID=$!

PORT=""
for i in $(seq 1 20); do
  sleep 1
  PORT=$(ss -tlnp 2>/dev/null | grep "pid=$SERVER_PID" | grep -oP ':\K[0-9]+' | head -1)
  [ -n "$PORT" ] && break
done

if [ -z "$PORT" ]; then
  echo "  FAIL: Server did not start within 20 seconds"
  echo "--- server output ---"
  cat /tmp/dev-test-out.txt
  exit 1
fi
echo "  Server on port $PORT"
echo ""

# ── Test 1: IPv6 ::1 (what Edge tries first) ─────────────────────────────────
echo "Test 1: IPv6 ::1 — Edge's first attempt at localhost"
CODE=$(curl -6 --max-time 3 -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null || echo "000")
[ "$CODE" = "200" ] && ok "IPv6 ::1 → $CODE" || fail "IPv6 ::1 → $CODE  ← Edge would show 'page not found' here"

# ── Test 2: IPv4 127.0.0.1 (fallback) ────────────────────────────────────────
echo "Test 2: IPv4 127.0.0.1 fallback"
CODE=$(curl -4 --max-time 3 -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/" 2>/dev/null || echo "000")
[ "$CODE" = "200" ] && ok "IPv4 127.0.0.1 → $CODE" || fail "IPv4 127.0.0.1 → $CODE"

# ── Test 3: form.tsx resolves (was returning 500 due to bad import path) ──────
echo "Test 3: form.tsx compiles without 500"
FORM_PATH=$(realpath examples/chp-contract/form.tsx)
CODE=$(curl -6 --max-time 5 -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/@fs${FORM_PATH}" 2>/dev/null || echo "000")
[ "$CODE" = "200" ] && ok "form.tsx → $CODE" || fail "form.tsx → $CODE  ← broken import in form.tsx or missing alias"

# ── Test 4: @pdf-form/core alias resolves ─────────────────────────────────────
echo "Test 4: @pdf-form/core alias resolves"
CODE=$(curl -6 --max-time 5 -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/@id/@pdf-form/core" 2>/dev/null || echo "000")
[ "$CODE" = "200" ] || [ "$CODE" = "304" ] && ok "@pdf-form/core → $CODE" || fail "@pdf-form/core → $CODE"

# ── Test 5: React mounts, no duplicate-React hook errors ─────────────────────
echo "Test 5: React mounts cleanly (no duplicate-React hook errors)"
TMPSCRIPT=$(mktemp /tmp/pw-check-XXXXXX.ts)
cat > "$TMPSCRIPT" <<TSEOF
import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
const errors: string[] = []
const failed: string[] = []
page.on('pageerror', e => errors.push(e.message))
page.on('response', r => { if (r.status() >= 500) failed.push(r.url()) })
await page.goto('http://localhost:$PORT/', { waitUntil: 'domcontentloaded', timeout: 10000 })
let ready = false
try {
  await page.waitForFunction(() => (window as any).__ready === true, { timeout: 12000 })
  ready = true
} catch {}
await browser.close()
const hookErrors = errors.filter(e => e.includes('Invalid hook call') || e.includes('useRef'))
console.log(JSON.stringify({ ready, hookErrors, failed }))
TSEOF

RESULT=$(bun "$TMPSCRIPT" 2>/dev/null || echo '{"ready":false,"hookErrors":["playwright error"],"failed":[]}')
rm -f "$TMPSCRIPT"

READY=$(echo "$RESULT" | bun -e "const d=await Bun.stdin.text(); const j=JSON.parse(d); process.stdout.write(String(j.ready))" 2>/dev/null || echo "false")
HOOK_ERR=$(echo "$RESULT" | bun -e "const d=await Bun.stdin.text(); const j=JSON.parse(d); process.stdout.write(String(j.hookErrors.length))" 2>/dev/null || echo "1")
FAILED=$(echo "$RESULT" | bun -e "const d=await Bun.stdin.text(); const j=JSON.parse(d); process.stdout.write(j.failed.join('\n'))" 2>/dev/null || echo "")

if [ "$READY" = "true" ]; then
  ok "React mounted (window.__ready = true)"
else
  fail "React did not mount"
fi

if [ "$HOOK_ERR" = "0" ]; then
  ok "No duplicate-React hook errors"
else
  fail "Duplicate React — $HOOK_ERR hook error(s). Multiple React copies loaded."
  echo "    Raw result: $RESULT"
fi

if [ -z "$FAILED" ]; then
  ok "No 500 errors on any resource"
else
  fail "500 errors on: $FAILED"
fi

# ── Cleanup ───────────────────────────────────────────────────────────────────
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ $FAIL -eq 0 ] && exit 0 || exit 1
