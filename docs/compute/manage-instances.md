---
methods: true
title: Manage instances
description: Stop, start, reboot, resize, rebuild, rescue and lock instances; open their console and console log; attach networks and volumes; delete them.
---

# Manage instances

Each instance has a **Manage** menu, in the list and on its page. It offers only what the
instance's state allows.

![The Manage menu of an active instance](../assets/screens/compute/instance-manage-menu.webp)

## What you can do in each state

| State | What you can do |
|---|---|
| Active | Stop, Reboot, Pause, Suspend, Shelve, Resize, Create image, Rebuild, Rescue, Lock |
| Stopped | Start, Shelve, Resize, Create image, Rebuild, Rescue, Lock |
| Paused | Resume |
| Suspended | Resume |
| Shelved | Unshelve |
| Rescued | Unrescue |
| Error | Reboot, Rebuild, Rescue |
| Locked | Unlock, and nothing else |

**Rename** and **Delete** are always there, except while the instance is changing. An instance
that is changing (creating, resizing, rebuilding) offers no actions until it settles.

## What each action does

- **Stop** shuts it down. Its disks, addresses and settings stay, and it keeps its place on its
  host. **Start** brings it back.
- **Reboot** restarts it. Programs running on it are interrupted and connections drop.
- **Pause** freezes it in memory; nothing runs until you resume it.
- **Suspend** saves its memory to disk and stops it until you resume it.
- **Shelve** shuts it down and gives up its place on its host. **Unshelve** starts it again, which
  takes longer than a start.
- **Resize** moves it to another size. It restarts on the new size and comes back as it was,
  running or stopped. Quota and capacity are checked first. There is no trial period: to go
  back, resize again. A size with a smaller root disk is refused.

  ![The Resize dialog with the new size](../assets/screens/compute/instance-resize.webp)

- **Rebuild** replaces its system disk with a fresh copy of an image you choose. Everything written
  to that disk is lost. Its addresses, volumes, security groups and SSH key stay.
- **Rescue** restarts it from a fresh copy of its image, with its own disk attached as an extra
  disk you can repair. **Unrescue** starts it from its own disk again.
- **Lock** stops anyone changing or deleting it until someone chooses **Unlock**.
- **Create image** saves its system disk as it is now as one of the project's
  [images](/compute/images.md).

Also in the menu, while the instance is settled:

- **Add public IP** and **Remove public IP**. Removing one detaches it; the address stays allocated
  to the project until you release it under **Public IPs**.
- **Security groups**: choose the groups it is in. The instance accepts the traffic their rules
  allow, on every network it is on. Choosing no groups means it accepts and sends nothing.
- **Attach volume** and **Detach volume**. An attached [volume](/storage/volumes.md) appears inside
  the instance as a new disk to format or mount.
- **Console in Horizon** (on the instance's page): the instance's page in the location's own
  dashboard ([Horizon](/native-access/horizon.md)).

## Networks

On the **Networks** tab, **Attach network** gives the instance an address on another network in
the same location. If its system does not bring a new interface up by itself, bring it up inside
the instance. **Detach network** removes the address at once; the network stays.

![An instance's Networks tab](../assets/screens/compute/instance-networks.webp)

Where the location offers it, an interface can also forward traffic for private ranges behind it,
for a VPN or a router instance: see [Routing](/networking/routing.md#let-an-instance-forward-traffic).

## Metadata

On the **Metadata** tab, choose **Change metadata** to set or remove keys. A key is 1 to 64 letters,
digits, `-` or `_`; a value is at most 255 characters. Keys starting with `nexus` are reserved. The
console cannot list the keys an instance already has; the location's dashboard or
`openstack server show` shows them.

## Open the instance's console

**Open console**, on the instance's page, gives you its screen and keyboard in your browser, as if
a monitor were plugged in: for an instance you cannot reach over the network, or to watch it start.
Project admins and project members can open it while the instance is active or rescued.

1. Choose **Open console**. The location is asked for a console; this takes a few seconds.
2. Choose **Open console ↗**. The console opens in a new browser tab.

The link works once and only for a few minutes: the address itself is the key to the console, so
do not share or bookmark it. It is not kept anywhere. The console closes by itself 10 minutes after
it was opened; choose **Reconnect** for a new one.

## Read the console log

The **Console log** tab shows the last lines the instance wrote to its console: boot messages and
whatever its system and programs printed. Use it to see why an instance does not start or cannot be
reached. It is available while the instance is active or rescued.

![The Console log tab with the number of lines to read](../assets/screens/compute/instance-console-log.webp)

Choose how many lines from the end (50 to 2,000), then **Read log**. The log is shown once, as plain
text, with **Copy** and **Download**; at most the last 100 KB.

!!! warning

    The console log is shown exactly as the instance printed it, which can include passwords, keys and
    other secrets (cloud-init prints host keys, and a generated password if you asked for one). It is
    not stored: leaving the tab clears it.


## Delete an instance

Choose **Delete** from its **Manage** menu and confirm. Its system disk is deleted with it.

![The delete dialog says what stays](../assets/screens/compute/instance-delete.webp)

- Attached volumes, public IPs and security groups stay. The dialog names any volume the location
  is set to delete with the instance, so read it before you confirm.
- Release public IPs you no longer need under **Public IPs**: until then they stay allocated and
  counted in your usage.
- The addresses the instance had on its networks go with it.
- If the instance joined a load balancer's pool when it was created, it is taken out of that pool
  first, so no traffic is sent to its address afterwards. Members you added to a pool yourself are
  not touched: remove those from the pool.
- An instance that belongs to an [instance group](/compute/instance-groups.md) is replaced by the
  group. Lower the group's size instead.

## With the API

`{P}` is `/v1/orgs/{org_id}/projects/{project_id}`, `{id}` the instance's `srv_` ID. Each action is
a `POST` with an `Idempotency-Key`, answered `202 Accepted` with an operation.

| Action | Request | Body |
|---|---|---|
| Stop, start, reboot | `POST {P}/servers/{id}:stop`, `:start`, `:reboot` | none |
| Pause, unpause, suspend, resume | `:pause`, `:unpause`, `:suspend`, `:resume` | none |
| Shelve, unshelve | `:shelve`, `:unshelve` | none |
| Lock, unlock | `:lock`, `:unlock` | none |
| Resize | `:resize` | `{"offering": "large"}` |
| Rebuild | `:rebuild` | `{"image": "ubuntu-24-04"}` or `{"image_id": "img_…"}` |
| Rescue, end rescue | `:rescue`, `:unrescue` | none |
| Save as an image | `:create-image` | the image's name |
| Attach, detach a volume | `:attach-volume`, `:detach-volume` | `{"volume_id": "vol_…"}` |
| Attach, detach a network | `:attach-interface`, `:detach-interface` | the network |
| Security groups | `:set-security-groups` | the whole list of groups |
| Metadata | `:set-metadata` | keys to set (a string) or remove (`null`) |
| Open the console | `:request-console`, then `POST {P}/console-requests/{id}:collect` | a public key |
| Console log | `:request-console-output`, then the same collect | a public key and the number of lines |
| Rename | `PATCH {P}/servers/{id}` | `{"display_name": "web-1b"}` |
| Delete | `DELETE {P}/servers/{id}` | none |

For example, resize:

```bash
curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers/$SERVER:resize" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"offering": "large"}'
```

An action the instance's state does not allow is refused with `409 server_state`. The console and
console log come back encrypted to the public key you send, so only you can open them; an API key
needs the **Open instance consoles** permission for the console. The exact bodies are in the
[API reference](/api/reference/index.md).
