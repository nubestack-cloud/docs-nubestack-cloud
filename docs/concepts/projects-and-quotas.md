---
title: Projects and quotas
description: What a project is, its locations, who can use it, and how its quota is set in each location.
---

# Projects and quotas

A **project** groups what you run and who may use it. It runs in one or more locations, and has
its own quota in each. Every instance, network and volume belongs to exactly one project and one
location.

## Locations

A project is in the locations chosen when it was created, and can gain or lose locations later, on
its **Settings** page, tab **Locations**.

![The project's Locations tab: Karachi and Islamabad, each ready](../assets/screens/concepts/project-locations.webp)

- **Add location**: owners and admins only, because it draws on the organization's budget there.
  You can have a network (`192.0.2.0/24`) and an Internet gateway set up there at the same time.
  Nothing is copied from the project's other locations.
- **Remove location**: project admins, owners and admins. It works like
  [deleting the project](/concepts/deletion-and-retention.md#delete-a-project), for that location
  only. A project keeps at least one location: add another first, or delete the project.

## Who can use a project

An organization role alone does not let anyone use a project's instances or networks. People and
service accounts use a project through a **project role**:

| Project role | What it allows |
|---|---|
| Project admin | Everything a project member can, plus giving and taking access, removing a location, deleting the project, sharing SSH keys and cancelling operations |
| Project member | Create, change and delete instances, networks, volumes and the rest |
| Project reader | See everything in the project, change nothing |

To give access:

1. Open the project's **Settings** (bottom of the left panel), tab **Access**.
2. Choose **Grant access**, pick a member of the organization or a service account, and a role.

![The Access tab: four people and a service account with their project roles](../assets/screens/concepts/project-access.webp)

The role applies in every location of the project. To take it away, choose **Revoke access**
beside the person: they lose it in every location within minutes, and what they made stays.

Owners and admins can also give project roles from **Members**, or on an invitation. A
[custom project role](/organization/custom-roles.md) works the same way.

## Quota

**Quota** is how much a project may hold in one location: instances, vCPUs, memory, volumes,
storage, networks, public IPs and the rest. It is set in two layers:

1. **NubeStack sets your organization's budget** in each location: how much the whole
   organization may hand out there. NubeStack may also limit how many projects the organization
   has.
2. **Your organization's owners and admins share that budget between projects**: each project
   gets its own quota in each of its locations. Only owners and admins set project quota.

Each location enforces its own quota. A request over it is refused, even if the console's own check
let it through, for example because something was made at the same moment with the location's own
tools.

Everyone with a role on the project sees its quota and what it uses, under **Quota and usage** at
the bottom of the project's left panel.

![The project's quota per location, with what is in use](../assets/screens/concepts/project-quota.webp)

How owners and admins set quota, choose presets and ask NubeStack for more:
[Quota](/organization/quota.md).

### Quota is not capacity

Quota says how much you may use. Whether a location has room right now is separate: a request
within quota can still be refused when a location is full for that size. The operation says so;
try another size, another time, or the project's other location.

## Project settings

**Settings**, at the bottom of a project's left panel, has four tabs: **General**, **Access**,
**Locations** and **Danger zone** (deleting the project). A project's name and short name cannot
change once it exists.
