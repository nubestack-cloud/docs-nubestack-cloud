---
title: The console
description: How the NubeStack Cloud console is laid out, how lists stay current and how to follow a change.
---

# The console

The console has two kinds of workspace: your **organization**, where you manage people, quota
and settings, and each of its **projects**, where you create instances, networks and storage.

![A project's overview: the side panel by service, counts, recent activity and quota](../assets/screens/get-started/project-overview.webp)

## The layout

- **Top bar.** The **Organization** list, and the **Workspace** list: the organization itself
  or one of its projects. Type in **Find a project** to search a long list. On the right: the
  notification bell, the light or dark theme, and your account menu with **E-mail notices**,
  **Password and sign-in** and **Sign out**.
- **Side panel.** What you can open in the workspace. In a project: **Overview**, then
  **Compute**, **Networking**, **Storage** and **Security**, and at the bottom **Quota and
  usage**, **Consoles and CLI**, **Activity** and **Settings**. **Collapse** narrows the panel.
- **Content.** Lists, detail pages and create pages.

## Lists, detail pages and the Manage menu

A list shows the project's resources of one kind in every location. Filter by location, state or
tag, or type a name, ID or address into the search box.

Open a resource for its detail page: its settings, the resources it is connected to, and its
activity. **Manage**, on a row or on the detail page, holds the actions you can take now. An
action that is missing or greyed out says why when you point at it: your role, a change still
running, or another resource in the way.

## Follow a change

Creating, changing or deleting something in a location takes a moment. The console accepts the
request at once and shows a notice such as **Instance requested**, with **Follow the operation**.
The operation page shows each step and how the location answered.

Every operation of a project is under **Activity**. The organization's **Audit log** records every
change, refusal and security event. See [Operations](../concepts/operations.md).

## How current a list is

Lists show what each location last reported, with the time (**Last read**). A location that has
not answered for a while is marked stale; its rows stay, with the time they are from. One
location's trouble never empties a page.

Choose **Refresh** above a list, or **Check for changes** on a resource, to read it again now.
Something made with a location's own tools appears after the next regular read, or at once after
a refresh.

## Words the console uses

- **Created by: Nexus** means NubeStack Cloud's own automation made the resource, for example
  the network built with a new project.
- **outside Nexus** marks a resource made with a location's own tools, such as Horizon or the
  OpenStack CLI. Nexus is the name of the platform NubeStack Cloud runs on.

The [glossary](../help/glossary.md) explains the other terms.

## Next

- [Understand your organization and its roles](organizations.md).
- [Create a project](create-a-project.md).
