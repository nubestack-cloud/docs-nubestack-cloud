---
title: Projects and quotas
description: What a project is, how it spans locations, who can use it, and how its quota is set in each location.
---

# Projects and quotas

A **project** groups what you run and who may use it. It runs in one or more
[locations](locations.md), with its own quota in each. Every instance, network and volume belongs
to exactly one project and one location.

## A project in several locations

A project is in the locations chosen when it was created, and can gain or lose locations later.
In each location it is a separate set of resources: its own networks, instances, volumes, public
IPs, security groups and quota. Nothing is copied or shared between them.

- One location is usual. Add the second only when you need to run there.
- Adding a location draws on the organization's budget there, so only owners and admins do it.
  The project's network (`default`, `10.0.0.0/24`) and an Internet gateway can be set up at the
  same time.
- Removing a location works like deleting the project, for that location only. A project keeps at
  least one location.

How: [Projects](../organization/projects.md#add-or-remove-a-location).

## Who can use a project

An organization role alone does not let anyone use a project's resources. People and service
accounts use a project through a **project role** (project admin, project member or project
reader, or a [custom role](../organization/custom-roles.md)), which applies in every location of
the project. See [Roles and permissions](roles-and-permissions.md).

## Quota

**Quota** is how much a project may hold in one location: instances, vCPUs, memory, volumes,
storage, networks, public IPs and the rest. It is set in two layers:

1. **NubeStack sets the organization's budget** in each location.
2. **Owners and admins share that budget between projects**, per location. A new project starts
   from a **quota preset**.

Each location enforces its own quota. A request over it is refused, even if the console's check
let it through, for example because something was made at the same moment with the location's own
tools.

![A project's quota in each location, with what is in use](../assets/screens/concepts/project-quota.webp)

Everyone with a role on the project sees its quota under **Quota and usage**. How owners and
admins set it: [Quota](../organization/quota.md).

## Quota is not capacity

Quota says how much you may use. Whether a location has room right now is separate: a request
within quota can still fail when a location has no room for that size. The operation says so;
try another size, later, or the project's other location.

## Names

A project has a name (up to 200 characters) and a short name (lower-case letters, digits and
dashes) used in addresses and in each location's own tools. Neither can change after creation.

## Related

- [Create a project](../get-started/create-a-project.md) · [Projects](../organization/projects.md) · [Quota](../organization/quota.md)
