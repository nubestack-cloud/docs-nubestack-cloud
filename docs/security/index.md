---
title: Security
description: TLS certificates for HTTPS load balancers, several certificates on one listener, and your second factor.
---

# Security

The **Security** group of a project's menu holds the TLS certificates your HTTPS load balancers
serve. This part of the docs also covers how you and your colleagues sign in safely.

<div class="grid cards" markdown>

-   :material-certificate-outline:{ .lg .middle } **[Certificates](certificates.md)**

    ---

    Upload a certificate, its chain and its key once; HTTPS listeners then serve it.

-   :material-web-check:{ .lg .middle } **[Several certificates on one listener](sni.md)**

    ---

    Serve a different certificate for each of your domains on one address and port (SNI).

-   :material-cellphone-key:{ .lg .middle } **[Second factor](second-factor.md)**

    ---

    When you are asked for it, and how an owner requires it for everyone.

</div>

## Elsewhere in the docs

| Topic | Page |
|---|---|
| Firewall rules for instances | [Security groups](../networking/security-groups.md) |
| Who may do what | [Roles and permissions](../concepts/roles-and-permissions.md) |
| API keys for automation | [Service accounts and API keys](../organization/service-accounts.md) |
| Every change, refusal and security event | [Audit log and activity](../organization/activity.md) |
| Invitations only to your e-mail domains | [Settings](../organization/settings.md) |
