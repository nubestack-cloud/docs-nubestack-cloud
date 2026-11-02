---
title: Terraform
description: A NubeStack Cloud Terraform provider is coming later. How to use Terraform's OpenStack provider meanwhile.
---

# Terraform

!!! info "Coming later"

    A NubeStack Cloud Terraform provider is planned, after the [CLI](cli.md). No provider name,
    registry entry or resource syntax is published yet.

## Use meanwhile

Terraform's **OpenStack provider** works against each location, with the same project, quota and
access as the console:

- For a person at a terminal, use the downloaded `clouds.yaml` and its browser sign-in:
  [OpenStack CLI](../native-access/openstack-cli.md#terraform-and-sdks).
- For pipelines, use a
  [service account's cloud credential](../organization/service-accounts.md#get-a-cloud-credential).

What Terraform makes this way appears in the console, marked **outside Nexus**, and counts against
the project's quota. Plan for each location separately: one provider block per location.

## Related

- [Native OpenStack access](../native-access/index.md) · [NubeStack CLI](cli.md)
