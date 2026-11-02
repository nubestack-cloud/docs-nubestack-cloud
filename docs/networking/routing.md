---
methods: true
title: Routing
---

# Routing

Routing connects networks inside one location. Use it to let a web tier reach a database tier on another network without assigning public IPs. A routed network joins the project's private router; an isolated network does not.

Open **Networking → Routing** to see routers, connected ranges and routes.

![Private routing and the networks it connects](../assets/screens/networking/routing.webp)

## Connect or isolate a network

1. Open **Networking → Networks**, then the network.
2. Choose **Attach to private routing** to connect it.
3. To isolate it, choose **Detach from private routing** and review the confirmation.
4. Follow the operation. Instances on a detached network can still reach each other, but lose the router's paths to other networks and the Internet gateway.

Detaching is refused when attached public IPs depend on the route. Detach those addresses first. Connected networks must have non-overlapping address ranges. A network created with native tools may have a topology the simplified routing controls cannot change; the refusal explains why.

## Manage routers and routes

In **Routing**, open a router to manage its interfaces, gateway and static routes. Add an interface by choosing the network's subnet. Remove an interface only after moving traffic that depends on it. Static routes need a destination CIDR and a reachable next-hop address.

An [Internet gateway](/networking/internet-gateways.md) supplies Internet access; private routing by itself does not. A route also does not open a firewall rule: check the instances' [security groups](/networking/security-groups.md).

## Let an instance forward traffic

For a router or VPN instance, open its **Networks** tab and use the forwarding controls for the relevant interface. Add only the private ranges the instance forwards. Configure IP forwarding, routes and firewall rules inside the guest as well. A forwarding setting on a cloud interface does not configure the operating system.

## With the API

The following creates a private router without a public gateway. For the usual project router, prefer the network's `:set-routing` action instead of creating another router.

<!-- api-example: post_router -->

| Change | Request |
|---|---|
| Connect a network to private routing | `POST {P}/networks/{id}:set-routing` with `{"enabled": true}` |
| Connect an interface | `POST {P}/routers/{id}:add-interface` |
| Remove an interface | `POST {P}/routers/{id}:remove-interface` |
| Set routes | `POST {P}/routers/{id}:set-routes` |
| Instance forwarding | `POST {P}/servers/{id}:set-forwarding` |

`{P}` is the project API path. See the [generated reference](/api/reference/index.md) for each body and follow returned operations.

## Delete and good practice

Remove router interfaces before deleting a router. Public IPs and connected resources can block disconnection. Keep a note of the intended routes before editing them, and avoid making changes through the same network connection you are removing.
