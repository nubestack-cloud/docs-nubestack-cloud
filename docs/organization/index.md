---
title: Organization
description: Manage your organization's people, roles, service accounts, billing, audit log, quota, projects and settings.
---

# Organization

The **Organization** scope is where owners and admins run the account: who is in it, which
projects exist, how quota is shared, how people sign in, and what everything costs. Choose
**Organization** at the top of the scope selector. The billing role and viewers see it too, with
what their role allows.

In the organization scope the menu's **IAM**, **Billing**, **Activity**, **Quota** and
**Settings** are the organization's, and **Compute**, **Networking**, **Storage** and **Security**
list every project's resources read-only. See [The console](../get-started/console.md#the-menu).

<div class="grid cards" markdown>

-   :material-account-multiple-outline:{ .lg .middle } **[People and invitations](members.md)**

    ---

    IAM → People: invite people, change their roles, suspend or remove them.

-   :material-badge-account-horizontal-outline:{ .lg .middle } **[Custom roles](custom-roles.md)**

    ---

    IAM → Roles: your own organization and project roles.

-   :material-robot-outline:{ .lg .middle } **[Service accounts and API keys](service-accounts.md)**

    ---

    IAM → Service accounts: identities for automation, their API keys and cloud credentials.

-   :material-chart-line:{ .lg .middle } **[Usage](usage.md)**

    ---

    Billing → Usage: what has been measured, by project, location and resource. Provisional.

-   :material-receipt-text-outline:{ .lg .middle } **[Statements and cost explorer](statements-and-costs.md)**

    ---

    Billing: each month's cost at the published rates, where the money goes, and the prices.

-   :material-history:{ .lg .middle } **[Audit log and activity](activity.md)**

    ---

    Activity: every change, refusal and security event, and each project's operations.

-   :material-gauge:{ .lg .middle } **[Quota](quota.md)**

    ---

    Share the organization's budget between projects; presets and requests for more.

-   :material-folder-outline:{ .lg .middle } **[Projects](projects.md)**

    ---

    Settings → Projects: every project, access to one, and deleting a project safely.

-   :material-cog-outline:{ .lg .middle } **[Settings](settings.md)**

    ---

    Project creation, second factor, invitation domains, the audit log, and closing.

-   :material-email-outline:{ .lg .middle } **[E-mail notices](notifications.md)**

    ---

    Which e-mails you get, and which are always sent.

</div>

## Who sees what

| Page | Owner | Admin | Billing | Member | Viewer |
|---|:-:|:-:|:-:|:-:|:-:|
| The Organization scope | ✓ | ✓ | ✓ | — | — |
| IAM → People | Manage | Manage, not owners | See | — | — |
| IAM → Roles | Manage | Manage | See | — | — |
| IAM → Service accounts | Manage | Manage | — | — | — |
| Billing | See | See | See | — | — |
| Activity (audit log) | Read | Read | — | — | — |
| Quota | Manage | Manage | — | — | — |
| Settings | Manage | Manage, not security | See | — | — |

Members and viewers work inside projects. Every role sees **IAM → People** and **IAM → Roles** of
the projects it works in. [Roles and permissions](../concepts/roles-and-permissions.md) has the
full table.

## Changes here take effect at once

Inviting someone, changing a role, editing a quota preset or a setting changes NubeStack Cloud's
own records, so it takes effect at once and has no [operation](../concepts/operations.md). Where
a location must follow, such as a project's quota or someone's access in Horizon, it does so
within minutes.
