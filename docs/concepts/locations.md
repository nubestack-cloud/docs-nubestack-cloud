---
title: Locations
description: Karachi and Islamabad are independent clouds. What that means for your projects, instances, networks, storage and quota.
---

# Locations

A **location** is one of NubeStack's clouds. NubeStack Cloud has two:

| Location | Code | Shown in the console as |
|---|---|---|
| Karachi | `pak-khi-1` | Karachi |
| Islamabad | `pak-isb-1` | Islamabad |

The code is what you see in the API, in the location's own tools and in `clouds.yaml`. The API
identifies a location by an ID starting `loc_`, from `GET /v1/orgs/{org_id}/locations`.

## A project runs in one location

You choose a project's location when you create it, and it never changes. Everything in the
project, its instances, networks, volumes, public IPs and quota, is in that location. The scope
selector at the top of the console lists your projects under their locations.

To run in both locations, for example to keep a copy of a service in Islamabad, create a second
project there and give the same people access to both. Usage, costs and the audit log cover the
whole organization either way.

## Each location is independent

Each location is a separate OpenStack cloud, with its own capacity, networks, storage, images and
sign-in. Design for that:

- **Things stay where you make them.** Nothing is copied or moved between locations.
- **Networks do not cross locations.** A network in Karachi cannot reach a network in Islamabad
  privately. Instances in two locations talk over the Internet, through public IPs.
- **Images and snapshots stay too.** To run the same setup in the other location, set up an
  instance in a project there and save it as an image again.
- **Trouble stays local.** One location in maintenance, full or unreachable never stops the
  other. One location's problem never empties a page.

<figure class="ns-diagram">
--8<-- "resources.svg"
<figcaption>Two projects, two locations: web-shop in Karachi and analytics in Islamabad, each with its own networks, instances, volumes and quota. Nothing is shared between them.</figcaption>
</figure>

To survive a location's failure, run a copy of your service in a project in the other location,
with its own data, and send traffic to both. NubeStack Cloud does not fail over for you.

## What a location offers

Each location has its own **catalog**: the sizes of instances, the operating-system images, the
volume types and, where offered, the load-balancer types. Create pages show what the project's
location offers. The two locations can differ: a load balancer type, for example, may be offered
in one location and not the other.

Through the API: `GET /v1/orgs/{org_id}/catalog?location=loc_…`.

## Maintenance

NubeStack sometimes takes a location into maintenance. While it lasts, what you have keeps running
and you can still read it, but new work there may wait or be refused with
`location_maintenance`, which you can retry later. A strip at the top of the console says so.
Owners and admins receive e-mail notices when maintenance starts, is extended and ends, unless
they turn them off ([E-mail notices](../organization/notifications.md)).

A location can also stop taking **new** projects while it keeps running what is there. Its
**New project here** row then leaves the scope selector.
