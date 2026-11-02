---
title: Authentication
---

# Authentication

Authenticate automation with an API key issued to a [service account](/organization/service-accounts.md). The key acts with that account's current organization roles and project grants.

```http
Authorization: Bearer nxk_example
```

`nxk_example` is a placeholder. Copy the actual one-time secret when you issue a key; the console cannot display it again. Use an environment variable or your automation's secret store, not a query string or source-code literal.

## Get the right access

1. Create a service account for the automation.
2. Give it the organization role and specific project grants it needs.
3. Issue an API key with an appropriate expiry.
4. Make a read request first, then a small intended change to verify the required action is allowed.

An organization role alone does not grant workload changes on every project. A key's scopes restrict access further; they never add actions beyond the account's roles. Read-only project access cannot create, resize or delete an instance.

## Expiry, rotation and revocation

The default key lifetime is 90 days; the supported range is 1–365 days. Each account supports two active keys. Rotate before expiry, install and test the successor, then revoke the predecessor or let the overlap end. Rotation supports zero to seven days of overlap and defaults to 24 hours.

Revoke a suspected exposed key immediately. Removing a grant changes what its keys can do. Deleting the account revokes its keys and native credentials but leaves its workloads for explicit cleanup.

## Refused authentication

| Response | Check |
|---|---|
| `401` | Key is present, complete, unexpired and not revoked |
| `403` | Account has the action and project grant, and any scope allows it |
| Second-factor or fresh-authentication refusal | Complete the requested security check in the console; an API key cannot grant itself an elevated human session |

The browser console manages its own sign-in session. Do not copy browser cookies into scripts. Invitation-link secrets and one-time console links are not API keys.

## Customer API and native tools

A customer API key authenticates this API. OpenStack tools use either a person's [device sign-in](/native-access/openstack-cli.md) or a service account's native credential for one project location. These credential types are not interchangeable. Use the [reference](/api/reference/index.md) for creating and collecting native credentials programmatically.
