---
title: Errors
---

# Errors

Errors use RFC 9457 problem details, normally with `Content-Type: application/problem+json`. Match the machine-readable `code` in your integration rather than the human title, which can change.

```json
{
  "type": "about:blank",
  "title": "Volume in use",
  "status": 409,
  "code": "volume_in_use",
  "detail": "Detach the volume before deleting it.",
  "request_id": "req_example"
}
```

This is an illustrative problem. A response may add fields naming attached instances, remaining snapshots or another dependency. Use those fields to explain the next action, and preserve the request ID for support.

## Decide what to do

| Status | Typical next step |
|---|---|
| `400` | Correct the request or restart an expired cursor |
| `401` | Check the credential and its expiry |
| `403` | Check the action, project grant and key scope |
| `404` | Check the resource ID, organization and project |
| `409` | Resolve the named state, quota or dependency conflict |
| `412` | Read the current version and review the update |
| `422` | Correct the fields identified by validation |
| `428` | Send the required idempotency key or version precondition |
| `429`, temporary `503` | Honor `Retry-After`, then use bounded retries if appropriate |

Do not retry a permanent refusal unchanged. For a request that was accepted, a later operation failure is reported on the operation: a successful acceptance response does not become a different HTTP response afterward.

## Customer problem codes

This table is generated at build time from `data/problems.json`, synchronized with the product's customer problem catalog. **Retryable** identifies temporary conditions; it is not a guarantee that an immediate retry will succeed. Read the detail and any retry delay first.

<!-- problem-table -->

For common cases in everyday language, see [Troubleshooting](/help/troubleshooting.md).
