---
title: OpenStack CLI
description: Use the OpenStack CLI, SDKs and Terraform with a clouds.yaml that holds no secrets and a sign-in in your browser.
---

# OpenStack CLI

Use the OpenStack CLI, the OpenStack SDKs and Terraform's OpenStack provider against each
location, signed in as you. The `clouds.yaml` file you download holds no password or token; each
command signs you in through your browser when it needs to.

## Before you start

- A project role on the project.
- The OpenStack client with `keystoneauth1` 5.2 or later, which recent client releases include:

    ```bash
    python3 -m pip install python-openstackclient
    ```

## Set it up

1. In the project, open **Settings → Consoles and CLI** and choose **Download clouds.yaml**. The
   file has an entry for the project, named `<organization>-<project>-<location>`, for example
   `acme-web-shop-pak-khi-1`.
2. Save it as `~/.config/openstack/clouds.yaml`, or merge its entries into the one you have.

The entries use `auth_type: v3oidcdeviceauthz`. The file is safe to keep: it holds no secret.

## Run a command

```bash
openstack --os-cloud acme-web-shop-pak-khi-1 server list
```

The command prints a link and a code. Open the link in your browser, sign in to NubeStack Cloud if
asked, choose the organization, give your second factor and allow access. The command then carries
on.

## Connection details

**Connection details**, beside the location under **Consoles and CLI**, shows the same settings
one by one, for tools that do not read `clouds.yaml`: the sign-in address (Keystone endpoint),
region, identity provider, protocol, CLI client and the project's ID in that location.

## Terraform and SDKs

Terraform's OpenStack provider and the Python SDK read the same `clouds.yaml`:

```hcl
provider "openstack" {
  cloud = "acme-web-shop-pak-khi-1"
}
```

The device sign-in needs a person at a browser. For pipelines and other unattended tools, use a
[service account's cloud credential](../organization/service-accounts.md#get-a-cloud-credential):
an application credential for one project in one location.

## Good to know

- What you make with the CLI appears in the console within about an hour, or at once after
  **Refresh**, marked **outside Nexus**, and counts against the same quota.
- One organization at a time: to switch, sign out and wait three minutes, or start a fresh
  session in a private browser window.
- The [NubeStack CLI](../tools/cli.md), `nexus`, works with NubeStack Cloud's own API instead:
  projects, instances and the rest, the same as the console.

## Related

- [Horizon](horizon.md) · [Native OpenStack access](index.md)
