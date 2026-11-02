---
action_tabs: true
title: Usage
---

# Usage

Usage measures allocated resources over time. Open the organization's **Usage** page, or a project's **Quota and usage** page for a narrower view. Usage quantities are different from money amounts in the cost explorer.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](/api/overview.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![Usage quantities and source freshness](../assets/screens/organization/usage.webp)


## Read the report

=== "Console"

    Choose the period and grouping offered on the page. Review the unit next to each quantity: instance hours, vCPU hours, memory GiB-hours, volume GiB-hours and public-IP hours describe different things and must not be added together as a total.

    Check each source's freshness and partial-data notices. If a location has not supplied a recent observation, a number can be incomplete or bounded. A blank or unavailable value is not proof of zero usage.

    !!! note "Provisional"

        Usage and cost reporting are provisional. Values can change when observations arrive or are corrected. This page is not a final invoice and does not initiate payment.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/usage" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/usage-and-costs.md#organization-usage).


## What continues counting

A stopped instance retains its allocated instance, disks and public addresses. Its vCPU and memory hours stop, but other allocated resources continue to count. A detached public IP remains allocated until released. Unattached volumes also remain allocated storage.

Deleting a resource stops its future usage after the deletion completes; it does not erase past usage. Changes made through Horizon or native tools count in the same project and location.
