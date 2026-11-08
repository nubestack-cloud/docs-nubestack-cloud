---
title: Create a project
description: Create a project in Karachi or Islamabad, with its quota and a private network ready for instances.
---

# Create a project

A project holds your instances, networks and volumes, and the people who may use them. It runs in
one location, chosen when you create it, and has its own quota there.

Skip this page if you already have a role on a project: choose it in the scope selector at the
top of the console.

## Before you start

- You need to be an owner or admin of the organization. Members can create projects too when the
  organization allows it (**Settings → General → Members may create projects**).
- Decide where the project runs: Karachi (`pak-khi-1`) or Islamabad (`pak-isb-1`). The location
  never changes. To run in both, create a project in each. See
  [Locations](../concepts/locations.md).

## Create the project

1. Open the scope selector at the top and choose **New project here** under Karachi (or
   Islamabad). You can also start from the organization's **Settings → Projects → New
   project**.

    ![The new project page: name, location, quota preset and network, with a summary on the right](../assets/screens/get-started/new-project.webp)

2. **Project name**: how the project is listed, up to 200 characters, for example `web-shop`.
   Under **Advanced**, the **Short name** is filled in from the name: lower-case letters, digits
   and dashes, at most 51 characters, unique in the organization. It appears in addresses and in
   the location's own tools. Neither name can change later.
3. **Location**: where the project runs. The one you chose in the scope selector is picked
   already.
4. **Quota preset**: how much the project starts with. Keep the default unless an owner or admin
   told you otherwise. See [Quota](../organization/quota.md).
5. **Network**: leave **Set up a network** on. A private network named `default`, with the range
   `10.0.0.0/24`, is built once the project is ready. To use another private range, open
   **Advanced** and change **Address range**; do so if you will connect this network to another
   that already uses `10.0.0.0/24`.
6. **Create an Internet gateway (outbound NAT)**: turn it on if your instances should reach the
   Internet or have public IPs. You can [add one later](../networking/internet-gateways.md).
7. Check the summary on the right and choose **Create project**.

The project opens. It is ready within a few minutes; until then its location shows **setting
up**. You become the project's project admin.

!!! info "Projects are made in the console or the CLI"

    A service account's API key cannot create or delete projects. People create them in the
    console, or with the [NubeStack CLI](../tools/cli.md) signed in as themselves. Everything
    inside a project can be automated; see [API](../api/index.md).

## Give others access

In the project, open **IAM → People** and choose **Give access** to give someone a project role.
See [Projects](../organization/projects.md#who-can-use-a-project).

## Next

- [Launch your first instance](first-instance.md).
- [Projects and quotas](../concepts/projects-and-quotas.md): how quota is shared out.
