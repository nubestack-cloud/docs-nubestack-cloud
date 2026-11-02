---
title: Automate with the API
description: Give a script its own service account and API key, create a volume, wait for its operation, and clean up, safely retrying on network errors.
---

# Automate with the API

Write a small script that creates a volume, waits for it, and deletes it again. It shows the three
habits every NubeStack Cloud integration needs: its own identity, an idempotency key per change,
and following the operation to its end.

**You will use:** a service account, an API key, `curl` and `jq`.

## 1. Give the script its own identity

An owner or admin:

1. Creates a [service account](../organization/service-accounts.md) `ci-deploy`, role **Member**.
2. Gives it **Project member** on `web-shop` (**Settings → Access → Grant access**).
3. Chooses **Issue an API key**, 90 days, and stores the key in your CI's secret store as
   `NUBESTACK_API_KEY`.

## 2. Find the IDs

```bash
export NUBESTACK_API="https://api.nubestack.cloud"   # placeholder: your API address
api() { curl -sS --fail-with-body -H "Authorization: Bearer $NUBESTACK_API_KEY" "$@"; }

ORG=$(api "$NUBESTACK_API/v1/me" | jq -r '.memberships[0].organization.id')
PROJECT=$(api "$NUBESTACK_API/v1/orgs/$ORG/projects" | jq -r '.items[] | select(.slug=="web-shop") | .id')
KHI=$(api "$NUBESTACK_API/v1/orgs/$ORG/locations" | jq -r '.items[] | select(.slug=="pak-khi-1") | .id')
```

Read sizes, images and volume types from the catalog rather than hard-coding them:
`GET /v1/orgs/$ORG/catalog?location=$KHI`.

## 3. Make one change, safely

Choose the idempotency key **once** per change, and reuse it if you have to send the same request
again after a network error. A new key per retry could create two volumes.

<figure class="ns-diagram">
--8<-- "idempotency.svg"
<figcaption>One key per change, reused for every retry of that change.</figcaption>
</figure>

```bash
KEY=$(uuidgen)
BODY=$(jq -n --arg loc "$KHI" '{location: $loc, display_name: "ci-scratch", size_gb: 10}')

for attempt in 1 2 3; do
  if RESP=$(api -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/volumes" \
        -H "Idempotency-Key: $KEY" -H "Content-Type: application/json" -d "$BODY"); then
    break
  fi
  sleep $((attempt * 5))
done

OP=$(echo "$RESP" | jq -r .operation.id)
VOL=$(echo "$RESP" | jq -r .volume.id)
```

## 4. Wait for the operation

<figure class="ns-diagram">
--8<-- "operation-lifecycle.svg"
<figcaption>Acceptance and completion are separate. Keep the operation ID so a restarted script can carry on waiting.</figcaption>
</figure>

```bash
deadline=$((SECONDS + 600))
while :; do
  STATE=$(api "$NUBESTACK_API/v1/orgs/$ORG/operations/$OP" | jq -r .state)
  case "$STATE" in
    succeeded) echo "volume $VOL ready"; break ;;
    partially_succeeded|failed|cancelled)
      api "$NUBESTACK_API/v1/orgs/$ORG/operations/$OP" | jq '.error, .steps'; exit 1 ;;
  esac
  [ $SECONDS -lt $deadline ] || { echo "still $STATE after 10 minutes"; exit 1; }
  sleep 5
done
```

A timeout in your script is not a cancellation: the operation goes on. Read it again before you
make another change.

## 5. Clean up

```bash
api -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/volumes/$VOL" \
  -H "Idempotency-Key: $(uuidgen)" | jq .operation
```

## Habits to keep

- One service account per pipeline, with only the projects and roles it needs.
- On `429`, wait the seconds in `Retry-After`. On `412`, read the resource again before you retry.
- Match errors on `code`, never on the message. See [Errors](../api/errors.md).
- Log `request_id` and operation IDs; they are what support needs.
- Rotate the key before it expires.

## Related

- [API](../api/index.md) · [Requests](../api/requests.md) · [Operations](../api/operations.md)
