---
title: Get started
description: From an invitation to an instance you can log in to, in five short steps.
---

# Get started

From an invitation to an instance you can log in to over SSH. Follow the steps in order the first
time; each takes a few minutes.

<div class="grid cards" markdown>

-   **1. [Sign up and sign in](account.md)**

    ---

    Accept your invitation, create your account and set up your second factor.

-   **2. [Find your way around the console](console.md)**

    ---

    The scope selector, the menu, lists, create pages and following a change.

-   **3. [Understand your organization](organizations.md)**

    ---

    People, projects and the two kinds of role.

-   **4. [Create a project](create-a-project.md)**

    ---

    Choose its location, a quota preset and its first network.

-   **5. [Launch your first instance](first-instance.md)**

    ---

    Add an SSH key, start an instance with a public IP, log in and clean up.

</div>

## What you need

- An invitation to an organization on NubeStack Cloud. NubeStack Cloud is open by invitation; if
  you have none, [contact NubeStack](../help/support.md).
- An authenticator app on your phone for your second factor.
- An SSH key pair on your computer, for logging in to Linux instances. No key yet? Run
  `ssh-keygen -t ed25519`.

## Then build something

Each tutorial combines several services into one working result.

<div class="grid cards" markdown>

-   [Publish a web application](../tutorials/publish-web-application.md)

    An instance with cloud-init, open on ports 80 and 443, reachable at a public IP.

-   [Serve an application over HTTPS](../tutorials/https-load-balancer.md)

    A load balancer with your certificates in front of two instances, for several domains.

-   [Keep data on a volume](../tutorials/persistent-storage.md)

    Attach, format and mount a volume, snapshot it and restore it.

-   [Connect private services](../tutorials/private-networking.md)

    A web tier and a database on private networks, with only the web tier public.

-   [Run a group of instances](../tutorials/scale-an-application.md)

    A launch template and an instance group that keeps a number of instances running.

-   [Automate with the API](../tutorials/automate-with-api.md)

    A service account, an API key and a script that creates and cleans up.

</div>
