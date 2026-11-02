---
title: Networking
description: Private networks, routing, Internet gateways, security groups, public IPs and load balancers.
---

# Networking

Networking decides who can reach your instances and what they can reach. Everything here lives
in one location: a network in Karachi never reaches one in Islamabad by itself.

<figure class="ns-diagram">
--8<-- "network-path.svg"
<figcaption>In one location: private routing joins the project's networks, the Internet gateway takes traffic out, and a public IP brings traffic in to one instance.</figcaption>
</figure>

<div class="grid cards" markdown>

-   :material-lan:{ .lg .middle } **[Networks](networks.md)**

    ---

    Private address ranges for your instances, with DHCP, DNS and static ranges.

-   :material-router-network:{ .lg .middle } **[Routing](routing.md)**

    ---

    The project's private router in each location, routes through an instance, and forwarding.

-   :material-web:{ .lg .middle } **[Internet gateways](internet-gateways.md)**

    ---

    Outbound Internet access for routed networks, through one shared address.

-   :material-shield-half-full:{ .lg .middle } **[Security groups](security-groups.md)**

    ---

    Firewall rules: which traffic may reach an instance, and what it may send.

-   :material-ip-network-outline:{ .lg .middle } **[Public IPs](public-ips.md)**

    ---

    Addresses that make one instance or load balancer reachable from the Internet.

-   :material-scale-balance:{ .lg .middle } **[Load balancers](load-balancers.md)**

    ---

    One address for several instances, with health checks and HTTPS.

-   :material-graph-outline:{ .lg .middle } **[Network topology](network-topology.md)**

    ---

    A drawing of a project's networks and what is connected to each.

</div>

## The path of a packet

| You want | You need |
|---|---|
| Instances to talk to each other | The same network, or two **routed** networks in the same location, and security group rules that allow it |
| Instances to reach the Internet | A routed network and an **Internet gateway** in the location |
| The Internet to reach an instance | All of the above, a **public IP** on the instance, and a rule that allows the port |
| One address for several instances | A **load balancer** with a public IP, and rules that let it reach the instances |
| Traffic to an office or VPN range | A **route** through an instance that forwards for that range |

A new project made with **Set up a network** and **Create an Internet gateway** has a routed
network, `default` (`10.0.0.0/24`), and a gateway in each location from the start.
