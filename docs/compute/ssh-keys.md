---
action_tabs: true
title: SSH keys
description: Add your public SSH key, share a key with a project, and use it to log in to new instances.
---

# SSH keys

Add the public key of the computer you connect from, then choose it when you create an instance.
It is copied into the instance, and you log in with SSH without a password. The private key never
leaves your computer; NubeStack Cloud never makes one for you.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](/api/overview.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

Find them in a project under **Compute → SSH keys**.

![The SSH keys page: a personal key and a key shared with the project](../assets/screens/compute/ssh-keys.webp)


## Add a key

=== "Console"

    1. On your computer, print your public key. No key yet? Make one first with
       `ssh-keygen -t ed25519`.

       ```bash
       cat ~/.ssh/id_ed25519.pub
       ```

    2. In the project, choose **Add SSH key**.

       ![The Add SSH key page](../assets/screens/compute/ssh-key-add.webp)

    3. **Public key**: paste the whole line, starting `ssh-ed25519`, `ecdsa-sha2-…` or `ssh-rsa`.
       Ed25519, ECDSA and RSA keys of 2,048 bits or more work, including security-key (`sk-`) keys.
       A private key is refused; if you pasted one, make a new key pair.
    4. **Name**: how you will recognise it, up to 64 characters. It is filled from the key's comment
       when it has one.
    5. **Who can use it**:
       - **Only me**: a personal key, offered to you in every project of the organization.
       - **Everyone in** the project: a project key, offered to every member of this project. Only a
         project admin can share a key with the project.
    6. Choose **Add SSH key**.

    The public key and its fingerprint are stored; the key's comment is not.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/ssh-keys" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "display_name": "my-laptop",
      "public_key": "REPLACE_WITH_YOUR_COMPLETE_PUBLIC_SSH_KEY"
    }'
    ```

    Returns `201` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/ssh-keys.md#post-key).


## Use a key

=== "Console"

    Choose the key under **Access → SSH key** when you [create an instance](/compute/instances.md#create-an-instance).
    Log in as the image's default user, for example `ubuntu` on Ubuntu images:

    ```bash
    ssh ubuntu@203.0.113.21
    ```

    A key is copied into an instance only when the instance is created. To change the keys of a
    running instance, edit `~/.ssh/authorized_keys` inside it. **Rebuild** keeps the key the instance
    was created with.

=== "API"

    Set `ssh_key_id` at creation. Changing the key library later does not rewrite `authorized_keys` inside an existing guest.
    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "location": "loc_example",
      "display_name": "web-1",
      "offering": "medium",
      "image": "ubuntu-24-04",
      "network_id": "net_example",
      "ssh_key_id": "ssh_example"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/instances.md#post-server).


## Remove a key

=== "Console"

    Choose **Delete** from the key's **Manage** menu. Instances already started with it keep it.

    You can remove your own personal keys. Project admins, and organization owners and admins, can
    remove any key in the project, including another member's; that is the only reason other members'
    keys are listed. When someone leaves the organization, their personal keys are deleted.

=== "API"

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/ssh-keys/$KEY_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/ssh-keys.md#delete-key).
