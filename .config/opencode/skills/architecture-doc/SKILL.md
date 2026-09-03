---
name: architecture-doc
description: Explains how to write architecture docs for software, with a clear structure.
compatibility: opencode
---
Write clear, actionable architecture docs for **one application** (service, CLI, desktop app, library, etc.). The doc lives alongside the codebase and guides developers building or maintaining it.

## Required Sections

Include every section below. If a section doesn't apply, keep the heading and write _"Not applicable — [brief reason]."_ so readers know it was considered.

### 1. Overview

- One-paragraph description of what the application does and why it exists.
- Application type (HTTP service, CLI tool, desktop app, worker, library, ...).
- Key constraints or non-negotiables (language, framework, target platform).

### 2. Architecture Decision Records (ADRs)

Table of important decisions with status:

```markdown
| ID | Decision | Status | Rationale |
|----|----------|--------|-----------|
| 001 | Use SQLite for local storage | Accepted | Single-user, no server needed |
```

Keep entries short. Link to longer write-ups if they exist.

### 3. Components

Describe the internal modules / layers of the application.

- Depending on the architecture principles adopted (Domain-Driven Design, Hexagonal Architecture, etc), categories the internal elements properly.
- Name, responsibility (single sentence), and public interface summary for each.
- Use a **Flowchart** diagram (see Mermaid Flowchart SKILL) to show how components connect.
- Show dependency direction. Cyclic dependencies are usually not desired, so you must state which module may or may not be aware of which other modules.

### 4. Conceptual Data Model

Domain entities and their relationships, **independent of storage**.

- Use a **Class Diagram** (see Mermaid Class Diagram SKILL) with entity names, key attributes, and relationship cardinalities.
- No database-specific details (no PKs, FKs, indexes).

### 5. Physical Data Model

How data is actually stored (DB tables, files on disk, local storage keys, etc.).

- Use an **ER Diagram** in Mermaid.
- Note indexes, constraints, and migration strategy if relevant.
- For apps with no persistent storage, state what is ephemeral and why.

### 6. Key Sequences

Illustrate the most important runtime flows (happy path + one key error path).

- Use **Sequence Diagrams** in Mermaid.
- Cover 2–5 flows; pick the ones a new developer would need first.

### 7. State Management

Document significant stateful behavior inside the application.

- Use a **State Diagram** in Mermaid for entities or processes with non-trivial lifecycles.
- If the app is largely stateless, say so and explain where transient state lives (memory, cache, context object).

### 8. Configuration & Environment

- List every config value the app reads (env vars, config files, CLI flags).
- Use a table: Name, Source, Required?, Default, Description.
- Note which values are secrets.

### 9. Error Handling & Observability

- Error classification strategy (retriable vs. fatal, user-facing vs. internal).
- Logging: format, levels used, where logs go.
- Metrics / health checks exposed, if any.

### 10. Choice of Librairies

- Which librairies are being used in this software.
- What were the reasons for selecting those librairies instead of others.
- Are there limitations in their adoption.

### 11. Testing Strategy

- What is unit-tested, what is integration-tested, what is E2E-tested.
- Key test boundaries (what gets mocked, what doesn't).
- Test data management strategy (fixtures, factories, test databases).

### 12. Build, Run & Deploy

- How to build and run locally (commands).
- Packaging / distribution format (container, binary, installer, package registry).
- Deployment target and process (if applicable).

## Style Rules

1. **Scope guard** — everything describes *this* application. External systems appear only as opaque boxes in diagrams.
2. **Diagram density** — each Mermaid diagram ≤ 15 nodes. Split into multiple diagrams if larger.
3. **No vague labels** — every component, entity, and arrow must have a concrete name or verb. Avoid "handles stuff" or "misc".
4. **Keep it current** — add a `Last updated: YYYY-MM-DD` line at the top of the generated doc.
5. **One heading = one idea** — don't merge unrelated concerns into a single section.
6. **Code-adjacent** — reference actual file/module paths from the codebase where possible (e.g., `src/db/schema.ts`).
