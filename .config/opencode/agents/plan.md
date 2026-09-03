---
mode: primary
color: "#649F57"
description: Plan mode. Disallows all edit tools.
#model: github-copilot/gpt-5-mini
#model: opencode-go/minimax-m2.7
#model: opencode-go/qwen3.6-plus
#reasoningEffort: high
permission:
  doom_loop: deny
  external_directory:
    "*": deny
    /var/home/laurent/.local/share/opencode/tool-output/*: allow
    /var/home/laurent/.local/share/opencode/plans/*: allow
  question: allow
  plan_enter: deny
  plan_exit: allow
  read:
    "*": allow
    "*.env": ask
    "*.env.*": ask
    "*.env.example": allow
    /var/home/laurent/.ssh/*: deny
    /var/home/laurent/.ssh/*.pub: allow
  edit:
    .opencode/plans/*.md: allow
    var/home/laurent/.local/share/opencode/plans/*.md: allow
    /var/home/laurent/.*/*: deny
    "**/opencode.json": deny
  bash: deny
#    ls *: allow
#    grep *: allow
#    cat *: allow
#    su *: deny
#    sudo *: deny
  grep:
    "*": allow
    /var/home/laurent/.*/*: deny
  glob: allow
  list: allow
  task:
    # we deny by default, and only allow agents which can't make destructive changes
    "*": deny
    "inquiro": allow
    "analyst": allow
    "code-reviewer": allow
  skill: allow
  lsp: allow
  narsil_list_repos: allow
  narsil_get_index_status: allow
  narsil_neural_search: allow
  narsil_search_code: allow
  fibery_schema: allow
  fibery_schema_detailed: allow
  fibery_query: allow
  fibery_search: allow
  fibery_search_guide: allow
  fibery_search_history: allow
  fibery_query_views: allow
  fibery_fetch_view_data: allow
  fibery_get_entity_links: allow
  fibery_get_documents_content: allow
  "projects_read_*": allow
  projects_create_change: allow
  projects_update_change: allow
  duckdb_query_readonly: allow

# Overwriting the prompt below will overwrite the default prompt of OpenCode in Plan mode only.
---
