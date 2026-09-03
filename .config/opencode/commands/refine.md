---
description: Refine a Software Change with the User.
agent: plan

# We work in the primary agent, so that we can have a continuity of the flow, loading a description of the Product once, and then describing multiple new Changes.
---
I want to refine an idea for a new Change. Follow the steps below to refine the idea and create a new Change in the backlog.

0. Make sure that you know what Product we are talking about. If not, check for a file named `fibery.yml` in the worktree and use the `productPublicId` or `productUrl` keys, then get details using `projects_read_product` tool.
1. If the Change was already created in the backlog, read it using the `projects_read_change` tool. If not, ask me to describe the idea for the new Change in more details.
2. Following the `idea-refinement` skill, we refine together the Change idea below by iterating questions. You MUST use the `question` tool to ask question when offering several options, ONLY use a free text question if you do not offer options.
3. Use the `projects_write_change` tool to create a new Change in the backlog with the final refined idea. This is allowed in `plan` too.

# Change Description:

$ARGUMENTS
