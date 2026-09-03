---
name: coder-design
description: Guidelines for Principled Software Engineering.
compatibility: opencode
---
Every line of code you produce must reflect DDD, DRY, SOLID, KISS, and Separation of Concerns. Follow these rules without exception.

## 1. Domain-Driven Design (DDD)

- **Ubiquitous Language**: Name classes, methods, variables, and modules using the domain language. Never invent technical jargon where a business term exists.
- **Bounded Contexts**: Isolate distinct business capabilities into separate modules/packages. Never let one context leak its internals into another.
- **Entities vs Value Objects**: Give objects with identity lifecycle an ID. Make everything else an immutable Value Object.
- **Aggregates**: Mutate state only through aggregate roots. Never reach into a child entity directly.
- **Domain Events**: Communicate cross-context side-effects through events, not direct calls.
- **Repository Pattern**: Abstract all persistence behind repository interfaces defined in the domain layer.

## 2. Don't Repeat Yourself (DRY)

- Extract shared logic into single-purpose utility functions or base classes.
- Centralize constants, configuration, and magic values in one place.
- If a block of logic appears twice, refactor immediately — no "TODO: dedupe later."
- Prefer composition and parametrization over copy-paste with slight variations.

## 3. SOLID Principles

- **Single Responsibility**: Every class/module does exactly one thing. If you use "and" to describe it, split it.
- **Open/Closed**: Extend behavior through abstractions (interfaces, plugins, strategy pattern).
- **Liskov Substitution**: Subtypes must be drop-in replacements. Never override a method to throw `NotImplemented` or silently no-op.
- **Interface Segregation**: Keep interfaces small and role-specific. A consumer must never depend on methods it doesn't use.
- **Dependency Inversion**: High-level modules depend on abstractions, never on concretions. Inject dependencies; never instantiate them internally.

## 4. KISS (Keep It Simple, Stupid)

- Choose the simplest solution that meets the requirement. No speculative generalization.
- Avoid premature abstractions. Extract only when a real second use case emerges.
- Prefer flat over nested. If indentation exceeds 3 levels, refactor.
- Prefer standard library and well-known patterns over clever custom solutions.
- Delete dead code. Commented-out code is dead code.

## 5. Separation of Concerns

**Layer Architecture**, enforce unidirectional dependencies:

- **Domain Layer**: Pure business logic. Zero imports from frameworks, I/O, or infrastructure.
- **Infrastructure Layer**: Implements repository interfaces, external APIs, database access, messaging.
- **Application Layer**: Orchestrates use cases. Calls domain objects and repository interfaces. Defines DTOs for input/output.
- **Presentation Layer**: HTTP controllers, CLI handlers, or UI components. Thin — delegates immediately to the application layer.

## 6. Twelve-Factor (to develop services)

Every microservice must conform to the ***12-Factor App** methodology:

| Factor | Rule |
|---|---|
| **Codebase** | One repo per service. One codebase, many deploys (dev/staging/prod). Never share code by copying — use versioned libraries. |
| **Dependencies** | Declare all dependencies explicitly (e.g., `pyproject.toml`, `package.json`). Never rely on ambient system packages. |
| **Config** | Store all environment-specific config (URLs, credentials, feature flags) in environment variables. Zero config in code or committed files. |
| **Backing Services** | Treat databases, caches, queues, and external APIs as attached resources. Swap them via config change only — no code change required. |
| **Build / Release / Run** | Strictly separate build, release, and runtime stages. A release is immutable; never mutate a deployed artifact. |
| **Processes** | Services are stateless and share-nothing. Persist all state in backing services. Never rely on in-memory session between requests. |
| **Port Binding** | Export services by binding to a port. The service is self-contained — no external web server injection. |
| **Concurrency** | Scale out via the process model. Design for horizontal scaling; avoid vertical scaling workarounds. |
| **Disposability** | Processes start fast and shut down gracefully on `SIGTERM`. Drain in-flight requests; release locks and connections cleanly. |
| **Dev/Prod Parity** | Keep development, staging, and production as similar as possible. Avoid "it works on my machine" gaps. Use containers. |
| **Logs** | Treat logs as event streams. Write to `stdout`/`stderr` only — never manage log files. Let the platform aggregate and route. |
| **Admin Processes** | Run admin tasks (migrations, scripts) as one-off processes in the same environment as the app. Ship them with the codebase. |

## 7. Observability (to develop services)

Instrument every service to be observable from day one. Observability means you can answer *"what is the service doing right now and why?"* from external signals alone.

### Three Pillars

- **Logs** — Structured JSON to `stdout`. Include `trace_id`, `span_id`, `service`, `level`, and `timestamp` on every line. Never log secrets or PII.
- **Traces** — Propagate OpenTelemetry context headers (`traceparent`) across all inbound and outbound calls. Create spans for every meaningful unit of work (HTTP handlers, DB queries, external calls).
- **Metrics** — Expose a Prometheus-compatible `/metrics` endpoint. Capture what is happening numerically over time.

### Best Practices

- **Correlation IDs**: Capture the `trace_id` at the entry point (or generate one if none is available) and thread it through every log line, error response, and outbound request or message.
- **Health endpoints**: Expose `GET /healthz` (liveness) and `GET /readyz` (readiness) separately. Liveness = process is alive. Readiness = service can handle traffic (dependencies reachable).
- **Structured errors**: Return errors with a machine-readable `code`, human-readable `message`, and the `trace_id` so operators can correlate user reports to traces.
- **Sampling**: Use head-based sampling for high-volume services. Always sample errors at 100%.
- **Alerting-ready**: Every metric you add should have a clear answer to *"what alert would fire from this?"* before it ships.

## 8. Prometheus Metrics Endpoint

Every service must expose a `GET /metrics` endpoint in the [Prometheus text exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/). This endpoint is scraped by the central observability platform. This does not apply to CLI, batch, or GUI applications.

### Rules

- **Path**: Always `GET /metrics`. No auth by default in-cluster; protect with network policy or a sidecar if exposed externally.
- **Format**: Plain text, `Content-Type: text/plain; version=0.0.4; charset=utf-8`.
- **Cardinality**: Keep label cardinality low. Never use user IDs, request IDs, or unbounded values as label values.
- **Naming**: Follow `<service>_<subsystem>_<name>_<unit>`. Units must be unprefixed base units (`seconds`, `bytes`, `total`).

### Required Technical Metrics (every service)

```
# Latency histogram per endpoint
http_request_duration_seconds{method, route, status_code}  [histogram]

# Request throughput
http_requests_total{method, route, status_code}            [counter]

# In-flight requests
http_requests_in_flight{method, route}                     [gauge]

# Error rate (4xx/5xx)
http_errors_total{method, route, status_code}              [counter]

# Downstream call latency (DB, cache, external APIs)
external_call_duration_seconds{target, operation}          [histogram]
external_call_errors_total{target, operation}              [counter]

# Runtime (language-specific, use client library defaults)
process_cpu_seconds_total                                  [counter]
process_resident_memory_bytes                              [gauge]
go_goroutines / clr_process_threads / python_threads       [gauge]
```

### Required Business Metrics (domain-specific)

Expose domain-level metrics so business health can be assessed without querying the database. Examples:

```
# Orders domain
orders_created_total{channel, region}                      [counter]
orders_failed_total{reason, channel}                       [counter]
checkout_duration_seconds{payment_method}                  [histogram]

# Generic patterns to follow
<domain>_<event>_total{...discriminating labels}           [counter]
<domain>_<state>_current{...discriminating labels}         [gauge]
<domain>_<operation>_duration_seconds{...}                 [histogram]
```

Define business metrics in the **application layer**. Use the repository/event pattern to emit them without coupling domain logic to Prometheus libraries directly; inject a `MetricsPort` interface.
