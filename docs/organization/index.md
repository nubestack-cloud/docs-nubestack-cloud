---
title: Organization
description: Manage your organization's people, projects, roles, automation, quota, settings, audit log, usage and statements.
---

# Organization

The organization workspace is where owners and admins run the account: who is in it, which
projects exist, how quota is shared, how people sign in, and what everything costs. Open it by
choosing the organization itself in **Workspace** at the top of the console.

<div class="grid cards" markdown>

-   :material-account-multiple-outline:{ .lg .middle } **[Members and invitations](members.md)**

    ---

    Invite people, change their roles, suspend or remove them.

-   :material-folder-outline:{ .lg .middle } **[Projects](projects.md)**

    ---

    Project access, locations, and deleting a project safely.

-   :material-badge-account-horizontal-outline:{ .lg .middle } **[Custom roles](custom-roles.md)**

    ---

    Your own organization and project roles, from the same actions as the built-in ones.

-   :material-robot-outline:{ .lg .middle } **[Service accounts and API keys](service-accounts.md)**

    ---

    Identities for automation, their API keys and cloud credentials.

-   :material-gauge:{ .lg .middle } **[Quota](quota.md)**

    ---

    Share the organization's budget between projects; presets and requests for more.

-   :material-cog-outline:{ .lg .middle } **[Settings](settings.md)**

    ---

    Project creation, second factor, invitation domains, the audit log, and closing.

-   :material-email-outline:{ .lg .middle } **[E-mail notices](notifications.md)**

    ---

    Which e-mails you get, and which are always sent.

-   :material-history:{ .lg .middle } **[Audit log and activity](activity.md)**

    ---

    Every change, refusal and security event, and each project's operations.

-   :material-chart-line:{ .lg .middle } **[Usage](usage.md)**

    ---

    What has been measured, by project, location and resource. Provisional.

-   :material-receipt-text-outline:{ .lg .middle } **[Statements and cost explorer](statements-and-costs.md)**

    ---

    Each month's cost at the published rates, and where the money goes. Provisional.

</div>

## Who sees what

| Page | Owner | Admin | Billing | Member | Viewer |
|---|:-:|:-:|:-:|:-:|:-:|
| Members | Manage | Manage, not owners | See | See | See |
| Projects | Manage | Manage | See | Their own | See |
| Roles, service accounts, quota | Manage | Manage | — | — | — |
| Settings | Manage | Manage, not security | — | — | — |
| Audit log | Read | Read | — | — | If allowed |
| Usage, statements, costs | See | See | See | — | — |

[Roles and permissions](../concepts/roles-and-permissions.md) has the full table.

## Changes here take effect at once

Inviting someone, changing a role, editing a quota preset or a setting changes NubeStack Cloud's
own records, so it takes effect at once and has no [operation](../concepts/operations.md). Where
a location must follow, such as a project's quota or someone's access in Horizon, it does so
within minutes.
