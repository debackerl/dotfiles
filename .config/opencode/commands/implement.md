---
description: Implement a Change from the backlog.
agent: build
---
Implement a Change from the backlog. A Change is made of Tasks, implement them one-by-one, until all Tasks have been implemented. Follow the steps below:

1. Use the `projects_read_change` tool to read the Change and all its Tasks.
2. For each Task, execute the following steps:
   a. Use the `projects_update_task` tool to change status of the Task as `In Progress`.
   b. Call the `coder` agent to implement the Task. Give it only the Task's publicId, and instruct it to use the `projects_read_task` tool to read details of the Task.
   c. Call the `code-reviewer` agent to review the implementation of the Task. Give it only the Task's publicId, and instruct it to use the `projects_read_task` tool to read details of the Task, and the `write` tool to write the review feedback in a file named `ISSUES-{taskPublicId}.md`. `code-reviewer` should only reply in text if the implementation is correct and compliant or not, or some improvement is needed. Do NOT tell it how to check, it knows best.
   d. If code-reviewer asked for improvement(s): repeat step 'b', but tell the `coder` agent to read issues from the `ISSUES-{taskPublicId}.md` file after using `projects_read_task`, and fix all the issues. Then repeat step 'c' until no issue is raised by the `code-reviewer` agent.
   e. Mark the Task as completed using the `projects_update_task` tool once the `code-reviewer` had no issue raised.
3. After all Tasks have been completed, use the `projects_update_change` tool to change status of the Change as `In Review`.

Change to implement: $ARGUMENTS
