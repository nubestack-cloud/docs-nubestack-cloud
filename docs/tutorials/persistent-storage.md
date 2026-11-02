---
title: Keep data on a volume
description: Create a volume, attach, format and mount it in an instance, take a snapshot, and prove you can restore it.
---

# Keep data on a volume

Put an application's data on a volume, so you can replace the instance without losing it, then
take a snapshot and prove that you can restore it.

**You will use:** an instance, a volume and a snapshot, in Karachi.

## Before you start

- A running Linux instance, here `db-1`, that you can log in to with `sudo`.
- A role of project admin or project member, and room in the project's volume quota.

## 1. Create and attach a volume

=== "Console"

    1. Under **Storage → Volumes**, choose **Create volume**: **Location** Karachi, name
       `db-data`, **Empty**, a **Type**, and **Size** `20`. Create it.
    2. When it is available, choose **Manage → Attach to instance** and pick `db-1`.

    ![Attach a volume to an instance in the same location](../assets/screens/storage/volume-attach.webp)

=== "API"

    ```bash
    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/volumes" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      -d '{"location": "loc_01jbkhi", "display_name": "db-data", "size_gb": 20}'

    # once its operation has succeeded:
    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers/srv_01jbdb1:attach-volume" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      -d '{"volume_id": "vol_01jbdbdata"}'
    ```

## 2. Format and mount it

Log in to the instance and find the new disk by its size. Its device name can differ between
images and attachments; do not assume `/dev/vdb`.

```bash
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINTS
```

!!! danger "Format only a new, empty volume"

    Formatting erases the disk. A volume restored from a snapshot, or moved from another instance,
    already has a file system: mount it, do not format it.

```bash
sudo mkfs.ext4 -L db-data /dev/vdb        # the empty disk you found above
sudo mkdir -p /srv/db-data
echo 'LABEL=db-data /srv/db-data ext4 defaults,nofail 0 2' | sudo tee -a /etc/fstab
sudo mount /srv/db-data
df -h /srv/db-data
```

Mounting by label, with `nofail`, keeps the instance starting even if the volume is detached.

## 3. Take a snapshot

A snapshot taken by hand needs the volume detached, so nothing is half-written.

1. Stop the application, then `sudo umount /srv/db-data`.
2. **Manage → Detach** on the volume.
3. **Manage → Create snapshot**, named `db-data-before-upgrade`.
4. Attach the volume again and `sudo mount /srv/db-data`.

For snapshots on a timetable without detaching, use a [backup schedule](../storage/schedules.md).

## 4. Restore it to a new volume

<figure class="ns-diagram">
--8<-- "storage-recovery.svg"
<figcaption>Restoring makes a new volume from the snapshot. The original volume and the snapshot are not changed.</figcaption>
</figure>

1. On the snapshot, choose **Manage → Create volume from it**, named `db-data-restored`.
2. Attach the new volume to the instance, beside the original.
3. Mount it read-only somewhere else and compare:

    ```bash
    sudo mkdir -p /mnt/restored
    sudo mount -o ro LABEL=db-data /mnt/restored   # if both carry the label, use the device name from lsblk
    ls /mnt/restored
    ```

4. When you are satisfied, unmount and detach it, and delete it if it was only a test.

A restore you have tried is worth more than many you have not.

## 5. Grow it later

Detach the volume, choose **Manage → Extend** with the new size, attach it again, then grow the
file system inside: `sudo resize2fs /dev/vdb` for ext4 on the whole disk.

## Clean up

Unmount and detach the volume, delete its snapshots, then delete the volume. A volume cannot be
deleted while it is attached or has snapshots.

## Related

- [Volumes](../storage/volumes.md) · [Snapshots](../storage/snapshots.md) · [Schedules](../storage/schedules.md)
