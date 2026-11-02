---
title: NubeStack Cloud documentation
description: Guides and reference for NubeStack Cloud in Karachi and Islamabad. Launch instances, connect networks, keep data on volumes and serve HTTPS, from the console or the API.
hide:
  - toc
  - path
---

<div class="ns-hero" markdown>

<p class="ns-eyebrow">NubeStack Cloud documentation</p>

# Run your applications in Pakistan's own cloud

Launch instances, connect private networks, keep data on volumes and serve HTTPS from load
balancers. Work in the console or automate the same steps with the API.

[Get started](get-started/index.md){ .md-button .md-button--primary }
[Browse services](services/index.md){ .md-button }
[API reference](api/reference/index.md){ .md-button }

<div class="ns-locations" markdown>
<span>:material-map-marker-outline: Karachi `pak-khi-1`</span> <span>:material-map-marker-outline: Islamabad `pak-isb-1`</span>
</div>

</div>

## Start here

<div class="grid cards" markdown>

-   :material-account-key-outline:{ .lg .middle } **[Sign up and sign in](get-started/account.md)**

    ---

    Accept your invitation, set up your second factor and open your organization.

-   :material-folder-plus-outline:{ .lg .middle } **[Create a project](get-started/create-a-project.md)**

    ---

    Choose a location, a quota preset and the project's first network.

-   :material-server-plus:{ .lg .middle } **[Launch your first instance](get-started/first-instance.md)**

    ---

    Add an SSH key, start an instance with a public IP and log in, in about ten minutes.

</div>

## Services

<div class="grid cards" markdown>

-   :material-server-outline:{ .lg .middle } **[Compute](compute/index.md)**

    ---

    Instances, SSH keys, images, server groups, launch templates and instance groups.

-   :material-lan:{ .lg .middle } **[Networking](networking/index.md)**

    ---

    Private networks, routing, Internet gateways, security groups, public IPs and load balancers.

-   :material-database-outline:{ .lg .middle } **[Storage](storage/index.md)**

    ---

    Volumes that outlive instances, snapshots, and schedules that take them for you.

-   :material-shield-lock-outline:{ .lg .middle } **[Security](security/index.md)**

    ---

    TLS certificates for HTTPS listeners, several per listener by host name, and your second factor.

-   :material-account-group-outline:{ .lg .middle } **[Organization](organization/index.md)**

    ---

    Members, roles, service accounts, quota, the audit log, usage and statements.

-   :material-console:{ .lg .middle } **[Native OpenStack access](native-access/index.md)**

    ---

    Each location's Horizon dashboard and the OpenStack CLI, with your NubeStack sign-in.

</div>

## How it fits together

Your **organization** holds **projects**. A project runs in one or more **locations**, and in each
one it has its own networks, instances, volumes, public IPs and quota.

<figure class="ns-diagram">
--8<-- "resources.svg"
<figcaption>The project web-shop in Karachi and Islamabad. Each location is a separate cloud: resources in one never move to, or depend on, the other.</figcaption>
</figure>

[Read the concepts](concepts/index.md){ .md-button }

## Common tasks

<div class="grid cards" markdown>

-   :material-certificate-outline: [Serve several domains from one HTTPS listener](security/sni.md)
-   :material-door-open: [Open a port to your instance](networking/security-groups.md)
-   :material-harddisk: [Add a disk that outlives an instance](storage/volumes.md)
-   :material-backup-restore: [Restore a volume from a snapshot](storage/snapshots.md)
-   :material-account-plus-outline: [Invite a colleague](organization/members.md)
-   :material-api: [Make your first API request](api/index.md)

</div>

!!! note "Usage and costs are provisional"

    The usage, statement and cost pages show measured quantities and estimates that are still
    being checked against each location. They are not a bill. See
    [Usage and costs](concepts/usage-and-costs.md).
