---
title: Certificates
description: Upload a TLS certificate, its chain and its private key once, serve it from HTTPS load balancer listeners, rotate and delete it.
---

# Certificates

A **certificate** lets a load balancer serve HTTPS itself: it ends TLS with your certificate and
sends plain HTTP to the instances behind it. You upload the certificate, its chain and its private
key once; HTTPS listeners then choose it by name.

Find them in a project under **Security → Certificates**.

![Certificates: name, location, the names each covers, days left and how many listeners serve it](../assets/screens/security/certificates.webp)

## Before you start

- A certificate for your domain from a certificate authority, its intermediate chain, and its
  private key, all in PEM. NubeStack Cloud does not issue certificates.
- A location whose load balancer types offer **HTTPS with your certificate**. See
  [Load balancers](../networking/load-balancers.md#where-they-are-offered).
- A role of project admin or project member.

## Upload a certificate

=== "Console"

    1. Choose **Upload certificate**.
    2. **Location**: where the load balancers that serve it run. A listener can only use a
       certificate of its own location; upload it again for the other location.
    3. **Certificate**: the server's own certificate (`-----BEGIN CERTIFICATE-----`). It must be
       valid now and for at least another day.
    4. **Chain** (optional): the intermediate certificates, the one that issued yours first, at
       most five. Leave the root out.
    5. **Private key**: without a passphrase; RSA of at least 2048 bits, or EC on P-256 or P-384.
       To remove a passphrase: `openssl pkey -in key.pem -out plain-key.pem`.
    6. **Name**: how listeners choose it, for example `www-2026`.
    7. Choose **Upload certificate**.

    ![Upload certificate: location, certificate, chain, private key and name](../assets/screens/security/certificate-upload.webp)

=== "API"

    Build the body from files so the key never appears in your shell history:

    ```bash
    jq -n --rawfile crt www.crt --rawfile chain chain.pem --rawfile key www.key \
      '{location: "loc_01jbkhi", display_name: "www-2026", certificate: $crt, chain: $chain, private_key: $key}' \
      > www-2026.json

    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/certificates" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      --data-binary @www-2026.json

    rm www-2026.json
    ```

    The answer is `202 Accepted` with the certificate's `id` (`crt_…`).

The upload is checked at once: that the key belongs to the certificate, that the certificate is
valid, and that the chain is in order. A problem is shown under the field it is in, and nothing is
stored.

### What happens to the key

The key is encrypted the moment it arrives, stored once in the location's key manager in your
project, and the encrypted copy is then deleted. It is never shown again. Project members can read
it with the location's own tools, as with any secret in their project; project readers cannot.

## Serve it from a listener

When you [create a load balancer](../networking/load-balancers.md), or add a listener, choose the
protocol **HTTPS, TLS ends here**, the port (usually 443) and the certificate. To serve more than
one domain on the same listener, add more certificates by host name: see
[Several certificates on one listener](sni.md).

![A certificate's page: the names it covers, its expiry, and the listeners that serve it, as default or by host name](../assets/screens/security/certificate-detail.webp)

A certificate's page lists the listeners that serve it, each marked **default** or **by host
name**.

## Rotate a certificate

1. Upload the new certificate.
2. Open the load balancer's **Listeners** tab and choose **Change certificates** on each listener
   that serves the old one. Pick the new one in its place, then **Save certificates**. New
   connections get the new certificate; the address stays.
3. Delete the old certificate.

Renewal is not automatic. The list shows days left for each, in amber when fewer than 30.

## Delete a certificate

=== "Console"

    Choose **Delete** on its page or in its **Manage** menu, and confirm.

=== "API"

    ```bash
    curl -sS -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/certificates/crt_01jbapi" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)"
    ```

The key is deleted from the key manager.

**What blocks a delete**

| Refusal | Why | Resolve |
|---|---|---|
| `certificate_in_use` | A listener serves it, as its default or by host name; the message names the listeners | **Change certificates** on those listeners first |

Deleting a project, or one of its locations, deletes every certificate and every other secret of
the project in that location's key manager, after its load balancers.

## Limits and good practice

- Up to 50 certificates per project in each location (`certificate_limit`).
- Each PEM field up to 32,768 characters; the whole upload up to 64 KiB.
- A certificate expiring within 24 hours cannot be put on a listener (`certificate_expired`).
- Keep your own copy of each key; the console cannot give it back.
- Never paste a private key into a support request or a screenshot.

## Related

- [Several certificates on one listener](sni.md) · [Load balancers](../networking/load-balancers.md)
- [Serve an application over HTTPS](../tutorials/https-load-balancer.md)
- [API reference: Certificates](../api/reference/certificates.md)
