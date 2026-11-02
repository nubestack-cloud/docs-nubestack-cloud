---
title: OpenStack CLI
---

# OpenStack CLI

Use the OpenStack CLI to work directly with one location's resources. A person's connection file uses browser device sign-in and contains no password or bearer token.

## Install and download settings

Install the OpenStack client in an isolated Python environment. The device sign-in plugin requires `keystoneauth1` 5.2 or later.

```bash
python3 -m venv .venv-openstack
. .venv-openstack/bin/activate
python -m pip install python-openstackclient 'keystoneauth1>=5.2'
```

1. Open your project's **Consoles and CLI** page.
2. Download **clouds.yaml** for the location you need.
3. Put the downloaded configuration at `~/.config/openstack/clouds.yaml`, merging its entries with an existing file rather than overwriting other clouds.
4. Use the entry name shown in that file. For example, if it is `acme-web-shop-pak-khi-1`:

```bash
openstack --os-cloud acme-web-shop-pak-khi-1 server list
```

## Approve device sign-in

The command prints a verification link and code. Open the link in your browser, sign in, select the organization and approve the request. Return to the terminal; the command continues with the selected project's resources.

Only approve a request you initiated. Do not send the device code to someone else. The generated configuration uses `auth_type: v3oidcdeviceauthz`; keep its supplied endpoints and project ID rather than inventing them from a location name.

## Check context before changing resources

```bash
openstack --os-cloud acme-web-shop-pak-khi-1 network list
openstack --os-cloud acme-web-shop-pak-khi-1 volume list
```

These commands read the same project and location used by the console. Native creates consume the same quota and become visible after the next inventory read or a console **Refresh**. A command against another cloud entry acts on that entry's project; review it before destructive work.

## Automation and troubleshooting

Device sign-in is interactive. For unattended jobs, create a [service-account native credential](../organization/service-accounts.md#native-credentials), protect its one-time secret and track its expiry.

If the CLI does not recognize `v3oidcdeviceauthz`, verify the client is using the environment where the required authentication library was installed. If sign-in succeeds but access is refused, check the organization and project grant. A NubeStack customer API key is not a substitute for an OpenStack credential.
