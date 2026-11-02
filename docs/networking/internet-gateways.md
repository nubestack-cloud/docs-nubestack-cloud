---
action_tabs: true
title: Internet gateways
---

# Internet gateways

An Internet gateway connects a project's routed networks to the Internet in one location. Use one for outbound connections and for instances or load balancers that need a public IP. It serves the project's routed networks there; it does not connect locations.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](../api/index.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![An Internet gateway and its outbound address](../assets/screens/networking/internet-gateways.webp)


## Create a gateway

=== "Console"

    1. In your project, open **Networking → Internet gateways**.
    2. Choose **Create Internet gateway** and select **Karachi** or **Islamabad**.
    3. Confirm and follow the operation. The gateway's outbound address appears when it is ready.
    4. Check that the instance's network is **Routed**. An isolated network gains no Internet access from creating a gateway.

    Outbound access uses the gateway's address. For unsolicited inbound traffic, allocate and attach a [public IP](public-ips.md), then allow the required ports in a [security group](security-groups.md). Creating a gateway alone does not expose all instances.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/placements/$PLACEMENT_ID/internet-gateway" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{}'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).


## Delete and limits

=== "Console"

    Choose **Manage → Delete gateway** and read which networks lose Internet access. Attached public IPs can block removal; detach them first, including addresses on load balancers. Private traffic between routed networks continues when the gateway is removed.

    The console offers one project Internet gateway per location. Gateway hours count while it exists. Release unused public IPs separately, and check [usage](../organization/usage.md) after cleaning up.

=== "API"

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/placements/$PLACEMENT_ID/internet-gateway" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).
