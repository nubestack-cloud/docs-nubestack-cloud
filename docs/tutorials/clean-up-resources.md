---
title: Clean up resources safely
---

# Clean up resources safely

Remove an application's resources in dependency order and verify what remains. Deleting the visible instance alone does not remove its public IP allocation, separate data volumes, snapshots or saved images.

## Before you begin

Identify the project and location, and decide what data must survive. Review tags and resource detail links. A single-resource delete is final after its operation completes; project retention is not an undo button for an individual volume delete.

## Stop automatic work

Pause or delete schedules that would create snapshots or change power state. Delete an instance group, choosing whether its members should be deleted or kept. Leaving a group active while deleting its members can make it create replacements.

Deleting a snapshot schedule keeps the snapshots it already made. Deleting a template keeps instances already launched from it.

## Remove the application in order

| Order | Action | Check what stays |
|---|---|---|
| 1 | Remove or update DNS and other external references | Cloud deletion does not edit your DNS provider |
| 2 | Detach and release public IPs | Detach alone keeps the allocation and its usage |
| 3 | Delete load balancers | Backend instances and certificates remain |
| 4 | Delete certificates no longer referenced by listeners | A certificate in use is refused |
| 5 | Unmount data volumes, then detach or retain them intentionally | Separate data disks are not the instance system disk |
| 6 | Delete instances | Public IP allocations, separate volumes and security groups may remain |
| 7 | Delete obsolete snapshots and then unneeded source volumes | A volume with snapshots or attachments can be refused |
| 8 | Delete unused images, templates and empty server groups | Check future group launches and other users first |
| 9 | Delete empty networks, unused security groups and Internet gateways | Remaining ports and attached public IPs can block removal |

Follow each operation before deleting its dependencies. A refusal names what is still using the resource; use those links rather than retrying unchanged. A partially successful create may have left resources even if its main instance never became ready.

## Delete a whole project

Use the project's **Settings → Danger zone** and review its report. **Delete only if empty** refuses a non-empty project. **Delete everything in it** removes active compute and network resources, while eligible data resources remain during the displayed recovery window.

Cancellation during that window does not recreate instances or networks already removed. The project remains suspended until resumed. **Delete now** ends the window early. Read [deletion and retention](/concepts/deletion-and-retention.md) before confirming either action.

## Verify cleanup

Refresh resource lists and inspect completed operations. Confirm unused public IPs were released, not merely detached, and that volumes, snapshots and images left behind are deliberate. Usage history remains; successful deletion stops future resource usage after it completes rather than erasing earlier usage.

For API cleanup, use the same dependency order, correct project-scoped IDs, required idempotency keys and version checks. [The reference](/api/reference/index.md) documents the delete endpoints. If a location is unavailable, read the deletion status; stale inventory is not evidence that all resources are gone.
