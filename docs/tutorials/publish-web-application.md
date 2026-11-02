---
title: Publish a web application
description: Start an Ubuntu instance that installs Nginx with cloud-init, open ports 80 and 443, and reach it at a public IP.
---

# Publish a web application

Start one Ubuntu instance that installs a web server on its first boot, and reach it from the
Internet at a public IP. It is a starting point for a single-server site; for several instances
behind one address, continue with [Serve an application over HTTPS](https-load-balancer.md).

**You will use:** an instance, an SSH key, a network, an Internet gateway, a security group and a
public IP, all in Karachi.

## Before you start

- A project with a network and an Internet gateway in Karachi, and your SSH key added. The steps
  are in [Launch your first instance](../get-started/first-instance.md), steps 1 and 2.
- A role of project admin or project member.

## 1. Write the cloud-init file

Save this as `cloud-init.yaml`. On its first boot the instance installs Nginx and starts it.

```yaml
#cloud-config
package_update: true
packages:
  - nginx
runcmd:
  - [systemctl, enable, --now, nginx]
```

User data runs once, at the first boot, and can be up to 49,149 bytes. It is passed to the
location once and is not kept or shown again.

## 2. Create the instance

=== "Console"

    1. Under **Compute**, choose **Instances**, then **Create instance**.
    2. **Location** Karachi, **Name** `web-1`, a small **Size** and an Ubuntu **Image**.
    3. **Network**: the project's network. **Public IP**: **A new public IP**.
    4. **Access**: your SSH key. Turn on **Allow web traffic (ports 80 and 443) from anywhere**.
       For SSH, prefer a rule for your own address range in a
       [security group](../networking/security-groups.md) over **Allow SSH from anywhere**.
    5. **User data (cloud-init)**: paste the file's contents.
    6. Check the summary and choose **Create instance**.

=== "API"

    The API takes `user_data` as plain text and encodes it for the location; do not base64 it
    yourself. This builds the body with `jq` so the file's line breaks are kept:

    ```bash
    jq -n --rawfile ud cloud-init.yaml '{
      location: "loc_01jbkhi", display_name: "web-1", offering: "small", image: "ubuntu-24-04",
      network_id: "net_01jbdefault", ssh_key_id: "ssh_01jbayesha", public_ip: true,
      security_group_templates: ["web"], user_data: $ud
    }' > web-1.json

    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      --data-binary @web-1.json
    ```

    `security_group_templates: ["web"]` opens TCP 80 and 443 from anywhere. The answer is
    `202 Accepted`; [follow the operation](../api/operations.md) until it succeeds.

## 3. Check the site

The instance can read **Active** while cloud-init is still installing packages. Give it a minute,
then open the public IP in a browser or with `curl`:

```bash
curl -I http://203.0.113.21/
```

No answer? Log in and wait for cloud-init to finish, then check Nginx:

```bash
ssh ubuntu@203.0.113.21
cloud-init status --wait
systemctl status nginx
```

If the connection times out, check the instance's security groups allow TCP 80 and that the
location has an Internet gateway. See [Troubleshooting](../help/troubleshooting.md).

## 4. Point your domain at it

At your DNS provider, add an `A` record for your domain with the public IP. NubeStack Cloud does
not host DNS. For HTTPS on one instance, install a certificate on the instance itself, for
example with Let's Encrypt; for HTTPS in front of several instances, use a
[load balancer with your certificates](https-load-balancer.md).

## Clean up

Delete the instance, then release its public IP: the address stays allocated, and counted in
your usage, until you release it. See [Launch your first instance](../get-started/first-instance.md#6-clean-up).
