---
title: Documentation
home: true
hide:
  - toc
  - footer
---

<section class="guide-hero" markdown>
<div markdown>

<p class="docs-kicker">YOUR CLOUD, EXPLAINED</p>

# Build with<br>NubeStack Cloud.

<p class="docs-lead">Practical guides for the things you want to build. Launch compute, connect your services and put your data to work — in the console or through the API.</p>

<div class="docs-actions" markdown>

[Create your first instance :material-arrow-right:](get-started/first-instance.md){ .docs-primary }
[Explore tutorials :material-arrow-top-right:](get-started/index.md)

</div>

</div>
<div class="guide-hero-visual">
<!-- diagram: project-overview -->
<p class="guide-visual-caption">A typical application, built from connected cloud resources.</p>
</div>
</section>

<section class="guide-start" markdown>
<div class="guide-section-title" markdown>

## Start here. Build from there.

[All getting started guides :material-arrow-right:](get-started/index.md)

</div>
<div class="guide-steps" markdown>
<div markdown>

<span class="guide-step-number">01</span>

### [Create a project](get-started/create-a-project.md)

Give your application a home. Choose a location and set your resource quota.

</div>
<div markdown>

<span class="guide-step-number">02</span>

### [Launch an instance](get-started/first-instance.md)

Pick an image and size, connect a network, then sign in with SSH.

</div>
<div markdown>

<span class="guide-step-number">03</span>

### [Publish your application](tutorials/publish-web-application.md)

Allow web traffic and bring your service online with a public IP.

</div>
</div>
</section>

## Find your service

Go from understanding a building block to creating, connecting and managing it.

<div class="guide-families" markdown>
<div class="guide-family" data-family="compute" markdown>

:material-server-outline:

### [Compute](compute/index.md)

Instances, reusable images and groups of application replicas.

<p class="guide-family-links" markdown>[Instances](compute/instances.md) · [Launch templates](compute/launch-templates.md)</p>

</div>
<div class="guide-family" data-family="networking" markdown>

:material-lan:

### [Networking](networking/index.md)

Private connectivity, public endpoints and traffic distribution.

<p class="guide-family-links" markdown>[Networks](networking/networks.md) · [Load balancers](networking/load-balancers.md)</p>

</div>
<div class="guide-family" data-family="storage" markdown>

:material-database-outline:

### [Storage](storage/index.md)

Persistent data disks, snapshots and recurring schedules.

<p class="guide-family-links" markdown>[Volumes](storage/volumes.md) · [Recovery](tutorials/persistent-storage.md)</p>

</div>
<div class="guide-family" data-family="security" markdown>

:material-shield-check-outline:

### [Security](security/index.md)

HTTPS certificates, firewall rules and access controls.

<p class="guide-family-links" markdown>[Certificates](security/certificates.md) · [Firewall rules](networking/security-groups.md)</p>

</div>
<div class="guide-family" data-family="organization" markdown>

:material-account-group-outline:

### [Organization](organization/index.md)

People, projects, automation identities and provisional usage.

<p class="guide-family-links" markdown>[Members](organization/members.md) · [Projects](organization/projects.md)</p>

</div>
<div class="guide-family" data-family="api" markdown>

:material-code-braces:

### [API & native tools](api/index.md)

Automate through the API or use a location’s OpenStack tools.

<p class="guide-family-links" markdown>[API guide](api/index.md) · [OpenStack CLI](native-access/openstack-cli.md)</p>

</div>
</div>

<section class="guide-feature" markdown>
<div markdown>

<span class="guide-label">TWO WAYS TO GET THINGS DONE</span>

## Follow along. Your way.

Every resource guide puts **Console** and **API** instructions beside the action. Start visually, switch to a request when you need it, and keep your preferred method across guides.

[Explore instance actions :material-arrow-right:](compute/manage-instances.md)

<p class="guide-method-preview"><span>Console</span><span>API</span></p>

</div>
<div class="guide-feature-image" markdown>

![Instance details in the NubeStack Cloud console](assets/screens/compute/instance-detail.webp)

</div>
</section>

## Turn a goal into a working application

<div class="guide-cards" markdown>
<div class="guide-card" markdown>

<span class="guide-card-kind">COMPUTE + NETWORKING</span>

### [Publish a web application](tutorials/publish-web-application.md)

Create a server with cloud-init, allow HTTP and verify the public endpoint.

</div>
<div class="guide-card" markdown>

<span class="guide-card-kind">NETWORKING + SECURITY</span>

### [Serve an application over HTTPS](tutorials/https-load-balancer.md)

Add a certificate, healthy backends, a public IP and your domain.

</div>
<div class="guide-card" markdown>

<span class="guide-card-kind">COMPUTE + STORAGE</span>

### [Use persistent storage](tutorials/persistent-storage.md)

Attach a data disk, identify it inside your instance and mount it safely.

</div>
<div class="guide-card" markdown>

<span class="guide-card-kind">COMPUTE + AUTOMATION</span>

### [Scale application replicas](tutorials/scale-an-application.md)

Create a template, maintain a group and schedule its desired count.

</div>
</div>

## Built in Pakistan. Located where you choose.

NubeStack Cloud is a public cloud with independent locations in Pakistan. Each resource stays in the location you choose; cross-location replication and failover need to be designed into your application.

<div class="guide-locations" markdown>
<div markdown>

:material-map-marker-outline: **Karachi** `pak-khi-1`

</div>
<div markdown>

:material-map-marker-outline: **Islamabad** `pak-isb-1`

</div>
</div>

[Understand locations →](concepts/locations.md) · [Roles and permissions](concepts/roles-and-permissions.md) · [Troubleshooting](help/troubleshooting.md)
