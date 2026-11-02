---
title: Images
description: The operating systems each location offers, and saving an instance's system disk as an image of your own.
---

# Images

An **image** is a saved system disk that new instances start from. There are two kinds:

- **The location's images**: the operating systems NubeStack publishes in each location, such as
  Ubuntu or Debian. You choose one when you create an instance; you cannot change or delete them.
- **Your images**: an instance of yours saved as it is, private to the project, to start new
  instances with the same setup.

Find your own under **Compute → Images**.

![Your images: name, location, size and status](../assets/screens/compute/images.webp)

## Before you start

A running or stopped instance to save, and a role of project admin or project member.

## Save an instance as an image

=== "Console"

    1. Choose **Create image**, or **Manage → Create image** on an instance.
    2. Choose the instance and name the image.
    3. Choose **Create image** and follow the operation.

    ![Create image: the instance and the image's name](../assets/screens/compute/image-create.webp)

=== "API"

    ```bash
    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/servers/srv_01jbweb1:create-image" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      -d '{"display_name": "web-golden"}'
    ```

The image is the instance's system disk as it is at that moment, in the instance's location.
Attached volumes are not part of it. For a consistent copy, stop the instance first, or at least
stop what writes to its disk.

## Start an instance from an image

Choose **Manage → Start an instance from it** on the image, or pick it under **Your images** when
you [create an instance](instances.md). In the API, pass `image_id` instead of `image`. You can
also make a bootable [volume](../storage/volumes.md) from it.

## Rename or delete an image

=== "Console"

    Open the image for **Rename**, or choose **Manage → Delete** and confirm.

=== "API"

    ```bash
    curl -sS -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/images/img_01jbgolden" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)"
    ```

    `PATCH …/images/{id}` with `{"display_name": "…"}` renames it.

Instances already started from a deleted image keep running; no new ones can start from it.

**What blocks a delete**

| Refusal | Why | Resolve |
|---|---|---|
| `image_protected` | The image is marked protected in the location | Remove the protection with the location's own tools, then delete |

## Limits and good practice

- An image stays in its location. To use the same setup in the other location, set up an instance
  there and save it again.
- Uploading your own image file (`.qcow2`, `.iso`) is not offered yet. Images made with the
  location's own tools appear in the list too.
- Your images are kept, and their size counted in your usage, until you delete them. Delete old
  ones you no longer launch.
- Prefer building instances from a public image plus user data or a launch template; keep saved
  images for setups that take long to rebuild.

## Related

- [Instances](instances.md) · [Launch templates](launch-templates.md)
- [API reference: Images](../api/reference/images.md)
