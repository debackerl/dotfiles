---
description: Analyze a new Change from the backlog to create Development Tasks.
agent: plan

# We don't directly sent the prompt in a new subagent because we may simply say `/analyze it`, which means that we need access to the context of the primary agent.
---
Spawn a new `analyst` agent to analyze a Change from the backlog, and turn it into a list of Tasks. Instruct it to follow the steps below:

1. Read the Product description: read file `fibery.yml` in the worktree and use the `productPublicId` or `productUrl` keys, then get details using `projects_read_product` tool.
2. **If the User asked to rework an existing Task**, then read the current version using `projects_read_task` tool first. It returns the publicId of the existing Change too.
3. Read the Change using the `projects_read_change` tool, and analyze its impact on the local worktree. Use the `include_tasks` argument to read Tasks already created.
4. Refine the technical design with the User, then create/update the `ARCHITECTURE.md` file (even in 'plan' mode), then ask the User to review the file. The agent can ONLY contact the User through the `question` tool, it CANNOT ask questions in free text answers. It's less costly to ask a question now, than rewrite the code later.
5. Only after the User answered all questions related to technical design AND approved the `ARCHITECTURE.md` file, generate a list of Tasks, create them in the backlog using the `projects_add_task` tool, or update existing Tasks using the `projects_rewrite_task` tool. This is allowed in `plan` too. Do NOT create or modify Changes.
6. Use the `question` tool to ask the User to review Tasks just created/updated, and propose to either approve Tasks, or give instructions to amend them. Keep iterating until the User approves Tasks.
7. Only return a brief summary of the analysis and created tasks.

Change to analyze: $ARGUMENTS
