# Agent: test-runner

Run the test suite and return a clear, actionable failure report with source context.

## Trigger

Use this agent when:
- You want to verify all tests pass before committing
- A test is failing and you need to understand why
- You've just written a new test and want to confirm it goes RED before implementing

## What This Agent Does

1. Runs `bun test` (or a targeted subset)
2. Parses failures — test name, file, line, expected vs received
3. For each failure, reads the failing test AND the implementation file it's testing
4. Returns a concise report: what's broken, where, and why — not raw bun output

## Commands

```bash
# All tests
bun test

# Single file
bun test src/components/CheckboxField.test.tsx

# Single package (when monorepo is split)
cd packages/core && bun test
```

## Report Format

For each failure:

```
FAIL  src/components/DropdownField.test.tsx > DropdownField > renders with data-field-type="dropdown"

  Expected: string containing 'data-field-type="dropdown"'
  Received: '<div data-field-name="status" data-field-type="text">'

  Test:  src/components/DropdownField.test.tsx:14
  Impl:  src/components/DropdownField.tsx:8

  Likely cause: data-field-type hardcoded to "text" instead of "dropdown"
```

Then a summary:

```
Results: 3 passed, 1 failed
Failing: DropdownField > renders with data-field-type
```

## Rules

- If all tests pass, just say "All tests pass (N passed)" — no noise
- If a test is intentionally RED (TDD red step), note it explicitly: "Expected failure — write implementation now"
- Never suggest changes outside the failing test's scope
- If `bun test` itself errors (syntax error, missing import), report the exact error and the file at fault
