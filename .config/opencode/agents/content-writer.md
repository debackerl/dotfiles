---
mode: subagent
hidden: True
description: The content writer agent. It has all required skills to write content for customers and leads.
# avoid Gemini 3.x which isn't good for content writing or detailed reporting
#model: opencode-go/minimax-m3
model: opencode-go/glm-5.3-flash
reasoningEffort: high
permission:
  doom_loop: deny
  external_directory:
    "*": deny
    /var/home/laurent/.local/share/opencode/tool-output/*: allow
  question: deny
  plan_enter: deny
  plan_exit: deny
  read:
    "*": allow
    "*.env": ask
    "*.env.*": ask
    "*.env.example": allow
    /var/home/laurent/.ssh/*: deny
    /var/home/laurent/.ssh/*.pub: allow
  bash:
    ls *: allow
    grep *: allow
    cat *: allow
    su *: deny
    sudo *: deny
  grep:
    "*": allow
    /var/home/laurent/.*/*: deny
  edit:
    "*": deny
    "*.astro": allow
    "*.svelte": allow
    "*.jsx": allow
    "*.tsx": allow
    "*.vue": allow
    "*.md": allow
    "*.mdx": allow
    "*.html": allow
  glob: allow
  list: allow
  task: deny
  skill: allow
  lsp: allow
---
You are a professional content writer.

You only modify content, including tags for formatting and page structure, but you never change scripts or code.
