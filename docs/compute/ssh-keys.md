---
title: SSH keys
description: Add your public SSH key, share a key with a project, and use it to log in to new instances.
---

# SSH keys

Add the public key of the computer you connect from, then choose it when you create an instance.
It is copied into the instance, and you log in with SSH without a password. The private key never
leaves your computer; NubeStack Cloud never makes one for you.

Find them in a project under **Compute → SSH keys**.

![The SSH keys page: a personal key and a key shared with the project](../assets/screens/compute/ssh-keys.webp)

## Add a key

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

## Use a key

Choose the key under **Access → SSH key** when you [create an instance](/compute/instances.md#create-an-instance).
Log in as the image's default user, for example `ubuntu` on Ubuntu images:

```bash
ssh ubuntu@203.0.113.21
```

A key is copied into an instance only when the instance is created. To change the keys of a
running instance, edit `~/.ssh/authorized_keys` inside it. **Rebuild** keeps the key the instance
was created with.

## Remove a key

Choose **Delete** from the key's **Manage** menu. Instances already started with it keep it.

You can remove your own personal keys. Project admins, and organization owners and admins, can
remove any key in the project, including another member's; that is the only reason other members'
keys are listed. When someone leaves the organization, their personal keys are deleted.

## With the API

Keys belong to the organization, not to a location: one key works in every location.

```bash
curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/ssh-keys" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d "{\"display_name\": \"ci-runner\", \"public_key\": \"$(cat ~/.ssh/id_ed25519.pub)\"}"
```

This takes effect at once and answers `201 Created` with the key's `ssh_` ID. Made with a
service account's API key, it is that service account's own key. A body with `project_id` shares
the key with a project, which only a project admin may do, so do that in the console.
`GET /v1/orgs/{org_id}/ssh-keys` lists them and
`DELETE /v1/orgs/{org_id}/ssh-keys/{key_id}` removes one.

| Limit | |
|---|---|
| Keys per owner (a person, or a project) | 50 |
| The same key twice for one owner | refused, `ssh_key_exists` |
