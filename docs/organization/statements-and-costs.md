---
action_tabs: true
title: Statements and cost explorer
---

# Statements and cost explorer

Statements summarize rated usage for a month. The cost explorer groups estimated costs to help you understand where resources are going. Both are **provisional**, as the console labels them. These features do not provide payment collection, taxes or a final invoice.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](../api/index.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![Monthly statements with state and provisional amounts](../assets/screens/organization/statements.webp)


## Read a statement

=== "Console"

    1. Open the organization's **Statements** page.
    2. Select a month. Check whether the statement is open or closed, its currency and data-as-of time.
    3. Inspect each line's metric, quantity, unit and price. Follow a line's usage detail when you need to understand the observations behind it.
    4. Check for unrated lines and adjustments before comparing the total with another period.

    ![An open statement with usage and adjustment lines](../assets/screens/organization/statement-open.webp)

    An open statement changes as usage arrives. A closed statement fixes that period's statement; late corrections can appear as adjustments in a later statement. Unrated usage has no applicable price and is not a zero-cost promise.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    **List the organization's statements**

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/statements" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/usage-and-costs.md).

    **Get a statement**

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/statements/$STATEMENT_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/usage-and-costs.md).


## The cost explorer

=== "Console"

    Open **Cost explorer**, choose a month and group by project, service, location or an available tag key. The page can show daily amounts, the prior period and a projection when enough information exists. Read unavailable and partial-data explanations before drawing a conclusion.

    ![Cost explorer grouped by project](../assets/screens/organization/cost-explorer.webp)

    Tag grouping uses the tags in effect when usage occurred. Adding a tag now does not rewrite the history of earlier untagged use. The **Untagged** group helps find resources that were not assigned a value.

=== "API"

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/costs" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/usage-and-costs.md).


## Rate card and projections

The rate card describes prices currently in force and any published next version. Sample figures in these documentation screenshots are invented, not published NubeStack prices. A projected month total is an estimate based on observed use; it is not a budget limit or guaranteed charge.
