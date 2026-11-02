---
action_tabs: true
title: Members and invitations
---

# Members and invitations

Members are the people who can use your organization. Invite a colleague, choose an organization role, then grant access to the projects they need. Organization membership and project access are separate.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](../api/index.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![Acme's members and roles](../assets/screens/organization/members.webp)


## Invite someone

=== "Console"

    1. Open the organization's **Members** page and choose **Invite member**.
    2. Enter the invited person's email address and choose an organization role.
    3. Add project grants if they should use resources immediately. Choose a project role for each project.
    4. Send the invitation. If the console provides a copyable invitation link, share it only with that person through a private channel.
    5. Track its status in the invitations list. Resend or revoke it from the row's menu.

    ![Invite a member and select project access](../assets/screens/organization/invite.webp)

    The recipient follows [Create your account](../get-started/account.md). They must sign in with the invited address. The invitation page shows its expiry; do not assume an old link still works. Organization domain restrictions can refuse an invitation.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/invitations" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "email": "ayesha@acme.example",
      "role": "member",
      "project_grants": []
    }'
    ```

    Returns `201` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/members-and-invitations.md).


## Change access

=== "Console"

    Use a member's menu to change their organization role, suspend them, resume them or remove them. Manage their project grants from the project's **Access** settings. Built-in and [custom roles](custom-roles.md) control what each grant permits.

    An organization admin can manage the organization, but needs a project grant to change project workloads or sign in to that location's native tools. A project reader can inspect resources without changing them. Read the complete [roles and permissions](../concepts/roles-and-permissions.md) table before assigning a broad role.

    Removing or suspending someone affects their access, rather than deleting the instances and data they created. The owner's role is protected; use the ownership-transfer flow before removing an owner where required. Native access changes can take up to 15 minutes to reach each location.

=== "API"

    **Change a member's roles**

    ```bash
    curl --fail-with-body -i -X PATCH "$NUBESTACK_API/v1/orgs/$ORG/members/$MEMBER_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG" \
      -H "Content-Type: application/json" \
      --data '{
      "roles": [
        "member"
      ]
    }'
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/members-and-invitations.md).

    **Give a project role**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/grants" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "principal_id": "usr_example",
      "role": "project_member"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/project-access.md).

    **Suspend a member**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/members/$MEMBER_ID:suspend" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/members-and-invitations.md).

    **Resume a member**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/members/$MEMBER_ID:resume" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/members-and-invitations.md).

    **Remove a member**

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/members/$MEMBER_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/members-and-invitations.md).


## Ownership and leaving

=== "Console"

    An owner can choose **Manage → Make owner** on an eligible member. Review the broad powers of ownership, then choose whether you will stay an owner or step down to another role. Complete any requested second-factor check and verify the resulting roles. The last owner cannot simply be removed or leave the organization without another owner.

    To leave yourself, use your own **Leave organization** action or the organization settings danger zone. Your access ends; an administrator must invite you again if you need to return. Workloads you created remain for the organization to manage. Suspension retains a member's roles for later resumption; removal is a different action and also affects personal keys and native access.

=== "API"

    **Make another member an owner**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/ownership:transfer" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "member_id": "mem_example",
      "then": "owner"
    }'
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](../api/reference/members-and-invitations.md).

    **Leave the organization**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/members/me:leave" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](../api/reference/members-and-invitations.md).


## Good practice

Give people the narrowest useful project access. Keep invitation links private, revoke unused invitations and review grants when a person's responsibilities change. Check **Activity** after sensitive changes. If someone needs immediate native access revocation during an outage, contact the support channel supplied at onboarding.
