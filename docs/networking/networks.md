---
action_tabs: true
title: Networks
---

# Networks

A network gives instances a private address range in one location. Use separate networks when services need separate address ranges or different routing. Networks belong to a project; they cannot stretch from Karachi to Islamabad.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](../api/index.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

Open **Networking → Networks** in your project. The list shows the location, range, routing, attached instances and tags.

![The project's networks and address ranges](../assets/screens/networking/networks.webp)


## Create a network

=== "Console"

    1. Choose **Create network** and a location.
    2. Name it `app` and enter a CIDR address range. Use a private range that does not overlap the other networks you plan to connect. Example ranges in these docs use reserved documentation addresses.
    3. Choose **Routed** to connect it to the project's other routed networks in this location, or **Isolated** to keep traffic within the network.
    4. Keep DHCP on unless you will assign a fixed address to every instance. Set DNS servers if your application needs specific resolvers.
    5. Optionally reserve a static address range. DHCP will not hand out these addresses; choose one as a fixed private address when launching an instance.
    6. Add tags, review the summary and choose **Create network**. Follow the operation until it succeeds.

    ![Create a network with a range and routing choice](../assets/screens/networking/network-create.webp)

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/networks" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "location": "loc_example",
      "display_name": "app",
      "routed": true,
      "subnet": {
        "cidr": "<private-ipv4-cidr>",
        "enable_dhcp": true
      },
      "tags": {
        "env": "prod"
      }
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).


## Edit an address range

=== "Console"

    Open the network's detail page, select **Address range**, then choose **Edit ranges**. You can change its name, gateway, DNS servers, DHCP and reserved static ranges. The CIDR itself cannot change; create a new network to use another CIDR. A normal network has one address range; networks discovered from native tools may have more.

    ![A network's address range, routing and connected services](../assets/screens/networking/network-detail.webp)

    Instances receive changed DHCP settings at their next renewal. With DHCP off, they receive network configuration at their next boot. Check the guest configuration after a change.

    ![Edit the network's address settings and reserved ranges](../assets/screens/networking/network-ranges.webp)

=== "API"

    ```bash
    curl --fail-with-body -i -X PATCH "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/subnets/$RESOURCE_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "enable_dhcp": true,
      "dns_nameservers": []
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).


## Connect services

=== "Console"

    - Choose this network when creating an [instance](../compute/instances.md), or attach it from an instance's **Networks** tab.
    - A [load balancer](load-balancers.md) uses a subnet in this location.
    - **Attach to private routing** connects an isolated network to the project's router. An [Internet gateway](internet-gateways.md) adds Internet access to routed networks.
    - [Security groups](security-groups.md) control allowed traffic even when routing exists.

=== "API"

    Use `enabled: true` to join private routing and `false` to isolate. Choose this network on instance and load balancer create requests.
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


## Delete and limits

=== "Console"

    From **Manage → Delete**, review the resources holding ports on the network. Delete or disconnect the named instances and load balancers first. Detach public IPs before removing routing. A refused delete names what is still using the network; do not repeatedly submit it unchanged.

    Quota is per project and location. Connected ranges must not overlap. Keep application networks private unless they need Internet access, and use [tags](../concepts/tags.md) to identify their purpose.

=== "API"

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/networks/$RESOURCE_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).

## Change network tags

=== "Console"

    Open **Tags** on the network and save the intended key/value set. Review the current tag version before updating through the API.

=== "API"

    ```bash
    curl --fail-with-body -i -X PUT "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/networks/$RESOURCE_ID/tags" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG" \
      -H "Content-Type: application/json" \
      --data '{
      "tags": {
        "env": "prod"
      }
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/networking.md).
