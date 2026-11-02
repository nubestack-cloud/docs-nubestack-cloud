---
title: Find your way around the console
---

# Find your way around the console

The console has two workspaces: your organization and a selected project. The organization is where you manage people, policy and budgets. A project is where you create instances, networks and storage.

## Choose the workspace first

1. Use the organization switcher to choose the organization you intend to work in.
2. Select a project such as `web-shop` in the workspace controls, or open it from **Projects**.
3. Check the project name and your role. Owners and organization admins can inspect a project without automatically having permission to change its workloads.
4. On a create page, choose the location before the size, image, network or volume. Choices below depend on it.

![A project's overview, services and recent activity](../assets/screens/get-started/project-overview.webp)

## Find a service or resource

Use the service navigation for Compute, Networking, Security and Storage. Lists show resources across the project's locations; narrow by location, state or tag where offered. Search names, IDs or addresses using the list's search control.

Open a resource for its detail page, links to related services and activity. **Manage** on a row or detail page offers actions allowed by your role and the resource's current state. An absent or disabled action can mean read-only access, a running change or a resource dependency; read the explanation before changing roles.

## Follow a change

After creating or changing a cloud resource, use **Follow the operation** in the notice. A request is accepted before the location finishes it. Wait for its final result before depending on it; a green instance state also does not prove your guest application finished starting.

Use project **Activity** for operations, or the organization's audit log for membership, policy and security events. Copy request and operation IDs when you need help.

## Check freshness

Lists display the last observation and partial or stale-data notices. **Refresh** asks for a new read. Native-tool changes appear after inventory is read; do not create a duplicate merely because an earlier observation does not show the resource.

## Use the guide in your preferred way

Service procedures have **Console** and **API** tabs. The Console tab shows the browser steps and screenshots; the API tab shows the corresponding requests. Prerequisites, verification and resource limits apply to both. Choose a method before following the steps, and open a screenshot to inspect small controls.

## Settings and personal choices

Project **Settings** groups access, locations and deletion. Organization **Settings** controls organization policy and closure. The account menu contains your **E-mail notices** preferences; these apply only to the selected organization and person.

For a complete first task, continue with [your first instance](first-instance.md). The [glossary](../help/glossary.md) explains the words used throughout the console and this guide.
