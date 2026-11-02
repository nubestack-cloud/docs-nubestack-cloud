---
title: Documentation
home: true
hide:
  - toc
  - footer
---

<section class="guide-hero" markdown>
<div markdown>

<p class="docs-kicker">DOCUMENTATION · CLOUD USER GUIDE</p>

# NubeStack Cloud<br>user guide

<p class="docs-lead">From your first instance to a running application. Learn how to connect services, manage persistent data and give your team the access it needs.</p>

<div class="docs-actions" markdown>

[Launch your first instance :material-arrow-right:](/get-started/first-instance.md){ .docs-primary }
[Find a tutorial](/tutorials/index.md)

</div>

</div>
<div class="guide-hero-visual">
<!-- diagram: project-overview -->
</div>
</section>

<section class="guide-feature" markdown>
<div markdown>

<span class="guide-label">NEW TO THE CLOUD?</span>

## From invitation to SSH

Create your account, choose a project and launch an instance you can reach. The quickstart takes you through each console step and the resources to remove afterward.

[Follow the quickstart →](/get-started/index.md)

</div>
<div class="guide-feature-image" markdown>

![The web-shop project’s instance list in the NubeStack console](assets/screens/compute/instances-list.webp)

</div>
</section>

## Explore your cloud

Choose a service to understand its building blocks, complete a task and find the corresponding API instructions.

<div class="guide-families" markdown>
<div class="guide-family" data-family="compute" markdown>

:material-server-outline:

### [Compute](/compute/index.md)

Instances, reusable images and groups of application replicas.

<p class="guide-family-links" markdown>[Instances](/compute/instances.md) · [Launch templates](/compute/launch-templates.md)</p>

</div>
<div class="guide-family" data-family="networking" markdown>

:material-lan:

### [Networking](/networking/index.md)

Private connectivity, public endpoints and traffic distribution.

<p class="guide-family-links" markdown>[Networks](/networking/networks.md) · [Load balancers](/networking/load-balancers.md)</p>

</div>
<div class="guide-family" data-family="storage" markdown>

:material-database-outline:

### [Storage](/storage/index.md)

Persistent data disks, snapshots and recurring schedules.

<p class="guide-family-links" markdown>[Volumes](/storage/volumes.md) · [Recovery](/tutorials/recover-a-volume.md)</p>

</div>
<div class="guide-family" data-family="security" markdown>

:material-shield-check-outline:

### [Security](/security/index.md)

HTTPS certificates, firewall rules and access controls.

<p class="guide-family-links" markdown>[Certificates](/security/certificates.md) · [Firewall rules](/networking/security-groups.md)</p>

</div>
<div class="guide-family" data-family="organization" markdown>

:material-account-group-outline:

### [Organization](/organization/index.md)

People, projects, automation identities and provisional usage.

<p class="guide-family-links" markdown>[Members](/organization/members.md) · [Projects](/organization/projects.md)</p>

</div>
<div class="guide-family" data-family="api" markdown>

:material-code-braces:

### [API & native tools](/api/overview.md)

Automate through the API or use a location’s OpenStack tools.

<p class="guide-family-links" markdown>[API guide](/api/overview.md) · [OpenStack CLI](/native-access/openstack-cli.md)</p>

</div>
</div>

## Build something useful

<div class="guide-cards" markdown>
<div class="guide-card" markdown>

### [Publish a web application](/tutorials/publish-web-application.md)

Create a server with cloud-init, allow HTTP and verify the public endpoint.

</div>
<div class="guide-card" markdown>

### [Serve an application over HTTPS](/tutorials/https-load-balancer.md)

Add a certificate, healthy backends, a public IP and your domain.

</div>
<div class="guide-card" markdown>

### [Use persistent storage](/tutorials/persistent-storage.md)

Attach a data disk, identify it inside your instance and mount it safely.

</div>
<div class="guide-card" markdown>

### [Scale application replicas](/tutorials/scale-an-application.md)

Create a template, maintain a group and schedule its desired count.

</div>
</div>

## Two locations. Your choice.

NubeStack Cloud is a public cloud with independent locations in Pakistan. Each resource stays in the location you choose; cross-location replication and failover need to be designed into your application.

<div class="guide-locations" markdown>
<div markdown>

:material-map-marker-outline: **Karachi** `pak-khi-1`

</div>
<div markdown>

:material-map-marker-outline: **Islamabad** `pak-isb-1`

</div>
</div>

[Understand locations →](/concepts/locations.md) · [Roles and permissions](/concepts/roles-and-permissions.md) · [Troubleshooting](/help/troubleshooting.md)
