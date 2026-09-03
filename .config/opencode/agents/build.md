---
# warning, as of v1.2.10, "write" and "edit" are different, exclusive permissions in agent Markdown files. 

mode: primary
color: "#D3604F"
description: The default agent. Executes tools based on configured permissions.
#model: github-copilot/gpt-5-mini
#model: opencode-go/minimax-m2.7
#model: opencode-go/qwen3.6-plus
# reasoningEffort: high
permission:
  question: allow
  plan_enter: allow
  plan_exit: deny
  read:
    "*": allow
    "*.env": ask
    "*.env.*": ask
    "*.env.example": allow
    /var/home/laurent/.ssh/*: deny
    /var/home/laurent/.ssh/*.pub: allow
  bash: allow
  #   "*": ask
  #   git status *: allow
  #   git log *: allow
  #   git diff *: allow
  #   git show *: allow
  #   git blame *: allow
  #   git grep *: allow
  #   git tag: allow
  #   git branch: allow
  #   git ls-files: allow
  #   ls *: allow
  #   grep *: allow
  #   cat *: allow
  #   su *: deny
  #   sudo *: deny
  grep:
    "*": allow
    /var/home/laurent/.*/*: deny
  glob: allow
  list: allow
  task: allow
  skill: allow
  lsp: allow
  narsil_list_repos: allow
  narsil_get_index_status: allow
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
  fibery_add_file_from_url: ask
  fibery_create_*: ask
  fibery_rename_*: ask
  fibery_update_*: ask
  fibery_set_*: ask
  fibery_get_connectors_list: allow
  "projects_read_*": allow
  projects_update_task: allow
  duckdb_query: allow

# Overwriting the prompt below will overwrite the default prompt of OpenCode in Build mode only.
---
