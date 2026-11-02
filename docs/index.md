---
title: Documentation
home: true
hide:
  - toc
  - footer
---

<p class="docs-kicker">NUBESTACK CLOUD DOCUMENTATION</p>

# Build on NubeStack Cloud

<p class="docs-lead">Guides and API reference for running your applications with compute, networking and storage in Karachi and Islamabad.</p>

<div class="docs-actions" markdown>

[Deploy your first instance :material-arrow-right:](/get-started/first-instance.md){ .docs-primary }
[Browse the API reference →](/api/reference/index.md)

</div>

## Get started

<div class="docs-start" markdown>
<div markdown>

<span class="docs-step">01</span>

### [Set up your account](/get-started/account.md)

Accept your invitation and sign in to your organization.

</div>
<div markdown>

<span class="docs-step">02</span>

### [Create a project](/get-started/create-a-project.md)

Choose a location, assign access and check your quota.

</div>
<div markdown>

<span class="docs-step">03</span>

### [Launch an instance](/get-started/first-instance.md)

Create a network, add an SSH key and connect to your server.

</div>
</div>

## Explore the services

<div class="docs-service-grid" markdown>
<div class="docs-service" markdown>

:material-server-outline:

<div markdown>

### [Compute](/compute/instances.md)

Create and manage virtual machines for your applications.

<p class="docs-links" markdown>[Instances](/compute/instances.md) · [Images](/compute/images.md) · [Instance groups](/compute/instance-groups.md)</p>

</div>
</div>
<div class="docs-service" markdown>

:material-lan:

<div markdown>

### [Networking](/networking/networks.md)

Connect services privately and control Internet access.

<p class="docs-links" markdown>[Networks](/networking/networks.md) · [Public IPs](/networking/public-ips.md) · [Load balancers](/networking/load-balancers.md)</p>

</div>
</div>
<div class="docs-service" markdown>

:material-database-outline:

<div markdown>

### [Storage](/storage/volumes.md)

Add persistent disks and protect data with recovery points.

<p class="docs-links" markdown>[Volumes](/storage/volumes.md) · [Snapshots](/storage/snapshots.md) · [Schedules](/storage/schedules.md)</p>

</div>
</div>
<div class="docs-service" markdown>

:material-shield-check-outline:

<div markdown>

### [Security](/security/certificates.md)

Secure application traffic and manage who can access it.

<p class="docs-links" markdown>[Certificates](/security/certificates.md) · [Security groups](/networking/security-groups.md) · [Roles](/concepts/roles-and-permissions.md)</p>

</div>
</div>
<div class="docs-service" markdown>

:material-account-group-outline:

<div markdown>

### [Organization](/organization/members.md)

Manage your team, project access, quotas and usage.

<p class="docs-links" markdown>[Members](/organization/members.md) · [Service accounts](/organization/service-accounts.md) · [Usage](/organization/usage.md)</p>

</div>
</div>
<div class="docs-service" markdown>

:material-code-braces:

<div markdown>

### [API and native access](/api/overview.md)

Automate your work or use familiar OpenStack tools.

<p class="docs-links" markdown>[API guide](/api/overview.md) · [Horizon](/native-access/horizon.md) · [OpenStack CLI](/native-access/openstack-cli.md)</p>

</div>
</div>
</div>

## Common tasks

<div class="docs-tasks" markdown>

[Connect to an instance over SSH](/get-started/first-instance.md#4-log-in)
[Back up a volume on a schedule](/storage/schedules.md)
[Expose an application over HTTPS](/networking/load-balancers.md#https-and-certificate-rotation)
[Create an API key for automation](/organization/service-accounts.md#issue-an-api-key)
[Understand a failed operation](/concepts/operations.md)
[Resolve a blocked resource deletion](/help/troubleshooting.md#a-delete-is-blocked)

</div>

<aside class="docs-location-note" markdown>

**Two locations in Pakistan.** Karachi (`pak-khi-1`) and Islamabad (`pak-isb-1`) are independent clouds. Resources stay in the location you choose. [About locations →](/concepts/locations.md)

</aside>
