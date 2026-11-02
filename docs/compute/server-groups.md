---
title: Server groups
---

# Server groups

A server group controls whether instances run on the same physical host or on different hosts in one location. Use a group to spread application replicas or keep a tightly coupled workload together. A server group does not keep a desired number of instances running; use an [instance group](/compute/instance-groups.md) for that.

![Server groups with their policy and member count](../assets/screens/compute/server-groups.webp)

## Create a server group

1. Open **Compute → Server groups → Create server group**.
2. Choose a location and name, such as `web-spread`.
3. Select a policy.
4. For strict anti-affinity, optionally set the maximum instances allowed per host.
5. Create the group and follow the operation.

![Create a group with an instance distribution policy](../assets/screens/compute/server-group-create.webp)

| Policy | Behavior |
|---|---|
| Anti-affinity | Use different hosts; a launch fails if the rule cannot be met |
| Affinity | Use the same host; a launch fails if the rule cannot be met |
| Soft anti-affinity | Prefer different hosts, allowing a launch when that is unavailable |
| Soft affinity | Prefer the same host, allowing a launch when that is unavailable |

These policies refer to hosts within a location. They do not create separate availability zones or put instances in another location.

## Launch instances in the group

Choose **Create an instance in it** from the group's menu, or select the group in the **Server group** section of **Create instance**. The location must match. An instance joins at creation; it cannot join, leave or switch server groups later.

The group's row shows its members. Open an instance to see its group link. The group's name and policy are fixed; create another group to change the arrangement.

## With the API

<!-- api-example: post_server_group -->

Send `server_group_id` in the instance create body. List groups with `GET {P}/server-groups`, and delete an empty group with `DELETE {P}/server-groups/{id}`.

## Delete and limits

A group with members cannot be deleted. Delete the member instances or replace them with instances outside this group first. The confirmation names remaining members.

Strict spreading needs enough hosts and capacity. A capacity refusal may require fewer instances, a softer policy or a support request; retrying the same strict request does not create capacity. The API's anti-affinity maximum per host is 1–10, defaulting to one.
