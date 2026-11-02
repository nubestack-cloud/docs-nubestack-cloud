---
methods: true
title: Quota
---

# Quota

Quota limits how much a project may allocate in each location. It is separate from current capacity: having quota does not guarantee a launch can find capacity at that moment.

![Organization quota and project allocations](../assets/screens/organization/quota.webp)

## Inspect usage and allocation

Open the organization's **Quota** page to see its budgets and how much has been allocated to projects. Open a project's **Quota and usage** page to see the limits and current usage for each location. A resource in Karachi consumes that project's Karachi allocation.

An instance create can consume several quotas at once: instance count, vCPU, memory, data volumes and public IPs. Check the full create summary, rather than only the instance count.

## Change a project's quota

An authorized organization admin or owner can choose a project and location and edit its allocation. The console distinguishes changes inside the organization budget from increases that need provider review. You cannot reduce a limit below current use or allocate more than the remaining organization budget.

Quota presets supply reusable allocations for new projects. Changing a preset does not silently resize existing resources.

## Request more

Use **Quota requests → Request more quota** to request a larger organization budget.

1. Choose the location; budgets are separate for each location.
2. Enter the total budget you need for each changed resource, rather than just the amount to add. The form compares it with the current budget.
3. Give a concrete reason, such as the application and number of additional instances, then submit.
4. Track the pending decision in **Quota requests**. No allocation changes until approval. Cancel a request you no longer need using its available action.
5. After approval, review project allocations and assign the new available budget where needed.

Approval changes the organization's available budget; it does not create resources, automatically expand every project allocation or reserve location capacity.

![Request a larger organization budget for a location](../assets/screens/organization/quota-request.webp)

If the refusal is `capacity_unavailable`, a quota request alone may not solve it. Try another supported size or location if your application allows it, or give support the operation ID.

## With the API

| Task | Endpoint |
|---|---|
| Project totals | `GET /v1/orgs/{org_id}/projects/{project_id}/quota` |
| Project location's quota | `GET .../placements/{placement_id}/quota` |
| Change allocation | `PATCH .../placements/{placement_id}/quota` |
| Organization allocations | `GET /v1/orgs/{org_id}/quota-allocations` |
| Requests | `GET` or `POST /v1/orgs/{org_id}/quota-requests` |

A quota change can return either a saved allocation or an operation. Use the status and body documented in the [reference](/api/reference/index.md), and include concurrency headers where required.

## Release quota

Delete unused resources, release public IPs and wait for successful operations and refreshed usage. Stopping an instance does not free its allocated instance quota, disks or public addresses. Read [Projects and quotas](/concepts/projects-and-quotas.md) and [Limits](/concepts/limits.md) for related rules.
