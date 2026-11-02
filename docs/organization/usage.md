---
methods: true
title: Usage
---

# Usage

Usage measures allocated resources over time. Open the organization's **Usage** page, or a project's **Quota and usage** page for a narrower view. Usage quantities are different from money amounts in the cost explorer.

![Usage quantities and source freshness](../assets/screens/organization/usage.webp)

## Read the report

Choose the period and grouping offered on the page. Review the unit next to each quantity: instance hours, vCPU hours, memory GiB-hours, volume GiB-hours and public-IP hours describe different things and must not be added together as a total.

Check each source's freshness and partial-data notices. If a location has not supplied a recent observation, a number can be incomplete or bounded. A blank or unavailable value is not proof of zero usage.

!!! note "Provisional"

    Usage and cost reporting are provisional. Values can change when observations arrive or are corrected. This page is not a final invoice and does not initiate payment.

## What continues counting

A stopped instance retains its allocated instance, disks and public addresses. Its vCPU and memory hours stop, but other allocated resources continue to count. A detached public IP remains allocated until released. Unattached volumes also remain allocated storage.

Deleting a resource stops its future usage after the deletion completes; it does not erase past usage. Changes made through Horizon or native tools count in the same project and location.

## With the API

```bash
curl --fail-with-body "$NUBESTACK_API/v1/orgs/$ORG/usage" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY"
```

The project view is `GET /v1/orgs/{org_id}/projects/{project_id}/usage`. Read `provisional`, source status, unit and freshness fields with the quantities. Supported time and grouping parameters are listed in [the reference](/api/reference/index.md).

For monetary estimates, unrated usage and the rate card, see [Statements and cost explorer](/organization/statements-and-costs.md). Use [tags](/concepts/tags.md) to make later cost grouping easier to interpret.
