---
title: Operations and polling
---

# Operations and polling

A `202 Accepted` response records work that will run in a location. It is not proof that the requested resource is ready. The response includes an operation and usually the resource's ID and link.

```json
{
  "operation": {
    "id": "op_example",
    "state": "queued",
    "href": "/v1/orgs/org_example/operations/op_example"
  },
  "server": {
    "id": "srv_example",
    "href": "/v1/orgs/org_example/projects/prj_example/servers/srv_example"
  }
}
```

## Poll to a final result

1. Save the operation ID and `href` from the acceptance response.
2. Request that link on your API origin, with the same authorization.
3. While it is queued or running, wait a few seconds before another request. Honor `Retry-After` if supplied, and use a bounded deadline in automation.
4. On a final state, inspect the result and failed steps. Read the resource to verify the state you need before a dependent action.

```bash
curl --fail-with-body \
  "$NUBESTACK_API/v1/orgs/$ORG/operations/$OPERATION_ID" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY"
```

Only follow links returned by the API on the configured trusted API origin. Do not send your bearer key to a URL obtained from an untrusted source.

## States

| API state | Meaning |
|---|---|
| `queued` | Waiting to start |
| `running` | Work is in progress |
| `succeeded` | All required steps finished |
| `partially_succeeded` | Some work succeeded; inspect retained resources and failed steps |
| `failed` | Work failed; inspect the problem and steps |
| `cancelling` | Cancellation is being applied |
| `cancelled` | Work was cancelled; completed work remains |

A terminal operation is not retried automatically. Fix the cause, inspect what remains and issue a new request with a new idempotency key if you still want the change. A timeout in your polling client is not evidence that the operation stopped; read the saved operation again before resubmitting work.

## Cancellation

Where allowed, `POST /v1/orgs/{org_id}/operations/{operation_id}:cancel` requests cancellation with an idempotency key. Only cancellable work can be stopped. It does not roll back completed steps or automatically clean up resources that were created.

## Saved definitions

Creating a schedule, launch template or instance group can return a resource immediately rather than `202`. A group's saved settings may trigger multiple later operations as its members converge on the desired count. Inspect its state and members, rather than waiting for an operation field that the endpoint does not return.

The [console operations guide](../concepts/operations.md) explains activity links, partial results and failed-create cleanup.
