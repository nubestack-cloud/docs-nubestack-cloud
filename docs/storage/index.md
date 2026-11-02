---
title: Storage
description: Volumes that keep data apart from any one instance, snapshots of them, and schedules that take snapshots for you.
---

# Storage

An instance's system disk goes when the instance goes. Keep data you care about on a
**volume**: a disk that lives on its own, which you attach to an instance and can move to
another. Take **snapshots** before risky changes, and let a **schedule** take them for you.

<div class="grid cards" markdown>

-   :material-harddisk:{ .lg .middle } **[Volumes](volumes.md)**

    ---

    Block storage you attach to an instance, extend, retype or move to another project.

-   :material-camera-outline:{ .lg .middle } **[Snapshots](snapshots.md)**

    ---

    Point-in-time copies of a volume, restored to a new volume.

-   :material-calendar-clock:{ .lg .middle } **[Schedules](schedules.md)**

    ---

    Snapshots on a timetable, instances stopped and started each week, group sizes by time.

</div>

## How recovery works

<figure class="ns-diagram">
--8<-- "storage-recovery.svg"
<figcaption>A snapshot records a volume at one moment. Restoring makes a new volume from it; the original volume and the snapshot stay as they were.</figcaption>
</figure>

!!! warning "Snapshots are not backups"

    A snapshot sits on the same storage as its volume. It protects you against a change you want to
    undo, not against losing that storage. Backups to separate storage are not offered yet: keep
    copies of critical data elsewhere too.

## Where to start

[Keep data on a volume](../tutorials/persistent-storage.md) walks through creating, formatting,
mounting, snapshotting and restoring a volume.
