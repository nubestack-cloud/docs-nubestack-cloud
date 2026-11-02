---
action_tabs: true
title: Routing
---

# Routing

Routing connects networks inside one location. Use it to let a web tier reach a database tier on another network without assigning public IPs. A routed network joins the project's private router; an isolated network does not.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](../api/index.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

Open **Networking → Routing** to see routers, connected ranges and routes.

![Private routing and the networks it connects](../assets/screens/networking/routing.webp)


## Connect or isolate a network

=== "Console"

    1. Open **Networking → Networks**, then the network.
    2. Choose **Attach to private routing** to connect it.
    3. To isolate it, choose **Detach from private routing** and review the confirmation.
    4. Follow the operation. Instances on a detached network can still reach each other, but lose the router's paths to other networks and the Internet gateway.

    Detaching is refused when attached public IPs depend on the route. Detach those addresses first. Connected networks must have non-overlapping address ranges. A network created with native tools may have a topology the simplified routing controls cannot change; the refusal explains why.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/networks/$NETWORK_ID:set-routing" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "enabled": true
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).


## Manage routers and routes

=== "Console"

    In **Routing**, open a router to manage its interfaces, gateway and static routes. Add an interface by choosing the network's subnet. Remove an interface only after moving traffic that depends on it. Static routes need a destination CIDR and a reachable next-hop address.

    An [Internet gateway](internet-gateways.md) supplies Internet access; private routing by itself does not. A route also does not open a firewall rule: check the instances' [security groups](security-groups.md).

=== "API"

    **Create a router**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/routers" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "location": "loc_example",
      "display_name": "private-routing",
      "public_gateway": false,
      "subnet_ids": []
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).

    **Attach a range to a router**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/routers/$ROUTER_ID:add-interface" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "subnet_id": "subnet_example"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).

    **Detach a range from a router**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/routers/$ROUTER_ID:remove-interface" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "subnet_id": "subnet_example"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).

    **Set a router's routes**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/routers/$ROUTER_ID:set-routes" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "routes": [
        {
          "destination": "192.0.2.0/24",
          "nexthop": "198.51.100.10"
        }
      ]
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).


## Let an instance forward traffic

=== "Console"

    For a router or VPN instance, open its **Networks** tab and use the forwarding controls for the relevant interface. Add only the private ranges the instance forwards. Configure IP forwarding, routes and firewall rules inside the guest as well. A forwarding setting on a cloud interface does not configure the operating system.

=== "API"

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers/$SERVER_ID:set-forwarding" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "network_id": "net_example",
      "cidrs": [
        "192.0.2.0/24"
      ]
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/instances.md).


## Delete and good practice

=== "Console"

    Remove router interfaces before deleting a router. Public IPs and connected resources can block disconnection. Keep a note of the intended routes before editing them, and avoid making changes through the same network connection you are removing.

=== "API"

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/routers/$RESOURCE_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).
