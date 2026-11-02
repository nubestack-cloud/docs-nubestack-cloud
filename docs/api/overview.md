---
title: API overview
---

# API overview

Use the customer API to automate the same projects and resources you manage in the console. Requests use JSON over HTTPS. Most changes to cloud resources return `202 Accepted` and an operation to follow; reads and changes to saved definitions can finish immediately.

## Before you start

`https://api.nubestack.cloud/v1` is a **placeholder base URL**. Use the endpoint NubeStack supplies for your account. In these examples, `NUBESTACK_API` is the origin **without** `/v1`, since each request path includes it.

Set the variables locally. Replace the IDs and secret; do not commit them or paste them into support requests.

```bash
export NUBESTACK_API='https://api.nubestack.cloud'
export NUBESTACK_API_KEY='replace-with-your-api-key'
export ORG='org_example'
export PROJECT='prj_example'
export REQUEST_KEY="$(python3 -c 'import uuid; print(uuid.uuid4())')"
```

Keep `REQUEST_KEY` for retries of **one** request with the same body. Generate a new value for each distinct action. Extra variables such as `SERVER_ID` or `VOLUME_ID` mean the existing resource's ID. `loc_example`, catalog names and resource IDs in the examples must be replaced with real choices returned for your project.

## Your first request

```bash
curl --fail-with-body "$NUBESTACK_API/v1/orgs/$ORG/projects" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY"
```

A successful read returns `200` with JSON. Use the returned IDs for later requests. Discover locations through `GET /v1/orgs/{org_id}/locations` and available sizes and images through `/catalog?location=<location-id>`.

## Make a change

1. Create a [service account and API key](/organization/service-accounts.md) with the required project grant.
2. Read the service's current state, quota and required fields.
3. Send the mutation with a fresh `Idempotency-Key` and, where required, the current `If-Match`.
4. If the response is `202`, follow its `operation.href` to a final result.
5. Read the resulting resource. An accepted request can still fail at the location.

## API guide

- [Authentication](/api/authentication.md): bearer keys, roles and credential lifetime.
- [Requests](/api/requests.md): retries, concurrency and pagination.
- [Operations and polling](/api/operations.md): follow asynchronous work.
- [Errors](/api/errors.md): problem responses and customer error codes.
- [Reference](/api/reference/index.md): generated endpoints, request fields and response schemas.

You can [download the OpenAPI contract](/assets/openapi.json). The checked-in contract supplies the reference; shared permission and conflict responses may apply even when an endpoint's generated response table does not enumerate them.
