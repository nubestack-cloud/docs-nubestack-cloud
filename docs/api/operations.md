---
title: Operations
description: Follow a change from 202 Accepted to its final state, wait between reads, read a failed step, and cancel a queued operation.
---

# Operations

A request that makes, changes or deletes something in a location is accepted at once with
`202 Accepted`. The body names the **operation** that carries it out, and the `Location` header is
its address. The new resource's ID is fixed from the start.

```json
{
  "operation": {
    "id": "op_01jbweb3",
    "state": "queued",
    "href": "/v1/orgs/org_01jbacme/operations/op_01jbweb3"
  },
  "server": {
    "id": "srv_01jbweb3",
    "href": "/v1/orgs/org_01jbacme/projects/prj_01jbwebshop/servers/srv_01jbweb3"
  }
}
```

<figure class="ns-diagram">
--8<-- "operation-lifecycle.svg"
<figcaption>The answer comes at once; the operation then runs in the location and ends as succeeded, partially succeeded or failed.</figcaption>
</figure>

## Follow an operation

Read it until its `state` is final. Wait a few seconds between reads, and longer as it runs.

```bash
op="op_01jbweb3"
while :; do
  state=$(curl -sS "$NUBESTACK_API/v1/orgs/$ORG/operations/$op" \
    -H "Authorization: Bearer $NUBESTACK_API_KEY" | jq -r .state)
  echo "$state"
  case "$state" in succeeded|partially_succeeded|failed|cancelled) break ;; esac
  sleep 5
done
```

The operation has `accepted_at`, `started_at`, `completed_at`, who asked (`actor`), the
`resource` it acts on, its `error` if it failed, and each of its `steps` with how the location
answered.

| State | Means | Final? |
|---|---|:-:|
| `queued` | Accepted, waiting its turn | — |
| `running` | The location is doing the work | — |
| `succeeded` | Done | Yes |
| `partially_succeeded` | Some steps finished, others did not; what finished stays | Yes |
| `failed` | The work did not finish; read the failed step | Yes |
| `cancelling`, `cancelled` | It was cancelled before it started | `cancelled` |

A final operation never changes and is never retried by itself. To try again, send the change
again with a **new** idempotency key: that is a new operation.

## Why an accepted change can fail

The API checks what it can before it accepts: the key's roles, the values, and the quota it last
saw. The location has the final word, and can still refuse because the quota was used up at the
same moment, it has no room for that size, it is in maintenance, or the resource changed
meanwhile. Work a location cannot start in time (15 minutes, unless agreed otherwise) fails rather
than landing late.

## Cancel an operation

```bash
curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/operations/op_01jbweb3:cancel" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)"
```

Only a `queued` operation can be cancelled; once it runs, the answer is `409 not_cancellable`.
Nothing is rolled back.

## Find operations

- `GET /v1/orgs/{org_id}/operations`: the organization's operations, newest first.
- `GET …/projects/{project_id}/{collection}/{id}/activity`: every operation on one resource.

## Related

- [Operations (concept)](../concepts/operations.md) · [Errors](errors.md)
- [API reference: Operations](reference/operations.md)
