---
title: Requests
---

# Requests

Send JSON with `Content-Type: application/json` for request bodies. Read the actual response status before deciding whether a change is finished. A `202` means accepted; `200` or `201` may return a completed read or saved definition.

## Idempotency and retries

Send `Idempotency-Key` for `POST` and `DELETE` mutations, except where the endpoint explicitly permits omission. The key is 1–255 characters from letters, digits, `.`, `_`, `~` and `-`. A UUID is a suitable choice.

```bash
export REQUEST_KEY="$(python3 -c 'import uuid; print(uuid.uuid4())')"
```

Keep that key and the exact body for a retry after a lost response. A matching replay returns the stored outcome with `Idempotency-Replayed: true`; reusing a key for a changed request gives `409 idempotency_key_reused`. A concurrent request can return `idempotency_key_in_progress`; wait before retrying.

Do not generate a new key on every network retry: that can submit a second change. Generate a new key when you intentionally make a new request, including a new attempt after a terminal failed operation whose cause you have fixed.

One-time secrets are excluded from stored replay responses. If you lose a key-creation response, replaying it will not recover the secret.

## ETags and If-Match

Versioned resources use `ETag` and `If-Match` to prevent one person's update overwriting another's. Read the resource, preserve its current ETag including quotes, then send that value on the mutation required by the reference.

```http
GET /v1/orgs/{org_id}/settings

HTTP/1.1 200 OK
ETag: "3"
```

```http
PATCH /v1/orgs/{org_id}/settings
If-Match: "3"
Content-Type: application/json

{"members_create_projects": false}
```

A missing required precondition gives `428`; a stale one gives `412`. Read again, compare changes and decide whether your update is still intended. Do not bypass the check. Not every endpoint is versioned; use its documented headers. Tags have their own `tags_version` for the tag update precondition.

## Cursor pagination

List endpoints that paginate return `items` and `next_cursor`. When the cursor is non-null, request the next page with the same filters and the returned cursor; URL-encode it rather than editing it.

```bash
curl --get --fail-with-body "$NUBESTACK_API/v1/orgs/$ORG/projects" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  --data-urlencode "cursor=$NEXT_CURSOR"
```

Cursors are opaque, expire and are bound to the caller, organization, route and filters. An `invalid_cursor` response means start the list again. Resource inventory responses also carry freshness and completeness information; read these fields before treating a list as a complete current view.

## Rate and temporary refusals

Respect `Retry-After` when supplied. Use bounded backoff for temporary failures, keeping the idempotency key for a retry of the same request. Never retry a permission, validation or dependency refusal unchanged. Record the problem's `request_id` when reporting a failure. See [Errors](/api/errors.md).
