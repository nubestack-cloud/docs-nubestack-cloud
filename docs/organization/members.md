---
title: Members and invitations
---

# Members and invitations

Members are the people who can use your organization. Invite a colleague, choose an organization role, then grant access to the projects they need. Organization membership and project access are separate.

![Acme's members and roles](../assets/screens/organization/members.webp)

## Invite someone

1. Open the organization's **Members** page and choose **Invite member**.
2. Enter the invited person's email address and choose an organization role.
3. Add project grants if they should use resources immediately. Choose a project role for each project.
4. Send the invitation. If the console provides a copyable invitation link, share it only with that person through a private channel.
5. Track its status in the invitations list. Resend or revoke it from the row's menu.

![Invite a member and select project access](../assets/screens/organization/invite.webp)

The recipient follows [Create your account](/get-started/account.md). They must sign in with the invited address. The invitation page shows its expiry; do not assume an old link still works. Organization domain restrictions can refuse an invitation.

## Change access

Use a member's menu to change their organization role, suspend them, resume them or remove them. Manage their project grants from the project's **Access** settings. Built-in and [custom roles](/organization/custom-roles.md) control what each grant permits.

An organization admin can manage the organization, but needs a project grant to change project workloads or sign in to that location's native tools. A project reader can inspect resources without changing them. Read the complete [roles and permissions](/concepts/roles-and-permissions.md) table before assigning a broad role.

Removing or suspending someone affects their access, rather than deleting the instances and data they created. The owner's role is protected; use the ownership-transfer flow before removing an owner where required. Native access changes can take up to 15 minutes to reach each location.

## With the API

<!-- api-example: create_invitation -->

List members with `GET /v1/orgs/{org_id}/members`. Organization role changes use `PATCH .../members/{member_id}`. Suspension, resumption and removal may return operations; follow the response rather than assuming all membership changes finish at once. Project grants live at `/projects/{project_id}/grants`.

## Good practice

Give people the narrowest useful project access. Keep invitation links private, revoke unused invitations and review grants when a person's responsibilities change. Check **Activity** after sensitive changes. If someone needs immediate native access revocation during an outage, contact the support channel supplied at onboarding.
