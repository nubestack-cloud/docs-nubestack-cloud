---
title: Create a project
description: Create a project in Karachi or Islamabad, with its quota and a private network ready for instances.
---

# Create a project

A project holds your instances, networks and volumes, and the people who may use them. It runs in
the locations you choose and has its own quota in each.

Skip this page if you already have a role on a project: pick it in **Workspace** at the top of the
console.

## Before you start

- You need to be an owner or admin of the organization. Members can create projects too when the
  organization allows it (**Settings → Members may create projects**).
- Decide where the project runs. Most projects need one location: Karachi (`pak-khi-1`) or
  Islamabad (`pak-isb-1`). See [Locations](../concepts/locations.md).

## Create the project

1. In the organization's side panel, choose **Projects**, then **New project**.

    ![The new project page: name, location, quota preset and network, with a summary on the right](../assets/screens/get-started/new-project.webp)

2. **Name**: how the project is listed, up to 200 characters, for example `web-shop`. Under
   **Advanced**, the **Short name** is filled in from the name: lower-case letters, digits and
   dashes, at most 51 characters, unique in the organization. It appears in addresses and in each
   location's own tools. Neither name can change later.
3. **Location**: where the project runs. Tick **Place it in more than one location** only if you
   need it in both. Each location is an independent cloud: the project gets separate networks,
   volumes, images and quota in each. You can add or remove a location later in the project's
   **Settings**.
4. **Quota preset**: how much the project starts with in each location. Keep the default unless
   an owner or admin told you otherwise. See [Quota](../organization/quota.md).
5. **Set up a network**: leave it on. A private network named `default`, with the range
   `10.0.0.0/24`, is built in each location once the project is ready. To use another private
   range, open **Advanced** and change **Address range**: choose one if you will connect this
   network to another that already uses `10.0.0.0/24`.
6. **Create an Internet gateway (outbound NAT)**: turn it on if your instances should reach the
   Internet or have public IPs. You can [add one later](../networking/internet-gateways.md).
7. Check the summary on the right and choose **Create project**.

The project is ready in each location within a few minutes. Until then the location shows
**setting up**. You become the project's project admin.

!!! info "Projects are made in the console"

    A service account's API key cannot create or delete projects, or add and remove their
    locations. Everything inside a project can be automated; see [API](../api/index.md).

## Give others access

Open the project's **Settings → Access** to give members a project role, or ask an owner or admin
to do it. See [Projects](../organization/projects.md).

## Next

- [Launch your first instance](first-instance.md).
- [Projects and quotas](../concepts/projects-and-quotas.md): how quota is shared out.
