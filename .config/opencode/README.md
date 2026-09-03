## Getting started

### Installation

Copy all files in `~/.config/opencode/` (Linux).

### Environment Variables

| Name | Description |
|---|---|
| `FIBERY_BASE_URL` | Base URL of the Fibery workspace to use. |
| `FIBERY_API_TOKEN` | API token for authenticating with the Fibery API. |

### Setup of a new project

```bash
git clone git@gitlab.com:group/project-name.git
cd project-name
echo "productUrl: https://etive.fibery.io/Product_Strategy/Product/xxx" > fibery.yml

opencode
```

## Commands

The backlog for Software Development is kept at Fibery.com. Several commands are available to manage the backlog and implement changes. They are designed to be used sequentially, but some can be used in parallel for independent changes.

### Refine Changes

Type `/refine Create xxx` in OpenCode with your initial idea.

It will help refine it as a new Change, at the functional level. At the end, you get the link to the Change.

You can refine multiple Changes in parallel sessions.

### Generate Tasks

Type `/analyze it` or give the link to the Change, or its public ID.

You can always later rework some tasks saying `/analyze adapt Task 123 by changing ...`

The agent researches the work needed to realize the Change, and slice it into Tasks. Since Tasks describe exactly what should be done as code, it should be implemented as soon as possible. Changes can stay in the backlog for longer before they are analyzed however.

### Implementation

After reviewing the Tasks, type `/implement it` or a link to the Change, or its public ID.

This looks for all pending Tasks linked to the Change, and asks the agent to work on each, by one by one.

## Sub-Agents

The goal is that each sub-agent can be called on its own if needed, but the are designed to be called from the commands above. They remain agnostic of any backlog management tool.

We avoid to overload the primary agent with too much details about tasks, and we can have a better separation of concerns. Instead, sub-agents doing planning or generating feedback would saved details on Fibery or local files, and only return IDs and title back to the primary agent.

Inquiro is the only sub-agent that can be called by any other (sub-)agent.

### inquiro

Does research online using search engines, YouTube, public source code, public library repositories, and knowledge bases.

Ask it to do deep-research, and get the final analysis.

Example: `@inquiro How to render an SVG in Rust?`

### analyst

Breaks down a change request or bugfix into a list of actionable tasks.

Example: `@analyst Add a coupon system to the shopping cart. Coupons are created via the admin interface, are saved in the database, and get an expiration time.`

Updates:
- `ARCHITECTURE.md`
- Tasks in Fibery or files depending on the instruction

### coder

Implements a single task in code.

Example: `@coder Implement task FEAT-123 from TASKS.yml`

Updates:
- `README.md` in any code directory
- Source files

### code-reviewer

Reviews pending changes for quality and compliance.

Example: `@code-reviewer Check all changes staged on Git`

Updates:
- `ISSUES.yml`

## Safety

To avoid potential risks, like data loss or stolen credentials, several principles are followed:
- Agents can't simply find a command line on the internet and run it with file write access or network access without permission. We do not know what it could install or what data it may send back.
- The same agent shouldn't have the ability to execute without permission a script that it found on the internet, giving that script internet access.

However:
- It may also look for API documentation online, and use it to write code. This is done through the `inquiro` agent.
- An agent can send (HTTP) requests to test a service after editing code. This is done through the `code-reviewer` agent.

There is a residual risk that `inquiro` could give back malicious instructions found online to `coder`, which would then write it as a file, and have `code-reviewer` execute it later.
