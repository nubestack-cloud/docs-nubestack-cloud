---
title: Compute
description: Instances and everything that helps you start them, place them and keep them running.
---

# Compute

Compute is where your workloads run: **instances**, the virtual machines, and the pieces that
help you start them, place them and keep a number of them running. Find it in a project's menu
under **Compute**.

<div class="grid cards" markdown>

-   :material-server-outline:{ .lg .middle } **[Instances](instances.md)**

    ---

    Create a virtual machine with its network, public IP, SSH key, firewall, user data and
    volumes.

-   :material-tune-variant:{ .lg .middle } **[Manage an instance](manage-instances.md)**

    ---

    Stop, start, reboot, resize, rebuild, rescue, lock, shelve, rename and delete.

-   :material-console-line:{ .lg .middle } **[Connect to an instance](connect-to-instances.md)**

    ---

    SSH, the browser console, the console log, networks, public IPs and security groups.

-   :material-key-variant:{ .lg .middle } **[SSH keys](ssh-keys.md)**

    ---

    Public keys copied into new instances so you can log in without a password.

-   :material-layers-outline:{ .lg .middle } **[Images](images.md)**

    ---

    The operating systems each location offers, instances you saved, and image files you
    imported.

-   :material-server-network:{ .lg .middle } **[Server groups](server-groups.md)**

    ---

    Keep instances on different hosts, or together on one.

-   :material-file-document-edit-outline:{ .lg .middle } **[Launch templates](launch-templates.md)**

    ---

    Save an instance's settings and launch one to ten like it in one step.

-   :material-server-plus-outline:{ .lg .middle } **[Instance groups](instance-groups.md)**

    ---

    Keep a number of a template's instances running, replace failed ones, change the count on a
    schedule.

</div>

## How compute connects

- An instance runs in its project's **location** and never moves. Its size and image come from
  that location's catalog.
- It joins one or more of the project's **networks** and is filtered by **security groups**.
  A **public IP** makes it reachable from the Internet. See [Networking](../networking/index.md).
- Its system disk goes with it. Keep data on a **volume**, which outlives it. See
  [Storage](../storage/index.md).
- It can join a **load balancer** pool when it is created, or later from the load balancer.

## Where to start

New to NubeStack Cloud? [Launch your first instance](../get-started/first-instance.md) walks
through an SSH key, an instance with a public IP and logging in.
