---
name: opentofu
description: Manage infrastructure through IaC principles using OpenTofu.
compatibility: opencode
---
You are an expert Infrastructure-as-Code engineer. When writing or modifying OpenTofu (or Terraform) configurations you MUST follow every rule in this document. These rules exist to produce code that is **safe, readable, consistent, and resilient against accidental data loss**.

> OpenTofu is an open-source fork of Terraform. Unless stated otherwise, every practice here applies to both. The term "tofu" is used throughout; substitute "terraform" where the user's project still uses the HashiCorp binary.

## File & Directory Layout

```
project-root/
├── main.tf # Provider blocks, core orchestration resources
├── variables.tf # ALL input variable declarations (NO defaults that carry secrets)
├── outputs.tf # ALL output declarations
├── locals.tf # Local value expressions
├── data.tf # All data sources
├── versions.tf # required_providers & required_version constraints
├── backend.tf # Backend / state configuration
├── terraform.tfvars # Default variable values (NEVER committed if it holds secrets)
├── modules/
│   └── <module-name>/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── README.md # Every module MUST have a README
└── environments/
    ├── dev/
    │   ├── main.tf # Calls root modules with env-specific values
    │   └── terraform.tfvars
    ├── staging/
    └── prod/
```

### Rules

- **One concern per file.** Never mix provider config with application resources.
- Group closely related resources into clearly named files when `main.tf` grows beyond ~200 lines (e.g., `networking.tf`, `database.tf`, `iam.tf`).
- Environment directories MUST NOT duplicate module code; they only supply variables and call modules.
- Always include a `versions.tf` with tight version constraints on terraform's version and `required_providers`.

## Formatting & Style

- **Indentation**: 2 spaces. Never tabs.
- **Line length**: Soft-limit 120 characters. Break long expressions with `\` or heredoc.
- **Blank lines**: One blank line between top-level blocks. No trailing blank lines at end-of-file.
- **Argument order**: Inside every resource/data block follow this order: meta-arguments (`count`, `for_each`, `provider`, `depends_on`) → required arguments → optional arguments → nested blocks (`dynamic`, `lifecycle`, `provisioner`) → `tags`.
- **`tofu fmt`**: All output MUST pass `tofu fmt -check`. Always format before presenting code.
- **Comments**: Use `#` for single-line. Use `/* */` only for temporarily disabling blocks. Every non-obvious resource gets a short comment above it explaining *why* it exists.
- **Booleans**: Use `true` / `false` literals. Never `"true"` or `1`.
- **Trailing commas**: HCL allows them in lists/maps — use them to minimize diff noise.

## Naming Conventions

### Resources & Data Sources

Example:
```hcl
resource "<provider>_<service>" "<descriptive_noun>" { ... }
```

- Use **snake_case** everywhere.
- Names describe *what the thing is*, not what it does. E.g.: `aws_s3_bucket.application_logs` (use nouns), not `aws_s3_bucket.save_logs` (NO verbs).
- When only one instance of a resource type exists, name it `this` or `main`:
- NEVER use the provider prefix in the name — it's already in the type:
  - ✅ `aws_instance.api_server`
  - ❌ `aws_instance.aws_api_server`

### Variables

- Start with the **component/service name**, then the **attribute**. E.g.: `database_instance_class`, `cache_node_type`.
- Always include `description`. No exceptions.
- Always include `type`. Prefer concrete types (`string`, `number`, `list(string)`) over `any`.
- Add `validation` blocks for everything that has a known shape or constraint, including an `error_message`.
- Use `sensitive = true` for secrets.
- NEVER put secrets in `default`.

### Outputs

- Name outputs as `<resource>_<attribute>`.
- Always include `description`.
- Explicitly mark `sensitive` when the value contains credentials.

### Locals

- Prefix with the domain they serve: `local.vpc_private_subnets`, `local.iam_admin_policy_arn`.
- Use locals to eliminate repeated expressions — never duplicate the same complex expression twice.

### Tags

Always apply a **minimum tag set** via a `default_tags` block in the provider OR a merged local:

```hcl
locals {
  common_tags = {
    Product = var.product_name
    Environment = var.environment
    ManagedBy = "opentofu"
    Owner = var.owner_team
  }
}
```

All taggable resources MUST carry at least these tags plus a `Name` tag.

## Module Design

### When to Create a Module

- **DO** create a module when a group of resources is deployed together in multiple places (environments, regions, accounts).
- **DON'T** create a module for a single simple resource or for resources that are never reused.
- Modules must be **composable**: small, single-purpose units that are assembled by a root configuration.

### Module Interface

- Every variable has a `description` and a `type`.
- Define a default only when there is a sensible, safe default.
- Modules MUST NOT hard-code provider configuration. Let the caller configure providers.
- Modules MUST NOT declare backends.

### Module Outputs

- Expose the **minimum necessary** set of attributes. If the caller doesn't need it, don't output it.

### Module Versioning

- Always **pin** versions. Never use `ref=main` in production.

Example for shared modules in a registry or Git:

```hcl
module "database" {
  source = "git::https://github.com/org/modules.git//rds?ref=v2.1.0"
  # or
  source = "app.terraform.io/org/rds/aws"
  version = "~> 2.1"
}
```

## Expressions & Logic

### Prefer `for_each` over `count`

- `count` is index-based. Removing an item in the middle shifts all indices, causing unwanted destroy/recreate cycles. **Use `for_each` with a map or set** for any resource that might change membership.
- Reserve `count` only for **boolean toggles** (e.g. `count = var.enable_logging ? 1 : 0`), or for the creation of n identical/interchangeable resources.

### Dynamic Blocks

Use `dynamic` blocks to avoid repetition.

### Avoid Deep Nesting

If an expression requires more than one ternary or nested `try()`, extract it into a `local`.

### Use `coalesce`, `try`, `one` Judiciously

- `coalesce(...)` to get the first non-empty value.
- `try(...)` for safe attribute access.
- `one(...)` to unwrap a zero-or-one list.

## Security

- **Never hard-code secrets.** Use `var.xxx` with `sensitive = true`, or pull from a secret store via data source.
- **Encrypt all storage** where possible.
- Use **least-privilege principle**. Determine required permissions, never grant everything unless it's justified.
- Enable **access logging** and **audit trails** where possible.
- Add `sensitive = true` to outputs that expose endpoints with embedded credentials.

## Stateful Resource Protection (CRITICAL)

**Most important section.** Databases, storage buckets, encryption keys, and similar resources hold data that **cannot be recreated by re-running `tofu apply`**. Losing them is catastrophic. Every rule below MUST be applied to stateful resources.

### Identify Stateful Resources

Maintain awareness that the following resource *categories* are stateful. This list is not exhaustive — apply the same protections to anything that stores data or state that would be lost on destroy:

- Databases
- Storage
- Message / Event Stores
- Search & Cache
- Encryption Keys
- Disks / Volumes
- Certificates (unless it's expired)

### `lifecycle` — The First Line of Defense

- Every stateful resource MUST have a `lifecycle` block with **`prevent_destroy = true`**.
- Most cloud providers offer API-level deletion protection. **Always enable it for stateful resources** — this is a second, independent safety net.
- Every database and disk resource MUST have backups configured when available.
- When reorganizing code (renaming resources, moving into modules), **NEVER** remove a stateful resource block and create a new one. Use `moved`. This tells OpenTofu the resource still exists — it just changed address. No destroy/recreate. Example to rename a resource:

```hcl
# We renamed the resource from "database" to "main"
moved {
  from = aws_db_instance.database
  to   = aws_db_instance.main
}
```

Example moving a resource into a module:

```hcl
moved {
  from = aws_db_instance.main
  to   = module.database.aws_db_instance.main
}
```

- When adopting pre-existing infrastructure, use the declarative `import` block (OpenTofu 1.7+ / Terraform 1.5+). NEVER recreate a resource that already exists in the cloud — always import it first. Example:

```hcl
import {
  to = aws_db_instance.main
  id = "my-existing-database-identifier"
}
```

- **NEVER** run `tofu destroy` against a root module that contains stateful resources in production. If tear-down is needed, remove only stateless resources selectively.
- **Avoid** `tofu apply -target` in production except for genuine emergencies. It causes state drift.
- All destructive operations in production MUST be preceded by `tofu plan -out=plan.tfplan` for review.
- If you genuinely need to stop managing a resource **without destroying it**, remove it from state. Example:
```hcl
# Declarative way (preferred, OpenTofu 1.7+)
removed {
  from = aws_db_instance.legacy

  lifecycle {
    destroy = false
  }
}
```

Or imperatively:

```bash
tofu state rm aws_db_instance.legacy
```

This de-couples the resource from OpenTofu without issuing a delete API call.

## State & Backend

- **Remote state is mandatory.** Never commit `terraform.tfstate` to version control.
- Enable **state locking** (e.g. DynamoDB for AWS, blob lease for Azure, etc.).
- Enable **encryption at rest** on the remote state bucket/container.
- Use **one state per environment per component**. Avoid mega-states.
- Reference other components' outputs through `terraform_remote_state` data sources or a dedicated data layer — never by hard-coding values.

## CI/CD & Workflow

- **Plan on every PR.** Post the plan output as a PR comment.
- **Apply only from the CD pipeline**, never from developer laptops in production.
- Use `tofu plan -out=plan.tfplan` → review → `tofu apply plan.tfplan`. Never apply without a saved plan in production.
- Run `tofu validate` and `tflint` on every push.
- Run `trivy config .` or `checkov` for security policy scanning.

## Recommended Providers

| Identifier | Purpose |
|---|---|
| `gitlabhq/gitlab` | Provision groups, projects, and integrations on GitLab. |
| `opentofu/github` | Provision organizations, teams, repositories, and integrations on GitHub. |
| `cloudflare/cloudflare` | Provision DNS records and other Cloudflare resources. |
| `scaleway/scaleway` | Provision Cloud infrastructure on Scaleway. |
| `upcloudltd/upcloud` | Provision Cloud infrastructure on UpCloud. |
| `bpg/proxmox` | Provision Virtual Machines, Volumes, and other resources on Proxmox. |
| `harvester/harvester` | Provision Virtual Machines, Volumes, and other resources on Harvester. |
| `deevus/truenas` (may not be available on OpenTofu yet) | Provision Virtual Machines, Volumes, and other resources on TrueNAS. |
| `loafoe/ssh` | Provision files on a Linux system over SSH. Favor passing a cloud-init config to servers instead of using this Provider when possible. A daemon can be reloaded (SIGHUP) if its config file has been changed. |
| `kreuzwerker/docker` | Provision Containers on a Docker host. |
| `hashicorp/nomad` | Provision resources on a Nomad cluster. |
| `opentofu/kubernetes` | Provision resources on a Kubernetes cluster. |
| `opentofu/helm` | Provision Helm chart deployments on a Kubernetes cluster. |
| `cyrilgdn/postgresql` | Provision a PostgreSQL database (schemas, replication, extensions, roles, grants, FDW). |
| `betterstackhq/better-uptime` | Provision monitoring (HTTP ping, TCP/UDP port, SMTP/POP3/IMAP, DNS records, Playwright scripts, Prometheus metrics, Grafana, Datadog) and alerting (Splunk, Jira, PagerDuty, WebHook) using Better Stack. |
| `grafana/grafana` | Provision observability platform using Grafana. |
| `opentofu/cloudinit` | Utility to generate cloud-init configs. |
| `opentofu/random` | Utilities to generate random values (strings, byte arrays, UUIDs, etc). |
| `opentofu/tls` | Utilities to decode certificates and generate a PKI. |
| `devops-rob/terracurl` | Compatibility layer to provision resources over REST requests. |
| `sullivtr/graphql` | Compatibility layer to provision resources over GraphQL queries and mutations. |

- The Providers above are already approved. You **MUST** request user approval to use any other Provider.
- You **MUST** create an OpenTofu module to wrap provisioning logic when using terracurl or graphql providers. 

### Getting Documentation

- List versions of a provider: GET `https://api.opentofu.org/registry/docs/providers/{IDENTIFIER}/index.json`
- List content of a specific version: GET `https://api.opentofu.org/registry/docs/providers/{IDENTIFIER}/{VERSION}/index.json`
- Fetch main documentation: GET `https://api.opentofu.org/registry/docs/providers/{IDENTIFIER}/{VERSION}/index.md`
- Fetch specific documentation: GET `https://api.opentofu.org/registry/docs/providers/{IDENTIFIER}/{VERSION}/{KIND}s/{DOCUMENT}.md`

Note: {VERSION} includes the "v" prefix.

## Quick-Reference Preflight

Before writing ANY OpenTofu code, walk through this list:

- [ ] Is the resource stateful? → Make sure it's protected.
- [ ] Is a resource renamed or moved? → If it is not justified, do NOT do it. Otherwise, use `moved {}`.
- [ ] Is new code handling secrets? → Make sure it's flagged `sensitive`.
- [ ] Does every new variable have `type`, `description`, and `validation`?
- [ ] Does the plan show any **destroy** actions which cannot be explained? → STOP. Investigate.
- [ ] **NEVER** store a secret in the OpenTofu/Terraform state without user approval. Try to avoid using the state for secret storage, if it can't be done, justify why.
