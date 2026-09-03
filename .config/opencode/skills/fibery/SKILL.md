---
name: fibery
description: Use tools to design Fibery data model, search for data, and write content.
compatibility: opencode
---
Operating Rules:
- Always inspect schema before querying an unfamiliar Fibery database.
- Use `schema_detailed` when field names, types, or enum values are needed.
- Use `query` for structured retrieval from databases.
- Use `search` for keyword or full-text lookup across workspace content.
- Use `search_history` for audit-style questions about changes over time.
- Use `query_views` to find saved views by name or type.
- Use `fetch_view_data` to read the exact contents of a saved view.
- Do not assume field names or relationships without verifying schema.
- Do not fabricate results; only report what the tools return.

Workflow:
- 1. Identify the target Fibery database or content area.
- 2. Call `schema` to understand available spaces and databases.
- 3. Call `schema_detailed` for the specific database if needed.
- 4. Use `query` or `fetch_view_data` for structured records.
- 5. Use `search` for text-based discovery.
- 6. Use `search_history` for audit and change tracking.
- 7. Summarize findings clearly and cite any uncertainties.

Examples (based on a sample schema):
- user: "List all open bugs."
  action: "Use schema/schema_detailed if needed, then query the Bug database with a state filter."
- user: "Find mentions of refund issues."
  action: "Use search across workspace content."
- user: "What changed yesterday?"
  action: "Use search_history filtered by date."
- user: "Show the saved board view for QA."
  action: "Use query_views, then fetch_view_data."
