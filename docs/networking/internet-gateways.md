---
title: Internet gateways
description: Let instances on a project's routed networks reach the Internet through one shared outbound address.
---

# Internet gateways

An **Internet gateway** lets instances on a project's routed networks in one location reach the
Internet. Their traffic goes out through one shared public address (NAT) that the location
assigns. Nothing on the Internet can reach your instances through it: for that, give an instance
a [public IP](public-ips.md), which also needs the gateway.

A project has at most one Internet gateway per location. It serves every network attached to
[private routing](routing.md) there; isolated networks never use it.

Find it under **Networking → Internet gateways**.

![Internet gateways: Karachi's gateway with its outbound address and the networks behind it](../assets/screens/networking/internet-gateways.webp)

## Create an Internet gateway

=== "Console"

    1. Choose **Create Internet gateway**.
    2. **Location**: one of the project's locations without a gateway.
    3. Choose **Create Internet gateway**. The outbound address shows once it is ready.

    You can also create it with the project, or when adding a location to one: **Create an
    Internet gateway (outbound NAT)**.

=== "API"

    `{placement_id}` is the project's ID in that location: `placements[].id` in
    `GET /v1/orgs/$ORG/projects/$PROJECT`.

    ```bash
    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/placements/plc_01jbkhi/internet-gateway" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      -d '{}'
    ```

A gateway made or changed with the location's own tools and shown with outbound NAT off offers
**Manage → Enable outbound NAT**.

## Delete an Internet gateway

=== "Console"

    1. Detach every public IP in that location from its instance or load balancer.
    2. Choose **Manage → Delete gateway** and confirm.

=== "API"

    ```bash
    curl -sS -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/placements/plc_01jbkhi/internet-gateway" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)"
    ```

Outbound access stops and the outbound address is released. Private routing, routes, networks
and instances stay.

**What blocks a delete**

| Refusal | Why | Resolve |
|---|---|---|
| `public_ips_in_use` | A public IP in the location is still attached; the message lists them | Detach them first, under **Public IPs** |

## Limits and good practice

- A gateway counts as **Internet gateway hours** in your [usage](../organization/usage.md) for as
  long as it exists, whether or not anything uses it.
- The outbound address can change if you delete the gateway and create a new one. Do not ask
  others to allow-list it unless you keep the gateway.
- IPv4 only. Port forwarding from the outbound address to an instance is not offered; give the
  instance a public IP or put a [load balancer](load-balancers.md) in front of it.
- To keep an instance off the Internet on a network that has a gateway, use a security group
  without outbound rules to public addresses (the **Private only** template).

## Related

- [Public IPs](public-ips.md) · [Routing](routing.md)
- [API reference: Networking](../api/reference/networking.md)
