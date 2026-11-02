---
title: Automate a cloud change
---

# Automate a cloud change

Give a script its own identity, make one intentional cloud change and follow its final result. This workflow uses the customer API; it does not install or operate the cloud platform.

## Set up the identity

Create a [service account](../organization/service-accounts.md) for the application. Grant the required project access, issue an expiring API key and put its one-time secret in your automation's secret store. An organization role alone does not grant workload changes.

Use [the API setup variables](../api/index.md#before-you-start). The API address shown in the docs is a placeholder until NubeStack supplies your actual endpoint. Keep the origin without `/v1` in `NUBESTACK_API` because the request paths already include it.

## Discover the choices

Read the project's current resources and chosen location's catalog:

```bash
curl --fail-with-body "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY"
```

Get locations through `/v1/orgs/$ORG/locations` and offerings through `/v1/orgs/$ORG/catalog?location=<location-id>`. Do not hard-code a size, image or network copied from a documentation screenshot.

## Submit exactly one change

Use the [instance create example](../compute/instances.md) or [volume example](../storage/volumes.md) with IDs from your own project. Generate an idempotency key before the first attempt, and keep the same key and body if a network failure makes the response uncertain.

A matching replay returns the original outcome. Generating a fresh key after every timeout risks a second resource. A changed intended request needs a new key.

<figure class="docs-diagram">
<div>
<!-- diagram: operation-lifecycle -->
</div>
<figcaption>Acceptance and completion are separate. Save the operation ID so you can resume checking after a client interruption.</figcaption>
</figure>

## Follow the result

Save `operation.id` and `operation.href` from a `202` response. Poll the trusted API origin at that path, wait between reads, and honor `Retry-After` when present. Stop at a final state.

- `succeeded`: read the resource and verify the state your next step needs.
- `partially_succeeded`: inspect the steps and retain the successful resource IDs for repair or cleanup.
- `failed` or `cancelled`: inspect the reason and what remains before a new request.

Use a bounded polling deadline, but do not interpret your client's timeout as cancellation. Resume reading the saved operation before making another change. Schedule or group creation may return a saved definition immediately; consult the endpoint's actual status.

## Handle changes and cleanup

For versioned resources, read the current ETag and send `If-Match` on updates. Refresh and review on `412`; do not bypass the check. Follow cursor pagination instead of assuming the first resource page is complete.

On cleanup, use each resource's documented delete action with its required headers and inspect the operation. Rotate credentials before expiry, revoke unused keys, and include request and operation IDs in redacted support reports. Never log bearer keys or one-time secrets.
