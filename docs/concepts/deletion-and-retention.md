---
title: Deletion and retention
description: What happens when you delete a resource, a project or the organization, what blocks a delete, and what you can still recover and for how long.
---

# Deletion and retention

Deleting one resource is final once its operation succeeds. Deleting a whole project, or closing
the organization, has a **recovery window** in which you can change your mind.

## Deleting a resource

Each delete dialog says what goes with the resource and what stays.

| You delete | What goes with it | What stays |
|---|---|---|
| An instance | Its system disk, its addresses, and volumes the location is set to delete with it (the dialog names them) | Other attached volumes, public IPs (still allocated), security groups |
| A volume | Its data | Nothing; delete its snapshots first |
| A snapshot | The copy | Volumes already made from it |
| A load balancer | Its listeners, pools and health checks | The instances behind it; its public IP, detached but still allocated; its certificates |
| A network | Its range and its routing attachment | Other networks, private routing |
| An instance group | Nothing, by default | Its instances, unless you choose to delete them too |
| A schedule | Nothing | The snapshots it made, no longer pruned |
| A launch template | Its versions and its user data | Instances launched from it |
| A certificate | The certificate and its key in the key manager | Nothing |

## What blocks a delete

Some deletes are refused until something else is gone. The refusal names what is in the way.

| Resource | Refused while | Code |
|---|---|---|
| Instance | It is locked, or a change to it is running | — |
| Volume | It is attached, or has snapshots | `volume_in_use`, `volume_has_snapshots` |
| Snapshot | A volume is being made from it | `snapshot_restore_pending` |
| Image | It is protected in the location | `image_protected` |
| Network | Instances, load balancers or others have addresses on it | `resource_in_use` |
| Network (detach routing) | A public IP or a route uses it | `public_ips_in_use`, `route_uses_network` |
| Security group | An instance or load balancer uses it; or it is `default` | `security_group_in_use`, `default_security_group` |
| Server group | It has instances | `server_group_in_use` |
| Internet gateway | A public IP in that location is attached | `public_ips_in_use` |
| Load balancer pool | A listener uses it, or it has members or a health check | `lb_child_in_use` |
| Certificate | A listener serves it, as default or by host name | `certificate_in_use` |
| Launch template | A launch is creating its instances, or an instance group uses it | `launch_template_in_use` |
| Custom role | Someone holds it | `role_in_use` |

Nothing blocks deleting an SSH key, a public IP, a schedule, an instance group or a whole load
balancer.

## Delete a project

Project admins, owners and admins delete a project from its **Settings → Danger zone**, or from
the organization's **Settings → Projects**. Choose
**Delete only if empty**, or **Delete everything in it**: instances, load balancers, public IPs,
routers, networks and security groups go within minutes, while volumes, snapshots and images are
kept for the recovery window. Step by step: [Projects](../organization/projects.md#delete-a-project).

| When | What happens |
|---|---|
| At once | The project is suspended: nothing new can be made in it |
| During the recovery window (7 days unless agreed otherwise) | **Cancel deletion**, then **Resume project**, brings it back. After **Delete everything**, only volumes, snapshots and images come back |
| **Delete now**, or the window ends | Everything left is deleted; this cannot be cancelled once started |
| Afterwards | Activity and usage records are kept |

<figure class="ns-diagram">
--8<-- "deletion-timeline.svg"
<figcaption>Deleting a project and closing the organization: what happens at once, during the recovery window, when it ends and afterwards. Each window is as shown unless agreed otherwise.</figcaption>
</figure>

The project's schedules pause when its deletion is requested; its launch templates, schedules,
instance groups and certificates go with it. Stacks and clusters made with a location's own tools
must be deleted with those tools; the page names anything that stops the deletion, and the
deletion carries on once it is gone.

## Clean up a project safely

Before you delete a project, or to stop paying for what you no longer use:

1. Copy any data you need off its volumes, and save images you want to keep elsewhere.
2. Delete instance groups (with their instances) and schedules, so nothing creates new resources.
3. Delete load balancers, then instances.
4. Release public IPs: they stay allocated, and counted, after their instance is gone.
5. Delete snapshots, then volumes, then images you no longer need.
6. Delete the Internet gateway if nothing needs the Internet, then networks you made.
7. Check **Usage** the next day: anything still counting is still there.

## Close the organization

Owners only, from **Settings → Danger zone → Close organization**. Every instance stops at once;
everything is kept for the recovery window (30 days unless agreed otherwise), when **Cancel
closure** brings it back. When the window ends, every project is deleted and every member removed.
While it is closing, an owner can download a copy of its records. See
[Settings](../organization/settings.md#close-the-organization).

## People leaving

- **Removing someone** from the organization ends their access at once, deletes their personal
  SSH keys and service accounts, and signs them out of every location within 15 minutes. What
  they made stays.
- **Deleting a service account** stops its API keys at once, ends its project access and deletes
  its cloud credentials in every location.

## Related

- [Projects](../organization/projects.md) · [Settings](../organization/settings.md) · [Usage](../organization/usage.md)
