---
title: Connect private services
description: A web tier and a database on separate private networks in one location, with only the web tier reachable from the Internet.
---

# Connect private services

Run a web tier and a database on two private networks in one location. Only the web tier is
reachable from the Internet; the database accepts its port only from the web tier.

**You will use:** two networks, private routing, two security groups and two instances, in
Karachi.

| Part | Network | Reachable from |
|---|---|---|
| `web-1` | `app`, `10.0.0.0/24` | The Internet on 80 and 443, through its public IP |
| `db-1` | `db`, `10.0.1.0/24` | Only `web-1`'s security group, on 5432 |

<figure class="ns-diagram">
--8<-- "two-tier-network.svg"
<figcaption>What you will build: the Internet reaches only web-1, and the database accepts 5432 only from the web group.</figcaption>
</figure>

## Before you start

- A project in Karachi with an Internet gateway. The project's `default` network can serve as
  `app`.
- Ranges that do not overlap the project's other routed networks.

## 1. Create the database network

=== "Console"

    Under **Networking → Networks**, choose **Create network**: name `db`, range
    `10.0.1.0/24`, **Routed**. Routed networks of the project reach each other through its private
    router; nothing else is needed for the path.

=== "API"

    ```bash
    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/networks" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      -d '{"location": "loc_01jbkhi", "display_name": "db", "routed": true, "subnet": {"cidr": "10.0.1.0/24"}}'
    ```

## 2. Create the two security groups

1. `web`: from the **Web** template (TCP 80 and 443 from anywhere). Add SSH from your office
   range, such as `203.0.113.0/24`.
2. `db`: from the **Empty** template. Add an inbound rule: TCP `5432`, **Remote: Security group**
   `web`.

![The db group's rules: PostgreSQL only from instances in the web group](../assets/screens/networking/security-group-rules.webp)

=== "API"

    ```bash
    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/security-groups/sgr_01jbdb:add-rule" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      -d '{"direction": "ingress", "protocol": "tcp", "port_min": 5432, "port_max": 5432, "remote_group_id": "sgr_01jbweb"}'
    ```

A rule whose remote is a group matches its instances' own addresses, so the database follows the
web tier as it grows, without address lists.

## 3. Create the instances

- `web-1` on `app`, in the `web` group, with **A new public IP**.
- `db-1` on `db`, in the `db` group, with **No public IP**. It can still reach the Internet for
  updates through the gateway; nothing on the Internet can reach it.

## 4. Check the path

From `web-1`, connect to the database's private address:

```bash
psql -h 10.0.1.10 -U app -d shop -c 'select 1'
```

Then check what should fail does fail: from your computer, the database's address is not
reachable at all. The database itself must listen on its private address (`listen_addresses` in
PostgreSQL) and allow the web tier's range in its own access rules.

Open **Network topology** to see both networks on the router, and each instance on its network.

![Network topology: both networks on the project's router](../assets/screens/networking/topology.webp)

## If it does not connect

- Both networks are **Routed**, and their ranges do not overlap.
- `db-1` is in the `db` group, and `web-1` in the `web` group.
- The database listens on its private address and its port is right.

## Clean up

Delete the instances, release `web-1`'s public IP, delete the `db` group, then the `db` network.
A network cannot be deleted while instances have addresses on it.

## Related

- [Networks](../networking/networks.md) · [Routing](../networking/routing.md) · [Security groups](../networking/security-groups.md)
