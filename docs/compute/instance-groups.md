---
title: Instance groups
---

# Instance groups

An instance group keeps a desired number of instances running from a [launch template](/compute/launch-templates.md). Use it for replaceable application replicas. It can replace failed members, add or remove instances, and maintain membership in a load balancer pool.

This is count-based scaling with manual and scheduled changes. CPU-triggered or request-triggered autoscaling is not offered here.

![Instance groups and their desired and current sizes](../assets/screens/compute/instance-groups.webp)

## Create a group

1. Prepare a launch template with a working image, network, access and application setup.
2. Open **Compute → Instance groups → Create instance group**.
3. Choose a name, template and version. Pin a version for predictable new members, or use the latest version at each launch.
4. Set the desired count, minimum and maximum. Set the creation concurrency, shown as surge, to control how many new members may be created at once.
5. Optionally choose a load balancer pool in the same location and the application's backend port.
6. Create the group. Its saved definition appears immediately; the instances are then created through operations.

![Create a group from a launch template](../assets/screens/compute/instance-group-create.webp)

## Size, replacement and editing

Open the group to see members, recent activity, its template and scheduled sizes. Change **Size** to the count you need, within its bounds. Scaling down deletes members, so store persistent application data separately and design instances to be replaceable.

![The group's members, size and schedules](../assets/screens/compute/instance-group-detail.webp)

Use **Edit** to change the name, template version, bounds, surge and optional pool. The location remains fixed. A version change affects future creations and replacements; it does not roll out a rebuild of every existing member.

The group replaces instances it identifies as failed. It does not prove application-level health or repair a broken application configuration. [Load balancer health checks](/networking/load-balancers.md) decide whether a backend receives traffic.

## Pause and scheduled sizes

**Pause** stops the group acting to reach its desired count. It leaves existing instances running. **Resume** allows it to reconcile the count again. Manual deletion of a member while the group is active can cause a replacement.

In **Scheduled sizes**, set counts for particular days and local times. These are [size schedules](/storage/schedules.md). Review the time zone and the next run, and keep scheduled counts inside the group's bounds.

## With the API

<!-- api-example: create_instance_group -->

Edit with `PATCH {P}/instance-groups/{id}` and the current `If-Match`. Pause and resume with `POST .../{id}:pause` and `:resume`. These return the group resource, not a single provisioning operation; inspect its members and linked operations to follow convergence.

## Delete and limits

The delete confirmation offers whether to keep or delete existing instances. Read that choice carefully: keeping them stops group management but leaves resource usage. Pool membership and size schedules also need review during cleanup. The API allows desired counts up to 100, subject to configured bounds, quota and available capacity. This group manages one location; use a separate design for another location.
