---
title: Terraform
description: Manage NubeStack Cloud projects, networks, instances, load balancers and access from Terraform or OpenTofu with the nexus provider.
---

# Terraform

The Terraform provider `nexus` manages NubeStack Cloud from Terraform or OpenTofu, through the
same API as the console. It takes the same settings as the [NubeStack CLI](cli.md): its `url`,
`org` and `api_key` arguments, the `NEXUS_URL`, `NEXUS_ORG` and `NEXUS_API_KEY` environment
variables, or a CLI `profile`, including one signed in with your account.

## Set up

Ask [support](../help/support.md) where the provider's release is published. Until it is in a
registry, put the `terraform-provider-nexus` archive in a
[local mirror](https://developer.hashicorp.com/terraform/cli/config/config-file#explicit-installation-method-configuration).

```hcl
terraform {
  required_providers {
    nexus = { source = "nexus/nexus" }
  }
}

provider "nexus" {}   # NEXUS_URL, NEXUS_ORG and NEXUS_API_KEY from the environment

data "nexus_project" "shop" { slug = "web-shop" }
data "nexus_location" "khi" { slug = "pak-khi-1" }

resource "nexus_network" "app" {
  project_id      = data.nexus_project.shop.id
  location        = data.nexus_location.khi.id
  display_name    = "app"
  cidr            = "10.0.2.0/24"
  internet_access = true
}

resource "nexus_server" "web" {
  project_id   = data.nexus_project.shop.id
  location     = data.nexus_location.khi.id
  display_name = "web-1"
  offering     = "small"
  image        = "ubuntu-24-04"
  network_id   = nexus_network.app.id
  user_data    = file("cloud-init.yaml")
  tags         = { env = "prod" }
}

resource "nexus_public_ip" "web" {
  project_id = data.nexus_project.shop.id
  location   = data.nexus_location.khi.id
  server_id  = nexus_server.web.id
}
```

`location` is always the project's location. The create pages' **Equivalent code** shows the
Terraform for instances, volumes, networks and security groups.

## Resources

`nexus_project`, `nexus_network`, `nexus_security_group`, `nexus_security_group_rule`,
`nexus_server`, `nexus_volume`, `nexus_volume_attachment`, `nexus_public_ip`,
`nexus_load_balancer` with `nexus_load_balancer_listener`, `nexus_load_balancer_pool` and
`nexus_load_balancer_members`, `nexus_launch_template`, `nexus_instance_group`,
`nexus_service_account` and `nexus_project_grant`. Data sources: `nexus_location`,
`nexus_project`, and one for each kind of resource by ID or name.

## How it behaves

- **Apply waits** for each change's operation, 30 minutes by default (a `timeouts` block changes
  that). A create that fails keeps its ID, so the next apply replaces it rather than leaving it
  behind.
- **In place**: names, a bigger volume (while it is not attached), an instance's size and security
  groups, what a public IP points at, and tags. Anything else replaces the resource.
- **Tags are read back**: tags changed in the console show in the next plan.
- **Import** by ID: `terraform import nexus_server.web prj_…/srv_…`.
- `nexus_project` takes one `location`; changing it replaces the project. It needs a sign-in
  allowed to create projects, which a service account is not: use `data "nexus_project"` with a
  key, or a profile signed in with your account. Deleting a project is done in the console.
- `nexus_service_account` and `nexus_project_grant` need you signed in with your own account. The
  provider does not make API keys: issue them in the console, so a key never reaches Terraform's
  state.
- An HTTPS listener's certificates and a pool's health check are set with the CLI or in the
  console for now.

## The OpenStack provider

Terraform's OpenStack provider also works against each location, with your project's `clouds.yaml`
or a service account's cloud credential. See
[OpenStack CLI](../native-access/openstack-cli.md#terraform-and-sdks). What it makes appears in the
console marked **outside Nexus**.

## Related

- [NubeStack CLI](cli.md) · [Native OpenStack access](../native-access/index.md)
