---
methods: true
title: Organization settings
---

# Organization settings

Organization settings control membership policy, sign-in requirements, activity visibility and closure. Open **Settings** at the organization level. Project settings are separate and affect one project.

![Organization settings and policy controls](../assets/screens/organization/settings.webp)

## General and security {#security}

Review the **General** and **Security** tabs. Settings include whether members may create projects, which email domains may receive invitations and whether a second factor is required for members.

Owners and admins always need a second factor; a platform requirement may also enforce it. Some controls are owner-only or fixed by the provider. The console explains a fixed value rather than offering an edit that cannot succeed.

To change a setting:

1. Read the current value and its explanation.
2. Change the permitted control and complete any fresh sign-in or second-factor check requested.
3. Save, then confirm the new value. If another administrator changed settings first, reload and review before retrying.

New second-factor requirements can have a displayed grace deadline. Members should enroll before that deadline. If a member is locked out, use the support route supplied at onboarding rather than sharing another person's account.

## Audit and retention

The **Audit and retention** tab controls how far back authorized members may read the audit log, whether export is allowed and whether organization viewers can read it. Read access and retention bounds come from the provider's policy; use the options shown in the console.

Export needed records before shortening a read window. The audit read window is distinct from resource-deletion retention and from retained accounting records.

## Take a copy of your data

Under the organization's **Danger zone**, choose **Request data export**. Follow the preparation operation, then download the export when its link is ready. Keep the download securely; it can contain membership, resource and activity information. The export is a record of your organization, not a backup of guest disks or application data.

## E-mail notices

Use your notification preferences to choose optional messages. Required service or security notices may remain enabled. Check the affected location and time zone in a maintenance notice, and plan application work around the published window.

## Danger zone

The owner can transfer ownership or request organization closure. Closure affects every project and all resources across locations. Review the report and deadlines, and request a data export if needed. See [Deletion and retention](/concepts/deletion-and-retention.md) before using these actions.

## With the API

Read with `GET /v1/orgs/{org_id}/settings`, save the current `ETag`, then send `PATCH` to that path with `If-Match` and only the intended fields. A stale version produces a conflict/precondition failure; read again instead of dropping the version check. The [reference](/api/reference/index.md) lists the allowed fields.

Changing sign-in policy is not a substitute for reviewing [members](/organization/members.md), [service accounts](/organization/service-accounts.md) and project access.
