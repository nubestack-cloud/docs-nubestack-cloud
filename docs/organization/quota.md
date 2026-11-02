---
action_tabs: true
title: Quota
---

# Quota

Quota limits how much a project may allocate in each location. It is separate from current capacity: having quota does not guarantee a launch can find capacity at that moment.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](../api/index.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![Organization quota and project allocations](../assets/screens/organization/quota.webp)


## Inspect usage and allocation

=== "Console"

    Open the organization's **Quota** page to see its budgets and how much has been allocated to projects. Open a project's **Quota and usage** page to see the limits and current usage for each location. A resource in Karachi consumes that project's Karachi allocation.

    An instance create can consume several quotas at once: instance count, vCPU, memory, data volumes and public IPs. Check the full create summary, rather than only the instance count.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    **Get every project's quota**

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/quota-allocations" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/quota.md).

    **Get a project's quota**

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/quota" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/quota.md).


## Change a project's quota

=== "Console"

    An authorized organization admin or owner can choose a project and location and edit its allocation. The console distinguishes changes inside the organization budget from increases that need provider review. You cannot reduce a limit below current use or allocate more than the remaining organization budget.

    Quota presets supply reusable allocations for new projects. Changing a preset does not silently resize existing resources.

=== "API"

    ```bash
    curl --fail-with-body -i -X PATCH "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/placements/$PLACEMENT_ID/quota" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG" \
      -H "Content-Type: application/json" \
      --data '{
      "values": {
        "instances": 10
      }
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/quota.md).

## Request more

=== "Console"

    Use **Quota requests → Request more quota** to request a larger organization budget.

    1. Choose the location; budgets are separate for each location.
    2. Enter the total budget you need for each changed resource, rather than just the amount to add. The form compares it with the current budget.
    3. Give a concrete reason, such as the application and number of additional instances, then submit.
    4. Track the pending decision in **Quota requests**. No allocation changes until approval. Cancel a request you no longer need using its available action.
    5. After approval, review project allocations and assign the new available budget where needed.

    Approval changes the organization's available budget; it does not create resources, automatically expand every project allocation or reserve location capacity.

    ![Request a larger organization budget for a location](../assets/screens/organization/quota-request.webp)

    If the refusal is `capacity_unavailable`, a quota request alone may not solve it. Try another supported size or location if your application allows it, or give support the operation ID.

=== "API"

    **Ask for a larger budget**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/quota-requests" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "location": "loc_example",
      "values": {
        "instances": 20
      },
      "reason": "Additional application replicas"
    }'
    ```

    Returns `201` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/quota.md).

    **Cancel a budget request**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/quota-requests/$REQUEST_ID:cancel" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/quota.md).


## Release quota

=== "Console"

    Delete unused resources, release public IPs and wait for successful operations and refreshed usage. Stopping an instance does not free its allocated instance quota, disks or public addresses. Read [Projects and quotas](../concepts/projects-and-quotas.md) and [Limits](../concepts/limits.md) for related rules.

=== "API"

    Delete or release the unused resources through their own action tabs, follow their operations, then refresh the quota read.
    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/quota" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/quota.md).
