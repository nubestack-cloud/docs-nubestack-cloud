---
title: NubeStack Cloud documentation
description: Guides and reference for NubeStack Cloud in Karachi and Islamabad. Launch instances, connect networks, keep data on volumes and serve HTTPS, from the console or the API.
hide:
  - toc
  - path
---

<div class="ns-hero" markdown>

<div class="ns-hero__main" markdown>

# NubeStack Cloud documentation

Learn to run instances, private networks, volumes and HTTPS load balancers in Karachi and
Islamabad, from the console or the API.

<label class="ns-search" for="__search" tabindex="0" role="button" aria-label="Search the documentation">
  <svg class="ns-search__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5"/></svg>
  <span class="ns-search__text">Search the docs</span>
  <kbd>/</kbd>
</label>

<div class="ns-popular" markdown>
<span>Popular</span>
[Instances](compute/instances.md)
[Load balancers](networking/load-balancers.md)
[API keys](organization/service-accounts.md#issue-an-api-key)
[API reference](api/reference/index.md)
</div>

</div>

<div class="ns-start" markdown>

<p class="ns-eyebrow">New to NubeStack Cloud?</p>

From an invitation to an instance you can log in to over SSH, in five short steps.

1. [Sign up and sign in](get-started/account.md)
2. [Find your way around the console](get-started/console.md)
3. [Understand your organization](get-started/organizations.md)
4. [Create a project](get-started/create-a-project.md)
5. [Launch your first instance](get-started/first-instance.md)

[Start the guide](get-started/index.md){ .md-button .md-button--primary }

</div>

</div>

<div class="ns-section-head" markdown>

## Services

[All services](services/index.md){ .ns-more }

</div>

<div class="grid cards" markdown>

-   :material-server-outline:{ .lg .middle } **[Compute](compute/index.md)**

    Instances, SSH keys, images, server groups, launch templates and instance groups.

-   :material-lan:{ .lg .middle } **[Networking](networking/index.md)**

    Private networks, routing, Internet gateways, security groups, public IPs and load balancers.

-   :material-database-outline:{ .lg .middle } **[Storage](storage/index.md)**

    Volumes that outlive instances, snapshots, and schedules that take them for you.

-   :material-shield-lock-outline:{ .lg .middle } **[Security](security/index.md)**

    TLS certificates for HTTPS listeners, several per listener by host name, and your second factor.

-   :material-account-group-outline:{ .lg .middle } **[Organization](organization/index.md)**

    People, roles, service accounts, billing, the audit log, quota and settings.

-   :material-view-grid-outline:{ .lg .middle } **[Every service](services/index.md)**

    All of them on one page, grouped as in the console's menu.

</div>

<div class="ns-section-head" markdown>

## Work the way you prefer

[Native access](native-access/index.md){ .ns-more }

</div>

The console, the API and each location's own OpenStack tools see the same projects, with the same
quota and the same access.

<div class="grid cards ns-ways" markdown>

-   :material-monitor-dashboard:{ .lg .middle } **[Console](get-started/console.md)**

    Every service in your browser, plus people, roles, billing and settings.

-   :material-api:{ .lg .middle } **[API](api/index.md)**

    JSON over HTTPS under `/v1`: everything inside a project the console does.

-   :material-console-line:{ .lg .middle } **[Horizon and OpenStack CLI](native-access/index.md)**

    Each location's own tools, with your NubeStack sign-in. They keep working when the console
    does not.

-   :material-file-code-outline:{ .lg .middle } **[CLI and Terraform](tools/index.md)**

    The `nexus` CLI and Terraform provider, signed in as you or with an API key.

</div>

<div class="ns-section-head" markdown>

## How it fits together

[Read the concepts](concepts/index.md){ .ns-more }

</div>

Your **organization** holds **projects**. Each project runs in one **location**, with its own
networks, instances, volumes, public IPs and quota there.

<figure class="ns-diagram">
--8<-- "resources.svg"
<figcaption>The project web-shop runs in Karachi and analytics in Islamabad. Each location is a separate cloud: resources in one never move to, or depend on, the other.</figcaption>
</figure>

<div class="ns-section-head" markdown>

## Common tasks

</div>

<div class="ns-tasks" markdown>

- :material-certificate-outline: [Serve several domains from one HTTPS listener](security/sni.md)
- :material-door-open: [Open a port to your instance](networking/security-groups.md)
- :material-harddisk: [Add a disk that outlives an instance](storage/volumes.md)
- :material-backup-restore: [Restore a volume from a snapshot](storage/snapshots.md)
- :material-account-plus-outline: [Invite a colleague](organization/members.md)
- :material-api: [Make your first API request](api/index.md)

</div>

<div class="ns-help" markdown>

<div markdown>

<p class="ns-eyebrow">Need a hand?</p>

**Something not working?** Start with the common problems, then ask us.

</div>

<div class="ns-help__links" markdown>

[:material-lifebuoy: Troubleshooting](help/troubleshooting.md)
[:material-book-alphabet: Glossary](help/glossary.md)
[:material-face-agent: Support](help/support.md)

</div>

</div>

!!! note "Usage and costs are provisional"

    The usage, statement and cost pages show measured quantities and estimates that are still
    being checked against each location. They are not a bill. See
    [Usage and costs](concepts/usage-and-costs.md).
