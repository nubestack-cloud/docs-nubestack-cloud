---
title: Public IPs
---

# Public IPs

A public IP is an Internet-facing address allocated to your project in one location. Attach it to an instance or load balancer that needs inbound Internet access. It stays allocated after detaching or deleting the instance, until you release it.

![Allocated public IPs, their attachments and tags](../assets/screens/networking/public-ips.webp)

## Allocate an address

1. Open **Networking → Public IPs**, then **Allocate public IP**.
2. Choose the location. Add tags such as `env: prod` and `team: web`.
3. Allocate it and follow the operation. The location chooses the address; the example `203.0.113.21` is not an address you can reserve.

![Allocate a public IP with tags](../assets/screens/networking/public-ip-allocate.webp)

## Attach or detach

Choose **Manage → Attach**, then an instance or load balancer in the same location. For an instance with several interfaces, choose the intended private address when offered. The target network must be routed through an [Internet gateway](/networking/internet-gateways.md).

![Attach an address to an instance](../assets/screens/networking/public-ip-attach.webp)

Follow the operation, then open the address's page to check its target. Instance and load balancer pages link back to the public IP. Allow the application's ports in its [security groups](/networking/security-groups.md); attachment alone does not allow traffic.

**Detach** removes the association and interrupts connections using that address. It keeps the public IP available for another target in this project and location.

## With the API

<!-- api-example: post_address -->

| Task | Request |
|---|---|
| List addresses | `GET {P}/floating-ips` |
| Attach | `POST {P}/floating-ips/{id}:associate` |
| Detach | `POST {P}/floating-ips/{id}:disassociate` |
| Replace tags | `PUT {P}/floating-ips/{id}/tags` |
| Release | `DELETE {P}/floating-ips/{id}` |

The customer term is public IP; the API collection is `floating-ips`. `{P}` is the project API path. Use the [reference](/api/reference/index.md) for the association body.

## Release and limits

Detach an attached address, then choose **Manage → Release**. Release returns it to the location's pool and stops its allocated-IP usage. You cannot rely on getting the same address again. Update DNS and external allowlists before releasing an address in use.

Public IP quota is per project and location. Unattached addresses still count toward quota and measured usage. Use [tags](/concepts/tags.md) to find unused allocations.
