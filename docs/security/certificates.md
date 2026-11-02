---
title: Certificates
---

# Certificates

A certificate lets an Application load balancer terminate HTTPS for your domain. Certificates belong to a project and location; select one on an HTTPS listener in that same project and location.

![Certificates, domains and expiry dates](../assets/screens/security/certificates.webp)

## Upload a certificate

1. Obtain a certificate for your domain and its matching private key. NubeStack Cloud does not issue a certificate for you through this page.
2. Open **Security → Certificates → Upload certificate**.
3. Select the location and a name that identifies the domain and renewal, such as `shop-2026-11`.
4. Paste the PEM leaf certificate, unencrypted PEM private key and intermediate chain if required. Order intermediates from the leaf's issuer outward; omit the leaf from the chain.
5. Upload and follow the operation. The private key is accepted once and is never shown back.

![Upload a certificate, private key and optional chain](../assets/screens/security/certificate-upload.webp)

Supported keys are RSA of at least 2,048 bits or EC on P-256 or P-384. Each PEM field accepts at most 32,768 characters; the chain allows up to five intermediate certificates. The certificate and key must match, and the certificate must be valid for its intended use.

## Use and rotate

Open the certificate to see its domains, expiry, fingerprint and linked listeners. Add or edit an HTTPS listener under [Load balancers](/networking/load-balancers.md) and select this certificate. The API protocol is `TERMINATED_HTTPS`.

![A certificate's details and listeners using it](../assets/screens/security/certificate-detail.webp)

To rotate, upload a new certificate, switch each listener to it and follow the operations. Verify the served certificate at your application domain before deleting the old resource. Uploading a replacement alone does not change listeners, and renewal is not automatic.

!!! note "One certificate per listener"

    Multiple certificates on one listener using SNI are coming later. Each HTTPS listener currently selects one certificate; a wildcard or multi-domain certificate can cover names included in that certificate.

## With the API

Prepare `certificate.json` locally with `location`, `display_name`, `certificate`, `private_key` and optional `chain`. Treat this file as a secret and remove it after use.

```bash
curl --fail-with-body -i -X POST \
  "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/certificates" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY" \
  -H "Idempotency-Key: $REQUEST_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @certificate.json
```

The response is `202 Accepted` with an operation. [Poll it](/api/operations.md) before selecting the certificate. Change a listener with `PATCH {P}/load-balancers/{lb_id}/listeners/{listener_id}` and its `certificate_id`; see the [reference](/api/reference/index.md) for the full body.

## Delete and good practice

A certificate used by a listener cannot be deleted. Switch or remove every named listener first. Keep a secure original copy of the key and certificate; the console cannot recover the private key. Monitor expiry and allow enough time to upload, switch and verify a renewal. Do not paste private keys into support requests or screenshots.
