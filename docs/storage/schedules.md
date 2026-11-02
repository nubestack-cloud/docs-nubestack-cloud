---
methods: true
title: Schedules
---

# Schedules

Schedules run recurring work for a project. Use backup schedules for volume snapshots, power schedules to stop and start instances, and size schedules to change an instance group's desired count.

![Backup and power schedules with their next run](../assets/screens/storage/schedules.webp)

## Create a backup or power schedule

1. Open **Storage → Schedules → Create schedule**. You can also start from an instance's or volume's **Schedules** tab.
2. Choose **Back up volumes**, **Back up instances**, or **Stop and start instances**.
3. Select targets in one location. An instance backup snapshots its attached volumes; it does not save its image-backed system disk. Use [Create image](/compute/images.md) when you need that disk.
4. Choose a time zone and timetable. Backups can be hourly, daily or weekly. Power schedules have weekly stop and start times.
5. For backups, choose how many snapshots of each volume to keep. The schedule prunes only snapshots it created.
6. Name the schedule, review the next run and save.

![Create a schedule and choose its targets and timetable](../assets/screens/storage/schedule-create.webp)

The saved schedule takes effect for future runs. It is not a request to run the action immediately. Check its **Next run**, time zone, last result and linked operation.

## Schedule group sizes

Open an [instance group](/compute/instance-groups.md) and its **Scheduled sizes** section. Choose the desired size, local time, days and time zone. The size must remain within the group's minimum and maximum. After the scheduled run, the group creates or removes instances until it reaches that desired count.

## Edit, pause and delete

Use **Edit** on a schedule to change the supported target and timetable settings, retention or desired count. Review the next run after editing. **Pause** stops future runs; **Resume** enables them again. Runs act with the creator's current permissions; removing access can prevent a later run.

![Edit the schedule timetable and retention](../assets/screens/storage/schedule-edit.webp)

Deleting a backup schedule leaves its snapshots in place and stops pruning them. Delete unwanted snapshots separately. Deleting a power schedule does not start stopped instances. Deleting a size schedule does not undo the last desired count it set.

!!! note "Understand backup consistency"

    The console calls these backup schedules, but they create snapshots in the source storage, not independent backup copies. Scheduled snapshots of attached volumes do not pause applications. Database or multi-volume consistency needs application coordination and a tested restore procedure.

## With the API

<!-- api-example: create_schedule -->

List with `GET {P}/schedules`; filter by `target` or `kind`. Edits use `PATCH {P}/schedules/{id}`, with the current ETag in `If-Match`. Pause and resume use `POST .../{id}:pause` and `:resume`; delete uses `DELETE .../{id}`. Check the [reference](/api/reference/index.md) for each concurrency requirement. Saving a schedule returns a resource; its later runs create operations.

## Limits

At most 20 schedules per project and 10 targets per schedule are supported. Backup retention is 1–100 snapshots per volume. Choose an IANA time zone such as `Asia/Karachi`, and inspect the next-run display rather than assuming the browser's zone applies. Missed work and failures need attention in the schedule's last result and [activity](/organization/activity.md).
