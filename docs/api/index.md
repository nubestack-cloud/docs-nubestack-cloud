---
title: API
description: Automate NubeStack Cloud with its REST API. Set up an API key, make your first request, and learn the conventions every request follows.
---

# API

The NubeStack Cloud API does everything inside a project that the console does: instances,
networks, volumes, load balancers, certificates and the rest. It is JSON over HTTPS, versioned
under `/v1`. Changes that run in a location answer at once with `202 Accepted` and an
[operation](operations.md) to follow.

<div class="grid cards" markdown>

-   :material-key-outline:{ .lg .middle } **[Authentication](authentication.md)**

    ---

    Service accounts, API keys, what a key may do, rotation.

-   :material-swap-horizontal:{ .lg .middle } **[Requests](requests.md)**

    ---

    IDs, idempotency keys, versions and `If-Match`, lists and pages.

-   :material-progress-clock:{ .lg .middle } **[Operations](operations.md)**

    ---

    Follow a change from `202 Accepted` to its final state.

-   :material-alert-circle-outline:{ .lg .middle } **[Errors](errors.md)**

    ---

    Problem responses, retrying, and every error code.

-   :material-book-open-variant:{ .lg .middle } **[API reference](reference/index.md)**

    ---

    Every operation with its parameters, bodies and responses.

-   :material-script-text-outline:{ .lg .middle } **[Tutorial: automate with the API](../tutorials/automate-with-api.md)**

    ---

    A script that creates a network and an instance, waits, and cleans up.

</div>

## Before you start

1. An owner or admin creates a [service account](../organization/service-accounts.md) and gives it
   a role on the project.
2. They issue an **API key** for it and give it to you through a secret store.
3. You set these variables in your shell. The address is a placeholder: use the one NubeStack gives
   you, without `/v1`.

```bash
export NUBESTACK_API="https://api.nubestack.cloud"   # placeholder: your API address
export NUBESTACK_API_KEY="nxk_…"                      # from your secret store, never in a file you commit
```

## Your first request

```bash
curl -sS "$NUBESTACK_API/v1/me" -H "Authorization: Bearer $NUBESTACK_API_KEY"
```

The answer says who the key belongs to and its organization's ID (`org_…`). Every other path
starts with that organization. Set it, then list the projects the key can see:

```bash
export ORG="org_01jbacme"
curl -sS "$NUBESTACK_API/v1/orgs/$ORG/projects" -H "Authorization: Bearer $NUBESTACK_API_KEY"
export PROJECT="prj_01jbwebshop"
```

Locations come from `GET /v1/orgs/$ORG/locations` (each `loc_…` ID with its code, such as
`pak-khi-1`), and each location's sizes, images and other choices from
`GET /v1/orgs/$ORG/catalog?location=loc_…`.

!!! info "IDs in these docs"

    Real IDs are a prefix and a longer unique code, for example `srv_01jbweb100000000000000001`. The
    examples shorten them, as in `srv_01jbweb1`. Use the IDs your requests return.

## Make a change

```bash
curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/volumes" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"location": "loc_01jbkhi", "display_name": "data-1", "size_gb": 50}'
```

```json
{
  "operation": {"id": "op_01jbvol1", "state": "queued", "href": "/v1/orgs/org_01jbacme/operations/op_01jbvol1"},
  "volume": {"id": "vol_01jbdata1", "href": "/v1/orgs/org_01jbacme/projects/prj_01jbwebshop/volumes/vol_01jbdata1"}
}
```

Then [follow the operation](operations.md) until it succeeds. Every service page has the same
change in its **API** tab.

## What the API does not do

- Create or delete projects, add or remove their locations, or manage members, roles, keys and
  settings. A service account's key cannot; people do these in the console.
- Sign a person in from a script. Use a service account's API key.
- Anything a location's own OpenStack API does directly. For that, use
  [native access](../native-access/index.md).
- Prices and invoices beyond the provisional [usage and statements](../organization/statements-and-costs.md).

## The contract

The API is described by an OpenAPI 3.1 contract: [download it](../assets/openapi/v1.json) for your
own tools and client generators. The [reference](reference/index.md) is rendered from it.
