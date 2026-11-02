---
title: Troubleshooting
---

# Troubleshooting

Start with the exact refusal or failed operation. Check the project and location, then read the resource's current state. Repeating the same request unchanged rarely fixes a dependency or permission problem.

## Cannot connect to an instance

1. Check that the instance is **Active** and its create operation succeeded.
2. Check the username for the chosen image, such as `ubuntu` for Ubuntu, and the matching private SSH key on your computer.
3. Confirm the public IP is attached to the intended interface.
4. Confirm the network is routed and the location has an Internet gateway.
5. Check a security group permits TCP 22 from your current address, and check the guest firewall.
6. Read **Console log** or open the [instance console](/compute/manage-instances.md#open-the-instances-console) to investigate boot or guest network problems.

The IPs shown in these docs are reserved examples and are not reachable service addresses.

## A create or resize is refused

| Refusal | What to do |
|---|---|
| Quota exceeded | Inspect that project's quota in the chosen location. Release unused allocations or request more |
| Capacity unavailable | Check another offered size or permitted location, or ask support with the operation ID |
| Resource changing | Wait for its current operation, then read the latest state |
| Wrong location | Choose an image, network, volume, key or certificate available in the target location |
| Forbidden | Check the action and project grant. An organization role alone may only allow reading |

An accepted create can fail later. Open the operation, inspect successful steps and retained resources, then fix the cause before submitting a new request.

## A delete is blocked

- **Volume attached:** unmount it in the guest, then detach it.
- **Volume has snapshots:** decide which snapshots to keep or remove before deleting the source.
- **Network in use:** follow the named instances or load balancers and remove their dependent interfaces.
- **Public IPs in use:** detach them before removing routing or the gateway, then release unused allocations.
- **Certificate in use:** switch or remove every listener named by the refusal.
- **Role in use:** replace its assignments before deleting the role.
- **Server group has members:** remove its member instances first.
- **Template referenced by a group:** remove or update the group before deleting the template.

Deleting an instance does not release its allocated public IP or delete separate data volumes. Review them explicitly after cleanup.

## A list or network map looks wrong

Check **Last read**, location filters and any partial-data notice. Choose **Refresh** and follow its operation. Resources created in native tools may not appear until the next read. An unavailable location can leave old data visible; old data does not prove a delete or update failed.

## An update says the version changed

Another change happened after you loaded the resource. Refresh, compare the current values and reapply only your intended change. API clients should read the current ETag before sending a new `If-Match`; do not remove concurrency protection.

## Sign-in and invitation issues

Use the invited email address and check the link's expiry. Ask an administrator to resend an expired or revoked invitation. For native access, check the selected organization, hold a project role, and allow time for grant changes to reach the location. Use a private window if Horizon keeps the wrong organization session.

## Costs seem incomplete

Check the provisional label, data-as-of time, source status and unrated lines. Unrated or unavailable amounts are not zero-cost resources. [Cost reporting](/organization/statements-and-costs.md) explains later adjustments and projections.

If you still need help, prepare the details listed on [Support](/help/support.md). The [API error catalog](/api/errors.md) lists machine-readable codes.
