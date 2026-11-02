---
action_tabs: true
title: Activity and audit log
---

# Activity and audit log

Activity helps answer who changed a resource, what happened and which operation carried it out. Use the organization audit log for access and security events, and project activity for work on that project's resources.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](../api/index.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![The organization's audit log](../assets/screens/organization/audit-log.webp)


## Find a change

=== "Console"

    1. Open **Activity** at the organization or project level.
    2. Choose a time range and filter by the available actor, category, outcome or resource controls.
    3. Open an event to inspect its target, result and request ID.
    4. Follow an operation link to see whether the accepted change finished, failed or partly succeeded.

    An accepted request and a successful final operation are different events. A refused request may appear in the audit log without creating an operation. Resource detail pages also have their own **Activity** tab.

    Actors appear as a person, service account, former member or system action. Visibility of names and email addresses depends on your role. Do not infer a human action from a system-scheduled event.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/audit-events" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/audit-log.md).


## Export

=== "Console"

    When allowed by organization policy, export the selected audit events as CSV or JSON lines. Narrow the time range to the incident or review you need. The readable window is configured in [organization settings](settings.md); it may not cover the organization's entire history.

    Protect exports because they can contain member addresses and resource information. Events do not provide a way to recover private keys or one-time credential secrets.

=== "API"

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/audit-events:export" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/audit-log.md).


## When asking for help

Record the event time, request ID, operation ID, project and location. Include the problem code and the text of the refusal. Never include an API key, invitation secret, private key or console URL in a support request.
