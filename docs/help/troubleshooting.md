---
title: Troubleshooting
description: Fixes for the problems customers meet most - cannot connect, a create refused or failed, a delete blocked, sign-in, lists and costs.
---

# Troubleshooting

Start from the exact message: the refusal's code, or the failed step of the operation. Sending the
same request again unchanged rarely fixes a permission, dependency or quota problem.

## Cannot connect to an instance

??? question "SSH times out or is refused"

    Check, in this order:

    1. The instance is **Active**, and its **Console log** shows it finished starting.
    2. You use the image's user (`ubuntu` on Ubuntu) and the private key matching the instance's SSH key.
    3. It has a public IP, attached to the network you expect.
    4. The network is routed and the location has an Internet gateway.
    5. A security group allows TCP 22 from your current address.
    6. The firewall inside the instance allows it.

    Still stuck? Open the [browser console](../compute/connect-to-instances.md#open-the-browser-console)
    to look from inside.

??? question "My web service does not answer on its public IP"

    The security group must allow the port (80, 443 or your own), and the service must listen on the
    instance's private address or on all addresses, not only on `127.0.0.1`. Right after creation,
    cloud-init may still be installing: run `cloud-init status --wait` inside.

??? question "An instance behind a load balancer gets no traffic"

    On the load balancer's **Listeners** tab, check the member's recorded health. An instance that
    fails its health check gets no traffic. Allow the pool's port from the network's range in the
    instance's security group, and check the health check's path answers `200`.

## A create or change is refused

| Message or code | What to do |
|---|---|
| `quota_exceeded` | The project's quota in that location is used up. Free something, or ask an owner or admin to [raise it](../organization/quota.md) |
| No room for that size | The location is full for that size right now. Try another size, later, or the project's other location |
| `403` / you lack the right | Your role does not allow it. Ask a project admin for a project role |
| A change is still running | Wait for the resource's current operation to finish |
| Not in this location | Images, networks, volumes, keys and certificates must be in the same location |
| `location_maintenance` | The location is in maintenance; retry later |
| `412` / the version changed | Someone changed it after you loaded it. Reload, check, and apply your change again |

An accepted change can still fail in the location. Open its operation, read the failed step, fix
the cause, then make the change again. See [Operations](../concepts/operations.md).

## A delete is refused

The refusal names what is in the way. The common ones:

| Code | Do this first |
|---|---|
| `volume_in_use` | Unmount it inside the instance, then **Detach** |
| `volume_has_snapshots` | Delete its snapshots, or the schedule that makes them |
| `resource_in_use` | Delete or detach the instances and load balancers it names |
| `public_ips_in_use` | Detach the public IPs it names |
| `security_group_in_use` | Take the group off the instances and load balancers it names |
| `certificate_in_use` | **Change certificates** on the listeners it names |
| `server_group_in_use` | Delete the group's instances |
| `launch_template_in_use` | Delete the instance group that uses it, or wait for a launch |
| `role_in_use` | Give its holders another role |

The full table is in [Deletion and retention](../concepts/deletion-and-retention.md#what-blocks-a-delete).
Deleting an instance does not release its public IP or delete its data volumes: release and delete
them yourself.

## Sign-in and invitations

??? question "The invitation says Invitation not valid"

    It was used, replaced or expired after seven days. Ask for a **New link**. If you are signed in
    with another address, sign out and sign in with the invited one.

??? question "I lost my phone or my password"

    There is no self-service reset yet. [Contact support](support.md) for a one-time reset link.

??? question "Horizon or the CLI opens the wrong organization"

    You sign in for one organization at a time. Sign out, wait three minutes, and sign in choosing
    the right one, or use a private browser window.

## A list looks wrong

Check **Last read** and any stale or partial notice, and the location and tag filters. Choose
**Refresh**: something made with a location's own tools appears after the next read. One location's
trouble never empties the whole page, so a missing row is rarely a deleted resource.

## Costs look incomplete

Usage and costs are provisional. Check the time of the last report under **Usage freshness**, and
the **Not rated** lines: usage without a rate is never counted as free. See
[Usage and costs](../concepts/usage-and-costs.md).

## Still stuck

Gather the details on [Support](support.md) and get in touch. The [error codes](../api/errors.md)
list every code with its meaning.
