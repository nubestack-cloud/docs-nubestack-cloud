---
title: Errors
description: The problem body every API error returns, what to do for each status, when to retry, and every error code.
---

# Errors

Every error is a JSON problem (RFC 9457), with `Content-Type: application/problem+json`:

```json
{
  "type": "https://docs.nubestack.com/problems/volume_in_use",
  "title": "Volume in use",
  "status": 409,
  "detail": "Detach the volume from db-1 before deleting it.",
  "code": "volume_in_use",
  "request_id": "req_01jbx7f3",
  "retryable": false
}
```

- **Match on `code`.** It is stable; `title` and `detail` are for people and can change. `type`
  is a URL ending in the same code.
- **`retryable`** says whether the same request can succeed later unchanged.
- **`request_id`** identifies the request: give it to [support](../help/support.md).
- A `422` lists what was wrong in `errors[]`, each with the field and a reason.
- Some refusals add fields that name what is in the way, such as the listeners that serve a
  certificate.

## What to do for each status

| Status | Next step |
|---|---|
| `400` | Fix the request; for an expired cursor, start the list again |
| `401` | The key is unknown, revoked or expired (`api_key_invalid`) |
| `403` | The key's roles do not allow it; or a second factor is needed (`second_factor_required`) |
| `404` | Check the ID, the organization and the project; the key may have no role there |
| `409` | Resolve the conflict the code names: something in use, a limit, a reused idempotency key |
| `412` | Your version is stale: read again and decide |
| `422` | Fix the fields listed in `errors[]` |
| `428` | Send the missing `Idempotency-Key` or `If-Match` |
| `429` | Wait the seconds in `Retry-After`, then retry with the same idempotency key |
| `5xx` | Retry later with the same idempotency key if `retryable` is true |

A change that was accepted and then failed in the location is not an HTTP error: the
[operation](operations.md) ends `failed` and its failed step says why.

## Every error code

The codes a customer can receive, generated from the product's catalog. **Retry?** marks the ones
that can succeed later unchanged.

<!-- problem-table -->

Everyday cases in plain words are in [Troubleshooting](../help/troubleshooting.md).
