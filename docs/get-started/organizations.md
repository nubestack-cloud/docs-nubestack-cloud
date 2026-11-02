---
title: Organizations
description: How organizations, projects, members and roles fit together in NubeStack Cloud.
---

# Organizations

Everything in NubeStack Cloud belongs to an **organization**: your company, team or institution.
An organization has **members** (people), **service accounts** (for automation) and
**projects**, which hold the resources.

``` { .text .no-copy }
Acme                               organization
├── Members                        Ayesha (owner), Bilal (admin), Sara (member), Hina (billing)
├── Service accounts               automation-prod
└── Projects
    ├── web-shop                   in Karachi and Islamabad
    │   └── instances, networks, volumes, load balancers, certificates …
    └── analytics                  in Islamabad
```

## Two kinds of role

**Organization roles** decide what someone may do across the organization: invite people,
create projects, see usage, change settings.

| Role | In short |
|---|---|
| Owner | Everything, including security settings, closing the organization and acting on other owners |
| Admin | Members (except owners), projects, quota, settings and service accounts |
| Billing | Sees members, projects, locations and usage, and the cost pages |
| Member | Sees members and locations; works only in projects they have a role on |
| Viewer | Sees everything in the organization's projects, read only |

**Project roles** decide what someone may do inside one project.

| Role | In short |
|---|---|
| Project admin | Uses the project, gives and takes access to it, removes its locations, deletes it |
| Project member | Creates, changes and deletes the project's resources |
| Project reader | Sees the project's resources, changes nothing |

An organization role never gives a project role. An owner manages access to every project, but
creates instances in one only with a project role on it. Whoever creates a project becomes its
project admin.

When the built-in roles do not fit, owners and admins can make
[custom roles](../organization/custom-roles.md). The full table of who may do what is in
[Roles and permissions](../concepts/roles-and-permissions.md).

## Several organizations

One account can belong to several organizations. Each is separate: its own projects, members,
quota and usage. Switch with the **Organization** list at the top of the console.

## Next

- [Create a project](create-a-project.md).
- [Invite your colleagues](../organization/members.md).
