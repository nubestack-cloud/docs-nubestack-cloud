---
title: Organizations
description: How organizations, projects, people and roles fit together in NubeStack Cloud.
---

# Organizations

Everything in NubeStack Cloud belongs to an **organization**: your company, team or institution.
An organization has **people**, **service accounts** for automation, and **projects**, which hold
the resources. Each project runs in one location.

<figure class="ns-diagram">
--8<-- "organization.svg"
<figcaption>The organization Acme: four people with their organization roles, a service account for automation, and two projects, web-shop in Karachi and analytics in Islamabad.</figcaption>
</figure>

## Two kinds of role

**Organization roles** decide what someone may do across the organization: invite people,
create projects, see usage, change settings.

| Role | In short |
|---|---|
| Owner | Everything, including security settings, closing the organization and acting on other owners |
| Admin | People (except owners), projects, quota, settings and service accounts |
| Billing | Usage, cost explorer, statements and prices; sees the people and the roles |
| Member | Works only in the projects they have a role on |
| Viewer | Sees every project's resources, read-only |

**Project roles** decide what someone may do inside one project.

| Role | In short |
|---|---|
| Project admin | Uses the project, gives and takes access to it, deletes it |
| Project member | Creates, changes and deletes the project's resources |
| Project reader | Sees the project's resources, changes nothing |

An organization role never gives a project role. An owner manages access to every project, but
creates instances in one only with a project role on it. Whoever creates a project becomes its
project admin.

Owners, admins and the billing role also see the **Organization** scope in the console; members
and viewers work in their projects only. See [The console](console.md#the-menu).

When the built-in roles do not fit, owners and admins can make
[custom roles](../organization/custom-roles.md). The full table of who may do what is in
[Roles and permissions](../concepts/roles-and-permissions.md).

## Several organizations

One account can belong to several organizations. Each is separate: its own projects, people,
quota and usage. Switch with the organization selector at the top left of the console; it is
there only when you belong to more than one.

## Next

- [Create a project](create-a-project.md).
- [Invite your colleagues](../organization/members.md).
