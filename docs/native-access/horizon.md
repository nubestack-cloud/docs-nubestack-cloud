---
title: Horizon
description: Sign in to a location's Horizon dashboard with your NubeStack Cloud account, open an instance there, and switch organization.
---

# Horizon

Horizon is each location's own OpenStack dashboard. It shows everything the OpenStack APIs offer
in that location, including services and settings the NubeStack Cloud console does not. You sign
in to it with your NubeStack Cloud account.

## Before you start

- A project role (project admin, member or reader) on the project.
- Your [second factor](../security/second-factor.md): signing in to a location always asks for it.

## Open a project in Horizon

1. In the project, open **Consoles and CLI** at the bottom of the side panel.
2. Choose **Open in Horizon** beside the location.
3. On Horizon's sign-in page, choose the NubeStack Cloud sign-in (the option may be labelled
   **Nexus**).
4. Sign in with your account, choose the organization, and give your second factor.

Horizon opens in the project.

## Open an instance in Horizon

On an instance's page in the console, choose **Console in Horizon**. Horizon opens on that
instance's page, where its graphical console is. For the browser console without Horizon, see
[Connect to an instance](../compute/connect-to-instances.md#open-the-browser-console).

## Switch organization

Horizon signs you in for one organization at a time. To switch, sign out of Horizon and wait three
minutes before signing in again, or open the link in a private window.

## If it does not open

| You see | What to do |
|---|---|
| **No console registered** | The location has no Horizon for customers; use the console and the CLI |
| **Sign-in failed its last check** | Try again later, or [contact support](../help/support.md) |
| Horizon says you have no projects | You have no project role there, or it was given in the last few minutes |
| Horizon opens the wrong organization | Sign out, wait three minutes, and sign in choosing the right one |

## Good to know

- What you make in Horizon appears in the console within about an hour, or at once after
  **Refresh**, marked **outside Nexus**.
- Your access in Horizon follows your project role: `member` for project admins and members,
  `reader` for project readers where the location enforces it.
- Removing your access ends it in Horizon within 15 minutes.

## Related

- [OpenStack CLI](openstack-cli.md) · [Native OpenStack access](index.md)
