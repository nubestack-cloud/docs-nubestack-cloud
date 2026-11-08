---
title: Services
description: Every NubeStack Cloud service, grouped as in the console's menu.
---

# Services

Services are grouped as in the console's menu. Each page follows the same pattern: what it is,
what you need first, the tasks in **Console** and **API** tabs, how it connects to other services,
what blocks a delete, and its limits.

## Compute

| Service | What it is for |
|---|---|
| [Instances](../compute/instances.md) | Virtual machines in your project's location |
| [Manage an instance](../compute/manage-instances.md) | Stop, start, resize, rebuild, rescue, lock |
| [Connect to an instance](../compute/connect-to-instances.md) | SSH, the browser console, console log, networks and firewall |
| [SSH keys](../compute/ssh-keys.md) | Public keys copied into new instances |
| [Images](../compute/images.md) | Operating systems, saved instances and imported image files |
| [Server groups](../compute/server-groups.md) | Instances on different hosts, or together |
| [Launch templates](../compute/launch-templates.md) | Saved settings, one to ten instances at a time |
| [Instance groups](../compute/instance-groups.md) | A number of instances kept running |

## Networking

| Service | What it is for |
|---|---|
| [Networks](../networking/networks.md) | Private address ranges for instances |
| [Routing](../networking/routing.md) | The project's private router, routes and forwarding |
| [Internet gateways](../networking/internet-gateways.md) | Outbound Internet access |
| [Security groups](../networking/security-groups.md) | Firewall rules |
| [Public IPs](../networking/public-ips.md) | Reaching an instance or load balancer from the Internet |
| [Load balancers](../networking/load-balancers.md) | One address for several instances, with health checks |
| [Network topology](../networking/network-topology.md) | A drawing of how it all connects |

## Storage

| Service | What it is for |
|---|---|
| [Volumes](../storage/volumes.md) | Disks that outlive instances |
| [Snapshots](../storage/snapshots.md) | Point-in-time copies of a volume |
| [Schedules](../storage/schedules.md) | Backups, power and group sizes on a timetable |

## Security

| Service | What it is for |
|---|---|
| [Certificates](../security/certificates.md) | TLS certificates for HTTPS listeners |
| [Several certificates on one listener](../security/sni.md) | A certificate per domain on one address (SNI) |
| [Second factor](../security/second-factor.md) | Signing in safely, and requiring it for everyone |

## IAM

| Service | What it is for |
|---|---|
| [People and invitations](../organization/members.md) | Who is in the organization, with which roles |
| [Custom roles](../organization/custom-roles.md) | Your own roles |
| [Service accounts and API keys](../organization/service-accounts.md) | Identities for automation |

## Billing

| Service | What it is for |
|---|---|
| [Usage](../organization/usage.md) | What has been measured (provisional) |
| [Statements and cost explorer](../organization/statements-and-costs.md) | What it cost, where, and the prices (provisional) |

## Organization

| Service | What it is for |
|---|---|
| [Projects](../organization/projects.md) | Access to a project, and deleting one |
| [Audit log and activity](../organization/activity.md) | Who did what, and when |
| [Quota](../organization/quota.md) | Sharing the budget between projects |
| [Settings](../organization/settings.md) | Sign-in rules, audit log and closing |
| [E-mail notices](../organization/notifications.md) | Which e-mails you get |
