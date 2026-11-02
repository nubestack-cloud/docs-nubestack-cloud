---
action_tabs: true
title: Launch templates
---

# Launch templates

A launch template saves instance settings so you can repeat a launch. Use it for consistent web servers, batch workers or the instances maintained by an [instance group](/compute/instance-groups.md). Templates belong to one project and contain a location-specific instance configuration.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](/api/overview.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

![Saved launch templates and versions](../assets/screens/compute/launch-templates.webp)


## Save a template

=== "Console"

    1. Open **Compute → Instances → Create instance**.
    2. Choose the location, size, image, network, SSH key and other settings.
    3. Choose **Save as launch template**. Name it `web-server` and add a description.
    4. Review the saved settings. User data, if included, is kept securely and is never shown back.

    Alternatively, open **Compute → Launch templates** and use the create action to prepare the settings there. A template cannot reserve an existing volume, fixed private IP or existing public IP for repeated use. New-volume definitions can be included so each instance gets its own data disk.

    ![A template's version, settings and launched instances](../assets/screens/compute/launch-template-detail.webp)

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/launch-templates" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "name": "web-server",
      "server": {
        "location": "loc_example",
        "display_name": "web",
        "offering": "medium",
        "image": "ubuntu-24-04",
        "network_id": "net_example",
        "ssh_key_id": "ssh_example"
      }
    }'
    ```

    Returns `201` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/launch-templates.md#create-template).


## Launch instances

=== "Console"

    Open a template and choose **Launch**. Select a version and a count from 1 to 10. A single launch uses the configured base name; a multi-instance launch adds numbered suffixes. Follow the launch operation and inspect each result: some instances can succeed while others fail.

    Launches use the quota and catalog available at that moment. Saving a template does not reserve capacity, addresses or storage.

=== "API"

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/instance-launches" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "count": 2,
      "template": {
        "id": "ltp_example",
        "version": 1
      }
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/launch-templates.md#post-launch).


## Versions and editing

=== "Console"

    Editing the instance settings creates another template version. The detail page lets you inspect versions and see the instances launched from them. Existing instances are unchanged. An instance group can pin one version or use the latest version for each new instance; changing the template does not rebuild existing group members.

=== "API"

    ```bash
    curl --fail-with-body -i -X PATCH "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/launch-templates/$TEMPLATE_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG" \
      -H "Content-Type: application/json" \
      --data '{
      "description": "Web application template"
    }'
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/launch-templates.md#change-template).


## Delete and limits

=== "Console"

    Remove or update instance groups that reference the template before deleting it. Deleting a template leaves instances it already launched running, but removes the reusable definition. Each template supports up to 100 versions. Keep secrets out of names and descriptions, and prefer version-pinned templates for predictable replacements.

=== "API"

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/launch-templates/$TEMPLATE_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "If-Match: $ETAG"
    ```

    Returns `200` directly. Read the returned resource or current state to verify the change.

    [Request fields and responses](/api/reference/launch-templates.md#delete-template).
