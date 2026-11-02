---
title: Locations
description: Karachi and Islamabad are independent clouds. What that means for your instances, networks, storage and quota.
---

# Locations

A **location** is one of NubeStack's clouds. NubeStack Cloud has two:

| Location | Code | Shown in the console as |
|---|---|---|
| Karachi | `pak-khi-1` | Karachi |
| Islamabad | `pak-isb-1` | Islamabad |

The code is what you see in the API, in tags of the location's own tools and in `clouds.yaml`.
The API identifies a location by an ID starting `loc_`, from `GET /v1/orgs/{org_id}/locations`.

## Each location is independent

Each location is a separate OpenStack cloud, with its own capacity, networks, storage, images and
sign-in. That has consequences you should design for:

- **Things stay where you make them.** An instance, its disks, its network and its addresses stay
  in the location you create them in. Nothing is copied or moved between locations.
- **Networks do not cross locations.** A network in Karachi cannot reach a network in Islamabad
  privately. Instances in two locations talk over the Internet, through public IPs.
- **Images and snapshots stay too.** To run the same setup in the other location, set up an
  instance there and save it as an image again.
- **Trouble stays local.** One location in maintenance, full or unreachable never stops the
  other. Lists show each location's data with its own freshness; one location's problem never
  empties a page.
- **Quota is per location.** A project's quota in Karachi is separate from its quota in
  Islamabad.

To be in both locations, a project is [placed in both](/concepts/projects-and-quotas.md#locations).
To survive a location's failure, run copies of your service in each, with their own data, and
send traffic to both: NubeStack Cloud does not fail over for you.

## What a location offers

Each location has its own **catalog**: the sizes of instances, the operating-system images, the
volume types and, where offered, the load-balancer types. The create pages show only what the
chosen location offers. The two locations can differ: a load balancer type, for example, may be
offered in one location and not the other.

Through the API: `GET /v1/orgs/{org_id}/catalog?location=loc_…`.

## Maintenance

NubeStack sometimes takes a location into maintenance. While it lasts, what you have keeps running
and you can still read it, but new work in that location may wait or be refused with
`location_maintenance`, which you can retry later. Owners and admins receive e-mail notices when
maintenance starts, is extended and ends, unless they turn them off
([e-mail notices](/organization/settings.md#e-mail-notices)).

A location can also stop taking **new** projects while it keeps running what is there; adding it
to a project is then refused.
