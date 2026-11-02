---
title: Storage and recovery
---

# Storage and recovery

Keep application data on persistent volumes and use snapshots as recovery points before changes. A snapshot shares the source volume’s storage; it is not an independent backup.

<figure class="docs-diagram">
<div>
<!-- diagram: storage-recovery -->
</div>
<figcaption>Restoration makes a new volume; keep an independent backup outside this storage for storage-loss protection.</figcaption>
</figure>

## Choose a guide

<div class="guide-cards" markdown>
<div class="guide-card" markdown>

### [Volumes](/storage/volumes.md)

Create, attach, extend and manage persistent disks.

</div>
<div class="guide-card" markdown>

### [Snapshots](/storage/snapshots.md)

Create a point-in-time copy and restore into a new volume.

</div>
<div class="guide-card" markdown>

### [Schedules](/storage/schedules.md)

Schedule snapshots, instance power changes and group sizes.

</div>
<div class="guide-card" markdown>

### [Use a data disk](/tutorials/persistent-storage.md)

Identify a new disk, mount it and keep it through an instance replacement.

</div>
<div class="guide-card" markdown>

### [Test a recovery](/tutorials/recover-a-volume.md)

Restore a snapshot without overwriting the original data.

</div>
</div>
