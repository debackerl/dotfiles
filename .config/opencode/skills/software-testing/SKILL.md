---
name: software-testing
description: Best practices and mandatory guidelines for writing software tests at all levels (unit, integration, end-to-end).
compatibility: opencode
---
You are an expert at testing software in an automated way. Follow these guidelines when writing or modifying tests at any level.

## Test Levels

### Unit Tests

- Test a single function, method, or class in isolation.
- Mock or stub all external dependencies (databases, APIs, file systems, clocks).
- Each test must assert one logical concept. Prefer multiple focused tests over one test with many assertions.
- Tests must be deterministic — no reliance on execution order, shared mutable state, or real time.
- Keep setup minimal. If setup is complex, the unit under test likely has too many responsibilities.

### Integration Tests

- Test the interaction between two or more components or services (e.g., service ↔ database, service ↔ external API).
- Use real implementations of internal dependencies where practical; mock only what is out of your control (third-party APIs, payment gateways).
- Verify correct data flow across boundaries: serialization, schema contracts, authentication hand-offs.
- Manage test data lifecycle — create before, clean up after. Tests must not leak state in any external system unless you can reset that system to the original state.

### End-to-End (E2E) Tests

- Test complete user-facing workflows through the full stack.
- Keep the E2E suite small and focused on critical paths. These tests are slow and brittle — do not duplicate what unit and integration tests already cover.
- Assert on observable outcomes (UI state, API responses, persisted data), not internal implementation.
- Design tests to be resilient to minor UI or timing changes (use stable selectors, explicit waits over sleeps).

## Required Coverage Scenarios

Every testable unit MUST include tests for all three categories below. Missing any category is a review blocker.

### 1. Happy Path

- Verify correct behavior with valid, expected inputs.
- Confirm return values, state changes, and side effects match requirements.

### 2. Edge Cases

- Boundary values (zero, one, max, min, empty collections, max-length strings).
- Null, undefined, or missing optional inputs.
- Concurrent, duplicate calls, race conditions where applicable.
- Unusual but valid input combinations.
- Adaopt an adversarial mindset — try to break the code with unexpected but valid inputs.

### 3. Error Handling

- Invalid or malformed input must produce clear, expected errors — not unhandled exceptions.
- Dependency failures (network timeouts, unavailable services, corrupt data) must be simulated and handled gracefully.
- Verify error messages, error codes, and any rollback or cleanup behavior.
- Confirm the system does not leak sensitive information in error responses.

### 4. Good Software Behavior

- Resilience: system should recover gracefully from transient failures and maintain availability under load. (test large inputs, simulate failures, verify retries and fallbacks)
- Performance: critical paths should meet defined performance benchmarks.
- Idempotency: duplicate functional requests should yield the same result without unintended side effects.
- Observability: critical operations should emit appropriate logs, metrics, and traces for monitoring and debugging.

## General Rules

- **Naming**: Test names must describe the scenario and expected outcome. Example: `rejects_negative_quantity` not `test3`.
- **Arrange-Act-Assert**: Structure every test in three distinct phases. Keep them visually separated.
- **No logic in tests**: No conditionals, loops, or try/catch in test bodies. A test that can't fail is worthless.
- **Fast by default**: Unit tests must run in milliseconds. Flag slow tests explicitly so they can be excluded from fast feedback loops.
- **Treat test code like production code**: Refactor duplication, name clearly, review in PRs.
