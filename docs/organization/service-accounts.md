---
action_tabs: true
title: Service accounts and API keys
---

# Service accounts and API keys

A service account is an identity for automation. Give it the roles and project grants a pipeline needs, then issue an API key. Use a separate account for each application or automation purpose so that access and activity remain understandable.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](/api/overview.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![Service accounts for Acme](../assets/screens/organization/service-accounts.webp)


## Create an account and grant project access

=== "Console"

    1. Open the organization's **Service accounts** page and choose **Create service account**.
    2. Name it `ci-deploy` and describe its purpose. Choose the organization role you intend it to hold.
    3. In the project's **Access** settings, add a grant for this service account. An organization role alone does not grant workload changes in a project.
    4. Open the account to inspect its project access, API keys and native credentials.

    ![A service account's access and keys](../assets/screens/organization/service-account.webp)

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    **Create a service account**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/service-accounts" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "display_name": "ci-deploy",
      "description": "Deploys web-shop",
      "role": "member"
    }'
    ```

    Returns `201` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/service-accounts-and-api-keys.md#create-service-account).

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

    [Request fields and responses](/api/reference/project-access.md#create-grant).


## Issue an API key

=== "Console"

    Choose **New API key**, give it a name and set its expiry. Copy the secret from the result once and store it in your automation's secret store. You cannot retrieve it again. Send it as `Authorization: Bearer <key>` to the customer API.

    ![Create a named API key with an expiry](../assets/screens/organization/api-key-new.webp)

    Keys expire after 90 days by default; the supported range is 1–365 days. An account can have two active keys. Optional scopes only narrow what a key can do; they do not add permissions beyond its account's roles and grants. The `credentials:mint` scope permits the native-credential minting path described in the reference.

=== "API"

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/service-accounts/$SERVICE_ACCOUNT_ID/api-keys" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "display_name": "ci-deploy",
      "expires_in_days": 90
    }'
    ```

    Returns `201` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/service-accounts-and-api-keys.md#create-api-key).


## Rotate or revoke

=== "Console"

    On a key, choose **Rotate** and an overlap period. Rotation issues a successor secret once. The default overlap is 24 hours; the supported range is zero to seven days. Install the successor in your automation and test it before the predecessor expires. Zero overlap revokes the predecessor immediately.

    Use **Revoke** when a key is no longer needed or may have been exposed. Deleting the service account revokes its credentials; it does not delete the workloads it created. Review project grants and activity before deletion.

=== "API"

    **Rotate an API key**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/service-accounts/$SERVICE_ACCOUNT_ID/api-keys/$KEY_ID:rotate" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "expires_in_days": 90,
      "overlap_s": 86400
    }'
    ```

    Returns `201` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/service-accounts-and-api-keys.md#rotate-api-key).

    **Revoke an API key**

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/service-accounts/$SERVICE_ACCOUNT_ID/api-keys/$KEY_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/service-accounts-and-api-keys.md#revoke-api-key).

    **Delete a service account**

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/service-accounts/$SERVICE_ACCOUNT_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/service-accounts-and-api-keys.md#delete-service-account).


## Native credentials

=== "Console"

    For non-interactive OpenStack tools, use the account's **Native credentials** section to create a credential for a project location where it has the required project-member access. Copy the generated `clouds.yaml` entry once, protect it as a secret and record its expiry. This is different from the secret-free browser device sign-in used by [people](/native-access/openstack-cli.md).

    Native credentials are local to a project location and can be revoked individually. Never put their secrets in source control.

=== "API"

    **Create a location credential**

    ```http
    POST /v1/orgs/{org_id}/service-accounts/$SERVICE_ACCOUNT_ID/native-credentials
    ```

    Generate an EC P-256 key pair locally and send its public JWK with the project location entry `placement_id`. Follow the operation, collect the encrypted one-time credential secret and decrypt it locally.

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/service-accounts-and-api-keys.md#mint-native-credential).

    **Revoke a location credential**

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/service-accounts/$SERVICE_ACCOUNT_ID/native-credentials/$CREDENTIAL_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/service-accounts-and-api-keys.md#revoke-native-credential).


## Good practice

Use short expiries and narrow grants. Name keys by the system using them, review last-use times and rotate before expiry. A replayed idempotent secret-issuing request does not replay the secret; create or rotate a credential if the one-time result was lost.
