---
title: Requests
description: The conventions every NubeStack Cloud API request follows - IDs, idempotency keys, versions and If-Match, load balancer versions, lists, pages and freshness.
---

# Requests

Every request is JSON over HTTPS. Send bodies with `Content-Type: application/json` and the key
in `Authorization` ([Authentication](authentication.md)).

## IDs

Every ID starts with a prefix that says what it is, such as `org_`, `prj_`, `loc_`, `srv_` (an
instance), `vol_`, `net_`, `lbs_` (a load balancer) or `op_` (an operation). IDs never change and
are never reused. Names are labels: two things can share one, so always refer to things by ID.

Each resource also shows its ID in the location under `provider.id`, for the OpenStack tools.

## Status codes

| Status | Means |
|---|---|
| `200 OK`, `201 Created` | Done. Changes that live only in NubeStack Cloud's records, such as an SSH key or a schedule |
| `202 Accepted` | Accepted; the work runs in the location. [Follow the operation](operations.md) |
| `4xx`, `5xx` | Refused or failed, with a [problem body](errors.md) |

## Idempotency keys

Every `POST` and `DELETE` that changes something needs an `Idempotency-Key` header: a value you
choose, unique per change, 1 to 255 letters, digits and `.` `_` `~` `-`. A UUID works.

```bash
KEY=$(uuidgen)
curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/volumes" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  -H "Idempotency-Key: $KEY" \
  -H "Content-Type: application/json" \
  -d '{"location": "loc_01jbkhi", "display_name": "data-1", "size_gb": 50}'
```

- If the connection drops and you are not sure the request arrived, send it **again with the same
  key and body**. You get the first answer back, marked `Idempotency-Replayed: true`, and nothing is
  made twice.
- The same key with a different body is refused with `409`.
- Without the header, the request is refused with `428`.
- Use a new key for each new change, including a new attempt after a failed operation.
- One-time secrets, such as a new API key, are never replayed.

## Versions and If-Match

Some resources carry a version so that two people's changes do not overwrite each other: launch
templates, instance groups, schedules, quota, project roles, custom roles, organization settings
and tags. Read the resource, keep its `ETag`, and send it back in `If-Match`:

```http
GET /v1/orgs/org_01jbacme/projects/prj_01jbwebshop/schedules/sch_01jbnightly
HTTP/1.1 200 OK
ETag: "3"

PATCH /v1/orgs/org_01jbacme/projects/prj_01jbwebshop/schedules/sch_01jbnightly
If-Match: "3"
Content-Type: application/json

{"keep": 14}
```

A stale version is refused with `412`: read again, decide, and retry. A missing one is `428`.

### Load balancer listeners and pools

Listener and pool changes carry the version in the body instead: `expected`, the
`lb_configuration.version` you read from the listener or pool (64 hexadecimal characters). A stale
one is refused; read the listener again.

## Lists and pages

Lists return a page of `items` and a `next_cursor`. Pass `?cursor=<next_cursor>` for the next page,
with the same filters, and `?limit=` for its size: 1 to 200, 50 by default. There are no totals.

```bash
curl -sS --get "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  --data-urlencode "limit=100" --data-urlencode "cursor=$NEXT_CURSOR"
```

Cursors are opaque: pass them back as they are. Resource lists take filters such as `location`,
`status`, `display_name_prefix`, `tag=env:prod` (repeatable) and `tag_key`.

### How current a list is

Lists of things in locations also return `sources`: for each location and service, whether its
data is `ok`, `stale`, `partial` or `unavailable`, and when it was read. `complete` is `true` only
when every source is `ok`. One location's trouble never fails the whole request, so read `sources`
before you treat a missing item as deleted.

`POST …/{collection}/{id}:refresh` reads one resource again from its location, and
`POST …/inventory:refresh` the whole project; both answer with an operation.

## Too many requests

`429` means you are sending too fast. Wait the number of seconds in `Retry-After`, then send the
same request with the same idempotency key.

## Related

- [Operations](operations.md) · [Errors](errors.md) · [API reference](reference/index.md)
