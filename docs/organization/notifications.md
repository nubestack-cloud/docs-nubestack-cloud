---
title: E-mail notices
action_tabs: true
---

# E-mail notices

Choose which optional notices this organization sends you. Preferences belong to you in the selected organization; they do not change another member's choices or your preferences in a different organization.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](/api/overview.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>


## Choose maintenance notices

=== "Console"

    1. Select the intended organization.
    2. Open the account menu and choose **E-mail notices**.
    3. Review the switches for maintenance starting, being extended and ending in locations you use.
    4. Change each optional switch as needed. Read any saved-value or delivery notice on the page.

    ![Personal maintenance notices and the messages always sent](../assets/screens/organization/notifications.webp)

    Invitations addressed to you, closure of an organization you own and answers to quota requests you made are listed as **Always sent**. They cannot be disabled using the maintenance switches.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    **Get my e-mail notices**

    ```bash
    curl --fail-with-body -i -X GET "$NUBESTACK_API/v1/orgs/$ORG/notification-preferences" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/organizations.md#get-preferences).

    **Set an e-mail notice**

    ```bash
    curl --fail-with-body -i -X PUT "$NUBESTACK_API/v1/orgs/$ORG/notification-preferences/$KIND" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "enabled": true
    }'
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/organizations.md#put-preference).


## Delivery and maintenance

If the page says the provider is not sending email yet, saving a preference does not guarantee delivery; the choice applies when email is enabled. Check the dates and time zones in maintenance notices, and use the console's location and operation status when investigating an affected request.

A maintenance notice is not an automatic application failover. Arrange your application's own recovery plan if it must continue through a location outage. Ask through your supplied [support route](/help/support.md) if the maintenance scope is unclear.
