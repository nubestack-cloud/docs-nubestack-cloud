---
action_tabs: true
title: Custom roles
---

# Custom roles

Custom roles combine selected actions when the built-in roles are too broad. Use one for a deployment team that may create and update instances but must not manage access, or an auditor who only reads activity and usage.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](/api/overview.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![Built-in and custom roles](../assets/screens/organization/roles.webp)


## Create a role

=== "Console"

    1. Open the organization's **Roles** page, or the project's role settings for a project-local role.
    2. Choose **Create role**, give it a name and explain its purpose.
    3. Choose its scope: organization or project. Select actions from the offered list.
    4. Check the summary and save. The picker only offers assignable actions you are permitted to delegate.
    5. Assign the role to a member or service account using an organization role assignment or project grant, as appropriate.

    ![Create a custom role from allowed actions](../assets/screens/organization/role-create.webp)

    Some security-sensitive actions are unavailable in custom roles. The action list is authoritative; a role cannot be used to give access you do not hold. See [Roles and permissions](/concepts/roles-and-permissions.md) for the organization/project distinction and native access behavior.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/roles" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "name": "Deployer",
      "scope": "project",
      "actions": [
        "project.read",
        "workload.read",
        "workload.create",
        "workload.update"
      ]
    }'
    ```

    Returns `201` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/roles.md#create-role).


## Edit a role safely

=== "Console"

    Open the role to see its actions and holders. Review every affected holder before adding or removing actions. If the role supplies native project access, changes can take time to reach each location. The console reports any operation required by an update.

    Updates use a version check. If someone else changed the role, refresh and review their version before saving your changes again.

=== "API"

    ```bash
    curl --fail-with-body -i -X PATCH "$NUBESTACK_API/v1/orgs/$ORG/roles/$ROLE_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG" \
      -H "Content-Type: application/json" \
      --data '{
      "description": "Application deployment access"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/roles.md#change-role).


## Delete and limits

=== "Console"

    Built-in roles cannot be edited or deleted. Remove or replace assignments before deleting a custom role; a role still held by a member or service account is refused. Prefer a small set of clearly named roles over one per person, and review role holders regularly.

=== "API"

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/roles/$ROLE_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/roles.md#delete-role).
