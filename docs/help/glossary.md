---
title: Glossary
---

# Glossary

| Term | Meaning |
|---|---|
| API key | A bearer secret used by a service account to call the customer API |
| Catalog | The sizes, images, types and offerings available in a location |
| Certificate | A TLS certificate and associated private key used by an HTTPS listener |
| ETag | A version value used with `If-Match` to avoid overwriting another change |
| Horizon | A location's native OpenStack dashboard |
| Idempotency key | A request identifier that lets a matching retry reuse its original outcome |
| Image | A template for an instance's system disk |
| Instance | A virtual machine running in one location |
| Instance group | A desired number of instances from a launch template, maintained by the service |
| Internet gateway | A project's connection from routed networks to the Internet in one location |
| Launch template | A versioned saved instance configuration |
| Listener | A load balancer's incoming protocol and port |
| Load balancer | A frontend that distributes traffic to backend members |
| Location | An independent cloud, such as Karachi or Islamabad |
| Member | A person in an organization, or a backend in a load balancer pool, depending on context |
| Network | A project's private connectivity and address range in one location |
| Operation | The record of an accepted asynchronous change and its final result |
| Organization | The account boundary for members, projects, access policy and usage |
| Pool | A set of load balancer backends with a balancing policy |
| Project | A workspace containing resources, access grants and per-location quota |
| Provisional | Subject to correction; usage and cost figures are not final invoices |
| Public IP | An allocated Internet-facing address; `floating-ips` in the API |
| Quota | The amount a project or organization is permitted to allocate |
| Retention | The displayed period during which a requested project deletion can still be cancelled before purge |
| Role | A set of actions granted to a member or service account |
| Routed network | A network connected to the project's private router in its location |
| Schedule | A recurring backup, power action or group size change |
| Security group | Additive firewall rules on instance interfaces |
| Server group | A host-sharing or host-spreading policy chosen when instances are created |
| Service account | An identity for automation with its own roles, grants and credentials |
| Snapshot | A point-in-time volume copy in the same location |
| SSH key | A public authentication key copied into a new instance; its private half stays with you |
| Subnet | A network's IP range and its gateway, DHCP and DNS settings |
| Tag | A key/value label for organizing supported resources and grouping later usage |
| Volume | A persistent disk that can be attached to an instance independently of its system disk |

## Nexus

Nexus is the platform behind NubeStack Cloud. You may see this name on the console or native sign-in page. It does not indicate a different account or a separate set of resources.

Start with [Your first instance](/get-started/first-instance.md) for an example of how these services fit together.
