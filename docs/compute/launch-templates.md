---
methods: true
title: Launch templates
---

# Launch templates

A launch template saves instance settings so you can repeat a launch. Use it for consistent web servers, batch workers or the instances maintained by an [instance group](/compute/instance-groups.md). Templates belong to one project and contain a location-specific instance configuration.

![Saved launch templates and versions](../assets/screens/compute/launch-templates.webp)

## Save a template

1. Open **Compute → Instances → Create instance**.
2. Choose the location, size, image, network, SSH key and other settings.
3. Choose **Save as launch template**. Name it `web-server` and add a description.
4. Review the saved settings. User data, if included, is kept securely and is never shown back.

Alternatively, open **Compute → Launch templates** and use the create action to prepare the settings there. A template cannot reserve an existing volume, fixed private IP or existing public IP for repeated use. New-volume definitions can be included so each instance gets its own data disk.

![A template's version, settings and launched instances](../assets/screens/compute/launch-template-detail.webp)

## Launch instances

Open a template and choose **Launch**. Select a version and a count from 1 to 10. A single launch uses the configured base name; a multi-instance launch adds numbered suffixes. Follow the launch operation and inspect each result: some instances can succeed while others fail.

Launches use the quota and catalog available at that moment. Saving a template does not reserve capacity, addresses or storage.

## Versions and editing

Editing the instance settings creates another template version. The detail page lets you inspect versions and see the instances launched from them. Existing instances are unchanged. An instance group can pin one version or use the latest version for each new instance; changing the template does not rebuild existing group members.

## With the API

<!-- api-example: create_template -->

Launch from the template with a new idempotency key:

```http
POST /v1/orgs/{org_id}/projects/{project_id}/instance-launches
Content-Type: application/json

{"count": 2, "template": {"id": "ltp_example", "version": 1}}
```

Launching returns `202 Accepted` and an operation. Template creation and metadata updates return the saved resource directly. Use `If-Match` with the current ETag when editing or deleting where required. [The reference](/api/reference/index.md) lists the exact headers and fields.

## Delete and limits

Remove or update instance groups that reference the template before deleting it. Deleting a template leaves instances it already launched running, but removes the reusable definition. Each template supports up to 100 versions. Keep secrets out of names and descriptions, and prefer version-pinned templates for predictable replacements.
