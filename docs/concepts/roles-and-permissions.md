---
title: Roles and permissions
description: The built-in organization and project roles, what each may do, and how custom roles fit in.
---

# Roles and permissions

What someone may do in NubeStack Cloud comes from their roles. Everyone has an
**organization role**; to use a project's resources they also need a **project role** on that
project. A person may do something if any of their roles allows it.

<figure class="docs-diagram">
<div>
<!-- diagram: access-model -->
</div>
<figcaption>Organization administration and project workload access are separate.</figcaption>
</figure>

## Built-in roles

| Organization role | In short |
|---|---|
| Owner | Everything, including the security settings, closing the organization and acting on other owners |
| Admin | Members (except owners), projects, quota, settings and service accounts |
| Billing | Sees the members, projects, locations, usage, statements and costs |
| Member | Sees the members and locations; uses only the projects they are given a role on |
| Viewer | Sees everything in the organization's projects, read only |

| Project role | In short |
|---|---|
| Project admin | Uses the project, gives and takes access to it, removes its locations, deletes it |
| Project member | Creates, changes and deletes the project's resources |
| Project reader | Sees the project's resources, changes nothing |

An organization role never gives a project role. Owners and admins manage access to every project
and see every project, but create, change or delete resources in one only through a project role.
Creating a project makes its creator the project admin.

## What each role may do

`✓` means yes; `—` means no. "If allowed" means an owner or admin can switch it on in the
[organization's settings](../organization/settings.md). The action name in the first column is what
a [custom role](../organization/custom-roles.md) holds.

| Action | What it allows | Owner | Admin | Billing | Member | Viewer | Project admin | Project member | Project reader |
|---|---|---|---|---|---|---|---|---|---|
| `org.read` | See the organization | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |
| `org.settings.manage` | Change the organization's settings | ✓ | ✓ | — | — | — | — | — | — |
| `org.security.manage` | Change its security settings (second factor, invitation domains) | ✓ | — | — | — | — | — | — | — |
| `org.close` | Close the organization | ✓ | — | — | — | — | — | — | — |
| `org.ownership.transfer` | Make another member an owner | ✓ | — | — | — | — | — | — | — |
| `org.members.read` | See the members | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |
| `org.members.manage` | Invite, change roles, suspend and remove members | ✓ | ✓ not owners | — | — | — | — | — | — |
| `audit.read` | Read the organization's audit log | ✓ | ✓ | — | — | if allowed | — | — | — |
| `location.read` | See the locations | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |
| `project.create` | Create a project | ✓ | ✓ | — | if allowed | — | — | — | — |
| `project.read` | See a project | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| `project.delete` | Delete a project | ✓ | ✓ | — | — | — | ✓ | — | — |
| `placement.create` | Add a location to a project | ✓ | ✓ | — | — | — | — | — | — |
| `placement.delete` | Remove a location from a project | ✓ | ✓ | — | — | — | ✓ | — | — |
| `grant.read` | See who has access to a project | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ |
| `grant.manage` | Give and take project access | ✓ | ✓ | — | — | — | ✓ | — | — |
| `operations.read` | See operations (anyone sees their own) | ✓ | ✓ | — | — | — | ✓ | ✓ | ✓ |
| `operations.cancel` | Cancel an operation (anyone may cancel their own) | — | — | — | — | — | ✓ | — | — |
| `workload.read` | See instances, volumes, networks and other resources | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ |
| `inventory.read` | Refresh and read the resource lists | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ |
| `workload.create` | Create instances, volumes, networks and other resources | — | — | — | — | — | ✓ | ✓ | — |
| `workload.update` | Change them | — | — | — | — | — | ✓ | ✓ | — |
| `workload.delete` | Delete them | — | — | — | — | — | ✓ | ✓ | — |
| `console.open` | Open an instance's console | — | — | — | — | — | ✓ | ✓ | — |
| `console.output.read` | Read an instance's console log | — | — | — | — | — | ✓ | ✓ | — |
| `schedule.manage` | Make, change, pause and delete schedules | — | — | — | — | — | ✓ | ✓ | — |
| `group.manage` | Make, resize, pause, resume and delete instance groups | — | — | — | — | — | ✓ | ✓ | — |
| `ssh_key.read` | See SSH keys (anyone sees their own personal keys) | ✓ | ✓ | — | — | — | ✓ | ✓ | — |
| `ssh_key.add_own` | Add a personal SSH key | ✓ | ✓ | — | ✓ | ✓ | — | — | — |
| `ssh_key.manage` | Share and remove SSH keys in a project | ✓ | ✓ | — | — | — | ✓ | — | — |
| `quota.read` | See budgets and what is allocated | ✓ | ✓ | — | — | — | — | — | — |
| `quota.allocate` | Set each project's quota out of the budget | ✓ | ✓ | — | — | — | — | — | — |
| `quota.request` | Ask NubeStack for a larger budget | ✓ | ✓ | — | — | — | — | — | — |
| `quota.presets.manage` | Choose and make the quota presets new projects start with | ✓ | ✓ | — | — | — | — | — | — |
| `usage.read` | See usage | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| `statement.read` | See the monthly statements and the rate card in force | ✓ | ✓ | ✓ | — | — | — | — | — |
| `notifications.own` | Choose which e-mail notices they receive | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |
| `org.service_accounts.read` | See service accounts, their keys and cloud credentials | ✓ | ✓ | — | — | — | — | — | — |
| `org.service_accounts.manage` | Create and delete service accounts, get their cloud credentials | ✓ | ✓ | — | — | — | — | — | — |
| `org.api_keys.manage` | Issue, rotate and revoke API keys | ✓ | ✓ | — | — | — | — | — | — |
| `roles.read` | See the roles and what each may do | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `roles.manage` | Make, change and delete custom roles | ✓ | ✓ | — | — | — | ✓ | — | — |

A project admin makes custom roles for their own project only.

## Service accounts

A [service account](../organization/service-accounts.md) holds the **member** or **viewer**
organization role and the **project member** or **project reader** role on projects, or a custom
role within those bounds. Whatever its roles say, it never manages people, project access, roles,
API keys, settings or service accounts, and never creates or deletes projects or locations.

## Custom roles

When the built-in roles do not fit, owners and admins make their own: a name and a set of the
actions above. You can only put an action you hold into a role, and only give a role whose actions
you hold. See [Custom roles](../organization/custom-roles.md).

## In each location's own tools

Project roles also give access in each location's Horizon dashboard and OpenStack CLI. A role that
creates, changes or deletes resources gets the location's `member` role there; a role that only
reads gets `reader` where the location enforces read-only, otherwise no access there. The console
and the API always check the exact actions; the location's own tools are coarser.

## When access ends

Suspending or removing someone, or taking a project role away, takes effect in the console and the
API at once. Each location's own dashboard and CLI follow within 15 minutes: a session already
open there keeps working until then.
