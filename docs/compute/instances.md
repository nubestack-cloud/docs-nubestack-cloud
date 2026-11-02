---
title: Instances
description: Create virtual machines in Karachi or Islamabad, with their network, public IP, SSH key, firewall, user data and volumes.
---

# Instances

An **instance** is a virtual machine in one of your project's locations. It keeps its disk, its
addresses and its security groups in that location; nothing about it moves to another.

**Use it for** anything you would run on a server: web and application servers, databases, build
agents, batch jobs. Several instances of the same kind are easier with a
[launch template](/compute/launch-templates.md), and a set kept at a fixed size with an
[instance group](/compute/instance-groups.md).

Find them in a project under **Compute → Instances**. Project admins and project members create,
change and delete instances. Project readers, and the organization's owners, admins and viewers,
see them.

![The instances list: name, location, status, address, size and tags](../assets/screens/compute/instances-list.webp)

## Create an instance

Choose **Create instance**. The page has numbered sections; the summary on the right says what
will be made, and how much of the project's quota in that location it takes.

![The create page filled in: Karachi, web-3, Medium, Ubuntu 24.04, the app network with a new public IP, and an SSH key](../assets/screens/compute/instance-create.webp)

1. **Start from**: your own settings, or [a launch template](/compute/launch-templates.md).
2. **Location**: where the instance runs. Its disk, network and addresses stay there. Sizes,
   images and networks below come from the chosen location.
3. **Name**: how it is listed, up to 255 characters; it is also the name in the location's own
   dashboard. You can rename it later. **Instances** starts 1 to 10 at once, named `name-1`,
   `name-2` and so on ([how several are named](/compute/launch-templates.md#launch-instances)).
4. **Size**: vCPUs, memory and root disk, from the sizes the location offers. A size that would
   exceed the project's quota there is marked. Change it later with
   [Resize](/compute/manage-instances.md#what-each-action-does).
5. **Image**: the operating system it starts from. The location's images come first; your own
   [images](/compute/images.md) follow under **Your images**.
6. **Network**: how it is reached.
   - Choose one of the project's [networks](/networking/networks.md) in that location. With
     **No network** the instance has no network access at all.
   - **Private address (optional)**: leave it empty and the location picks one. To fix one, use an
     address from a range the network keeps for static addresses. If the network hands out no
     addresses itself (DHCP off), you must give one here.
   - **Public IP**: **No public IP** keeps it reachable only from its private network.
     **A new public IP** allocates one with the instance; it stays allocated, and counted in your
     usage, after the instance is deleted, until you release it. **One you have** uses an
     unattached [public IP](/networking/public-ips.md) of the project. A public IP needs an
     [Internet gateway](/networking/internet-gateways.md) in the location.
7. **Access**:
   - **SSH key**: the [key](/compute/ssh-keys.md) copied into the instance so you can log in. With
     **No key** you cannot log in with SSH.
   - **Firewall**: the location's `default` [security group](/networking/security-groups.md) is
     chosen to start with; choose others as well or instead. **Allow SSH (port 22) from anywhere**
     and **Allow web traffic (ports 80 and 443) from anywhere** add only the rules none of the
     chosen groups already has, to the first group you choose. When that is `default`, the rule
     applies to every instance of the project in that location that uses `default`. With no group
     chosen, a group named `<project>-access` is made for the rules. The page says which group gets
     which rule before you create.
   - **User data (cloud-init)**: a script or cloud-init document the instance runs at its first
     start, up to 49,149 bytes. It is passed once to the location and is not kept or shown again.
8. **Server group** (optional): a [server group](/compute/server-groups.md) of this location, to
   keep the instance on a different host from the group's others, or on the same one. It joins the
   group now and cannot join, leave or change group later.
9. **Volumes** (optional): up to 8 data disks, attached in the order listed once the instance runs.
   - **Existing volumes**: [volumes](/storage/volumes.md) of the project in this location that are
     available and attached to nothing.
   - **New volumes**: choose **Add a new volume**, then its name, size in GiB and type. New
     volumes are made empty, before the instance, and count against the project's volume quota.

   If a volume cannot be attached, the instance and every volume are kept, the operation says
   **partially succeeded**, and you can attach the volume from its menu.
10. **Load balancer** (optional): a pool of one of the project's
    [load balancers](/networking/load-balancers.md) in this location, and the port the instance
    serves on. Once the instance runs it joins the pool at its private address on the network you
    chose. If that fails, the instance stays and the operation says **partially succeeded**.
11. **Tags** (optional): [labels](/concepts/tags.md) such as `env: prod`.

Choose **Create instance**. The page shows **Instance requested**; the instance appears in the
list as **Creating**, then **Active**. **Save as launch template** keeps these settings to launch
again later. **View the API request** shows the exact request the page will send.

## Find an instance

The list shows each instance's location, status, address, size and tags. Type in **Find by name,
ID or address**, or filter by location, state or tag. Instances made with the location's own tools
are listed too.

Open an instance for its page:

![An instance's page: addresses, size, image, its group, template, server group, SSH key and load balancer](../assets/screens/compute/instance-detail.webp)

| Tab | What it has |
|---|---|
| **Overview** | Status, size, image, addresses, security groups, disks, and links to its instance group, launch template, server group, SSH key and load balancers |
| **Networks** | The networks it is on, with their addresses; attach and detach networks |
| **Tags** | Its tags |
| **Metadata** | Set and remove metadata keys |
| **Console log** | What the instance printed while it started and ran |
| **Schedules** | Backup and power [schedules](/storage/schedules.md) acting on it |
| **Activity** | Every operation on it |

Next: [Manage instances](/compute/manage-instances.md): stop, start, resize, rebuild, consoles and
deleting.

## With the API

`{P}` is `/v1/orgs/{org_id}/projects/{project_id}`. Every request sends
`Authorization: Bearer $NUBESTACK_API_KEY`; see [Authentication](/api/authentication.md).

```bash
curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
        "location": "loc_…",
        "display_name": "web-3",
        "offering": "medium",
        "image": "ubuntu-24-04",
        "network_id": "net_…",
        "public_ip": true,
        "ssh_key_id": "ssh_…",
        "security_group_ids": ["sgr_…"],
        "security_group_templates": ["ssh", "web"],
        "volumes": [{"new": {"display_name": "web-3-data", "size_gb": 20, "volume_type": "standard"}}],
        "tags": {"env": "prod"}
      }'
```

The answer is `202 Accepted`:

```json
{
  "operation": { "id": "op_…", "state": "queued", "href": "/v1/orgs/org_…/operations/op_…" },
  "server": { "id": "srv_…", "href": "/v1/orgs/org_…/projects/prj_…/servers/srv_…" }
}
```

Follow the operation until it finishes ([Operations and polling](/api/operations.md)). The instance's
ID is fixed from the start. `offering` and `image` are names from the location's catalog
(`GET /v1/orgs/{org_id}/catalog?location=loc_…`); use `image_id` instead for one of your own
images. To start several at once, use `POST {P}/instance-launches` with `count`
([Launch templates](/compute/launch-templates.md#with-the-api)).

| What | Request |
|---|---|
| List, read | `GET {P}/servers`, `GET {P}/servers/{id}` |
| What it is attached to | `GET {P}/servers/{id}/related` |
| Its operations | `GET {P}/servers/{id}/activity` |

## Good to know

- Instances made with a location's own dashboard, CLI or Terraform count against the same quota
  and can be managed here like any other. Their page says **Created by: outside Nexus**.
- A stopped instance still counts instance hours, its disks and its public IPs; its vCPU and RAM
  hours stop. See [Usage and costs](/concepts/usage-and-costs.md).
- Not offered: starting an instance from a volume (instances start from an image), and moving an
  instance to another location.
