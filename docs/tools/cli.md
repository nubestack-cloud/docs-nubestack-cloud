---
title: NubeStack CLI
description: The nexus command-line tool for NubeStack Cloud. Install it, sign in with your account or a service account's API key, and manage projects, instances, networks and the rest.
---

# NubeStack CLI

`nexus` is the command-line tool for NubeStack Cloud: projects, instances, volumes, networks and
the rest, through the [NubeStack Cloud API](../api/index.md). You sign in with your own account
through the browser; scripts and pipelines use a
[service account's](../organization/service-accounts.md) API key. The
[Terraform provider](terraform.md) takes the same sign-in.

It is not the OpenStack CLI. For a location's own tools, see
[OpenStack CLI](../native-access/openstack-cli.md).

## Install

`nexus` is one file with nothing else to install, for Linux and macOS on x86-64 (`amd64`) and
ARM (`arm64`). Each archive, `nexus_<version>_<os>_<arch>.tar.gz`, comes with a `SHA256SUMS`
file. Ask [support](../help/support.md) for the download address until it is listed here.

```bash
sha256sum --check --ignore-missing SHA256SUMS
tar -xzf nexus_<version>_linux_amd64.tar.gz
sudo install nexus /usr/local/bin/
nexus --version
```

## Sign in with your account

You need the API's address, which NubeStack gives you. The examples use a placeholder.

```console
$ nexus login --url https://api.nubestack.cloud
Opening your browser to sign in. If it does not open, go to:

  https://…

Signed in to Acme (org_…) as profile default; the session is kept in your keychain
```

Sign in in the browser as you do in the console, with your second factor. The browser then
returns to `nexus` on your computer, and you can close the tab. If you belong to several
organizations, `nexus` lists them; run the command again with `--org org_…`.

On a computer you reach over SSH, forward a port when you connect and give `nexus` the same port,
then open the address it prints in your own browser:

```console
$ ssh -L 8765:127.0.0.1:8765 server
server$ nexus login --url https://api.nubestack.cloud --port 8765
```

- **Where the session is kept**: in your system's keychain, or where there is none, in a file
  readable by you alone. `nexus` refuses a session file others can read and says how to fix it
  (`chmod 600`).
- **How long it lasts**: each command renews it. It ends after about 30 minutes without a
  command, or 10 hours after you signed in; then `nexus` says `sign in again: nexus login`.
- **Sign out** with `nexus logout`.
- **What stays in the console**: issuing API keys, getting cloud credentials, deleting projects,
  making someone an owner and other changes that need a fresh second factor. `nexus` answers those
  with `console_sign_in_required`.

## Sign in with a service account's key

For a script or a pipeline, use an API key of a service account with access to your projects,
and your organization's ID, `org_…`. Pass them as environment variables: `NEXUS_URL`,
`NEXUS_ORG`, `NEXUS_API_KEY`, and optionally `NEXUS_PROJECT`.

To save the key in a profile instead, use `--with-api-key`. The key is read from the terminal
without showing it, or from standard input, never from the command line:

```console
$ nexus login --with-api-key --url https://api.nubestack.cloud --org org_…
API key (nxk_…):
Signed in to Acme (org_…) as profile default; saved in ~/.config/nexus/config.toml
```

A profile holds one sign-in. Several organizations each get one (`nexus login --profile staging
…`); choose one with `--profile` or `nexus profile use`.

## Work with a project

Signed in with your account, you can create the projects your role allows. A project lives in one
location:

```console
$ nexus location list
$ nexus project create --slug web-shop --name web-shop --location loc_… --wait
```

A service account cannot create projects. Then, with your account or a key:

```console
$ nexus project list
$ export NEXUS_PROJECT=prj_…
$ nexus network create --name app --location loc_… --routed --wait
$ nexus security-group create --name web --location loc_… --template web --wait
$ nexus server create --name web-1 --location loc_… --offering small --image ubuntu-24-04 \
    --network net_… --security-group sgr_… --user-data-file cloud-init.yaml --wait
$ nexus server list
```

`--location` is the project's location. `nexus <resource> create --help` lists every flag; for a
field with no flag, put it in a JSON file and pass `--body-file`.

Every create page in the console shows its change as code: fill in the form, then choose
**Equivalent code** under the summary for the `nexus` command.

## Waiting and exit codes

Every change is accepted first and carried out after ([Operations](../concepts/operations.md)).
Without `--wait`, a command prints the operation and returns at once; `nexus operation wait op_…`
follows it later. With `--wait` it returns when the change has finished.

| Exit code | Meaning |
|---|---|
| 0 | Done |
| 1 | The API refused the request, or did not answer |
| 2 | A mistake in the command or the configuration |
| 3 | Not found, or not yours to see |
| 4 | The change ended `failed`, `partially_succeeded` or `cancelled` |
| 5 | `--wait` ran out of time; the change carries on |

A refusal prints its code, for example `Error: quota_exceeded: … (HTTP 409, request req_…)`;
[Errors](../api/errors.md) explains each code. Lists print a table; `-o json` and `-o yaml` print
every item for scripts. Each change is sent with an `Idempotency-Key`, and a request whose answer
was lost is sent again with the same key, so it is never carried out twice.

## Any API call

`nexus api` calls any route of the [API reference](../api/reference/index.md). In the path,
`{org}` is your organization and `{project}` your project:

```console
$ nexus api GET /v1/orgs/{org}/usage
```

## Related

- [Terraform](terraform.md) · [API](../api/index.md) · [Service accounts and API keys](../organization/service-accounts.md)
