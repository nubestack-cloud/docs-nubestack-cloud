---
title: Images
---

# Images

An image is a template for an instance's system disk. Use the location's published operating-system images for a fresh start, or save an existing instance as a project image to reuse its installed software.

![The location's and project's images](../assets/screens/compute/images.webp)

## Use an image

Open **Compute → Images** to inspect images in your project's locations. During [instance creation](/compute/instances.md), choose an image offered in the selected location. Project images appear under **Your images**. An image in Karachi cannot be used directly in Islamabad.

An image does not carry a running instance's memory, network identity or attached data volumes. Set the network, SSH key, security groups and volumes for each new instance.

## Save an instance as an image

1. Prepare the instance. Remove temporary files and secrets you do not want copied, and stop application writes. Shut it down first if the application requires that for a consistent disk copy.
2. Open **Compute → Instances**, then **Manage → Create image** on an active or stopped instance.
3. Give the image a descriptive name, such as `web-base-2026-11`.
4. Follow the operation until it succeeds, then check **Compute → Images**.
5. Launch a test instance from the saved image and verify it before relying on it.

![The instance menu includes Create image](../assets/screens/compute/instance-manage-menu.webp)

## Rename and delete

Use the image's **Manage** menu to rename or delete a project image you control. Location-provided images are managed by NubeStack. Check [launch templates](/compute/launch-templates.md) and [instance groups](/compute/instance-groups.md) before deleting an image they will need for future launches or replacements.

Deleting an image does not serve as a way to delete instances already created from it. Image storage and availability are local to each location, and quota or a resource dependency can refuse deletion.

## With the API

```bash
curl --fail-with-body -i -X POST \
  "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers/$SERVER_ID:create-image" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  -H "Idempotency-Key: $REQUEST_KEY" \
  -H "Content-Type: application/json" \
  --data '{"display_name": "web-base-2026-11"}'
```

This returns `202 Accepted` and an operation. [Poll the operation](/api/operations.md) before using the image. List with `GET {P}/images`, rename with `PATCH {P}/images/{id}` and delete with `DELETE {P}/images/{id}`. Use `image_id` to launch an instance from a project image; use the catalog's `image` name for a published image.

## Good practice

Keep saved images free of private credentials and machine-specific configuration. Use cloud-init for settings that vary between instances. A project image is a reusable system disk, while [volume snapshots](/storage/snapshots.md) protect separate data disks.
