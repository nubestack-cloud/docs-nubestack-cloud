---
title: Manage projects
action_tabs: true
---

# Manage projects

Use projects to separate applications or teams while keeping membership and budgets in one organization. Each project can use one or more locations, with separate quota allocations and resources in each.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](/api/overview.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>


## Before changing a project

Confirm whether you are administering its access and locations or changing its workloads. An organization owner or admin can manage project settings; creating or deleting resources needs the corresponding project permission. A project reader cannot make these changes.



## Manage access and locations

=== "Console"

    1. Open **Projects** at the organization level, then the project's management page, or choose **Settings** from inside the project.
    2. Use **General** to confirm its name, IDs and current lifecycle state before working on it.
    3. Open **Access** to add a person or service account and select a role. Use project reader for inspection, member for permitted resource changes, or project admin for broader project control. A custom role can narrow the actions.
    4. Open **Locations** to add an offered location. Review the quota allocation and follow its setup operation before creating resources there.
    5. To remove a location, review the deletion report for that location. This is a resource-deletion workflow, not a way to move its instances or disks elsewhere.

    ![Project access and the roles assigned to members](../assets/screens/concepts/project-access.webp)

    You can also manage a person's grants from **Members → Manage → Project roles**. Review each selected project rather than treating organization membership as access to every workload.

    ![Review a member's project roles](../assets/screens/organization/member-project-roles.webp)

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    **Give a project role**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/grants" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "principal_id": "usr_example",
      "role": "project_member"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/project-access.md#create-grant).

    **Add a location to a project**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/placements" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "location": "loc_example"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/projects.md#post-placement).

    **Remove a location from a project**

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/placements/$PLACEMENT_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/projects.md#delete-placement).


## Quota and resource boundaries

Quota is allocated per project and location from organization budgets. Owners and admins can review allocations from the organization's quota controls. More quota does not guarantee that the location currently has capacity for a particular size.

Adding Islamabad to a project that uses Karachi does not copy its instances, networks, images or data. Re-create the application and arrange data replication explicitly when you need both locations.

## Delete, cancel or resume

=== "Console"

    Use **Danger zone → Delete project** only after checking retained data and automatic groups or schedules. Review **Delete only if empty** versus **Delete everything in it** and the displayed recovery window.

    During that window, **Cancel deletion** stops further deletion but does not recreate resources already removed. The project remains suspended until an authorized person chooses **Resume project**. **Delete now** ends recovery early and can require a fresh second-factor check. Read [deletion and retention](/concepts/deletion-and-retention.md) before confirming.

    For an application you are retiring without deleting the project, follow [resource cleanup](/tutorials/clean-up-resources.md).

=== "API"

    **Delete a project**

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "cascade": false
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/projects.md#delete-project).

    **Cancel a project's deletion**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT:cancel-deletion" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/projects.md#cancel-project).

    **Resume a project**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT:resume" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/projects.md#resume-project).

    **End a deletion's retention early**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT:delete-now" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "confirm": "web-shop"
    }'
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/projects.md#delete-now).
