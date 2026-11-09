---
title: Support
description: How to contact NubeStack Cloud support, what to include so we can help quickly, and what never to send.
---

# Support

!!! info "Contact details to come"

    The support address, hours and response times will be published here. Until then, use the
    support contact NubeStack gave you with your invitation or account.

## What to include

The quicker we can find what you saw, the quicker we can help:

- what you expected and what happened, with the exact message or error **code**;
- the organization, project, location and resource IDs;
- the **operation ID** and **request ID**, if you have them;
- when it happened, with your time zone;
- where: the console, the API, Horizon or the OpenStack CLI;
- for the API, the request with secrets removed.

On a resource's page, **IDs for the CLI, Terraform, API and support** (under its details) has
**Copy for a support request**: it copies the organization, project, location, resource and cloud
IDs and the last operation, ready to paste. A refusal's **reference** (under the error) is its
request ID; the audit log shows it too, as **Request reference**.

Keep a failed operation's ID even after you clean up the resource: it is how we find what
happened.

## Never send

API keys, passwords, private SSH or certificate keys, cloud credential secrets, invitation links or
console links. A console log can contain secrets; remove them before you share it.

## Access problems

If you think a key or credential has leaked, revoke it first (an owner or admin can do it under
**IAM → Service accounts**), then tell us which one and when. Lost your password or phone? We send a
one-time reset link; see [Sign up and sign in](../get-started/account.md#lost-your-password-or-your-phone).

## Before you write

[Troubleshooting](troubleshooting.md) covers the common problems, and the
[error codes](../api/errors.md) explain every refusal.
