---
title: Authentication
description: Authenticate to the NubeStack Cloud API with a service account's API key. What a key may do, how long it lasts, and how to rotate it.
---

# Authentication

Scripts and pipelines authenticate with an **API key** of a
[service account](../organization/service-accounts.md), sent as a bearer token on every request:

```http
Authorization: Bearer nxk_…
```

```bash
curl -sS "$NUBESTACK_API/v1/me" -H "Authorization: Bearer $NUBESTACK_API_KEY"
```

## Get a key

Owners and admins create the service account, give it a role on each project it works in, and
choose **Issue an API key**. The key is shown once; store it in your secret store. See
[Service accounts and API keys](../organization/service-accounts.md).

## What a key may do

A key can do what its service account's roles allow, and no more:

- its organization role, **Member** or **Viewer**;
- its project roles, **Project member** or **Project reader** (or a custom role within those
  bounds), on the projects it was given.

Whatever its roles, a service account never manages people, project access, roles, API keys,
settings or service accounts, and never creates or deletes projects or their locations.

Two opt-in permissions, chosen when the key is issued, add to what the roles allow:

| Permission | Scope | Lets the key |
|---|---|---|
| **Open instance consoles** | `consoles` | Open an instance's console and read its console log, where the account is a project member |
| **Make cloud credentials** | `credentials:mint` | Make cloud credentials for its own service account |

Keys work only on organization routes, `/v1/orgs/{org_id}/…`, plus `GET /v1/me`.

## Answers you may get

| Status | Code | Meaning |
|---|---|---|
| `401` | `api_key_invalid` | The key is unknown, revoked or expired |
| `403` | — | The key's roles do not allow this action |
| `404` | — | Not found, or in a project the key has no role on: the API does not say which |

## Lifetime and rotation

- A key lasts 1 to 365 days, 90 by default.
- A service account holds at most two active keys (`409 api_key_limit`), so you can rotate without
  a gap: **Rotate** shows a new key and keeps the old one working for 24 hours, 1 hour, or not at
  all. Through the API, `:rotate` takes `overlap_s` up to seven days.
- **Revoke** stops a key from the next request.

## Keep keys safe

- One service account per system, with only the projects and roles it needs.
- Store keys in your CI's secret store or a vault, never in a repository, an image or a log.
- Rotate before expiry, and at once if a key may have leaked; the audit log shows where each key
  was used.
- Never put a key in a support request.

## Related

- [Requests](requests.md) · [Errors](errors.md)
- [API reference: Service accounts and API keys](reference/service-accounts-and-api-keys.md)
