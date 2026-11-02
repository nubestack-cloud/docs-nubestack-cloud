---
title: Serve an application over HTTPS
description: Put a load balancer with your TLS certificates in front of two instances, serving two domains from one HTTPS listener.
---

# Serve an application over HTTPS

Give two application instances one HTTPS address for two domains, `www.acme.example` and
`shop.acme.example`. The load balancer ends TLS with your certificates, picks the right one for
each domain, and sends plain HTTP to the instances.

<figure class="ns-diagram">
--8<-- "https-sni.svg"
<figcaption>One HTTPS listener with a default certificate and one served by host name. The instances behind it receive plain HTTP on port 8080.</figcaption>
</figure>

**You will use:** instances, a security group, certificates, a load balancer and a public IP, all
in Karachi.

## Before you start

- Two instances, `web-1` and `web-2`, on the same network, each serving your application over
  HTTP on port 8080. [Publish a web application](publish-web-application.md) shows how to start
  one with cloud-init.
- A security group on both instances that allows TCP 8080 from the network's range, for example
  `10.0.0.0/24`, so the load balancer can reach them.
- A certificate and its private key for each domain, in PEM, from your certificate authority.
- A location that offers HTTPS termination: the load balancer's **Type** list says
  **HTTPS with your certificate** for a type that can end TLS. If none does, use a TCP listener on
  443 and end TLS on the instances.

## 1. Upload both certificates

=== "Console"

    1. Under **Security**, choose **Certificates**, then **Upload certificate**.
    2. **Location** Karachi. Paste the **Certificate**, the **Chain** if your authority gave you
       one, and the **Private key**. **Name**: `www-2026`.
    3. Choose **Upload certificate**. Repeat for the second domain, named `shop-2026`.

=== "API"

    Keep each upload in a local file, never in your shell history:

    ```bash
    jq -n --rawfile crt www.crt --rawfile key www.key --rawfile chain chain.pem \
      '{location: "loc_01jbkhi", display_name: "www-2026", certificate: $crt, chain: $chain, private_key: $key}' \
      > www-2026.json

    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/certificates" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      --data-binary @www-2026.json
    ```

    Repeat for `shop-2026`. Each answers `202 Accepted` with the certificate's `id` (`crt_…`).

[Certificates](../security/certificates.md) lists what an upload must contain.

## 2. Create the load balancer

=== "Console"

    1. Under **Networking**, choose **Load balancers**, then **Create load balancer**.
    2. **Location** Karachi, **Name** `web-lb`, and a **Type** that offers HTTPS with your
       certificate.
    3. **Subnet**: the instances' network.
    4. **Listeners**: protocol **HTTPS, TLS ends here**, port `443`, **Certificate** `www-2026`.
       Under **Also serve these certificates (by host name)**, choose `shop-2026`.
    5. **Add a pool of instances**: `web-1` and `web-2`, each on port `8080`, **Balancing** round
       robin. Add a **Health check** of type HTTP.
    6. Choose **Create load balancer** and follow the operation.

    ![The load balancer's Listeners tab: the HTTPS listener names its certificate and the one it serves by host name](../assets/screens/security/listener-sni.webp)

=== "API"

    ```bash
    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      -d '{
        "location": "loc_01jbkhi",
        "display_name": "web-lb",
        "offering": "application",
        "subnet_id": "sbn_01jbdefault",
        "listeners": [{
          "protocol": "TERMINATED_HTTPS",
          "port": 443,
          "certificate_id": "crt_01jbwww",
          "sni_certificate_ids": ["crt_01jbshop"],
          "pool": {
            "algorithm": "ROUND_ROBIN",
            "members": [
              {"server_id": "srv_01jbweb1", "port": 8080},
              {"server_id": "srv_01jbweb2", "port": 8080}
            ],
            "health_monitor": {"type": "HTTP"}
          }
        }]
      }'
    ```

    `offering` is the type's `slug` from the location's catalog. The answer is `202 Accepted`.

## 3. Give it a public IP

=== "Console"

    1. Under **Networking**, choose **Public IPs**, then **Allocate a public IP** in Karachi.
    2. Open the load balancer. Under **Public exposure**, choose **Attach a public IP** and pick
       the address.

=== "API"

    ```bash
    curl -sS -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/floating-ips/fip_01jblb:associate" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $(uuidgen)" \
      -H "Content-Type: application/json" \
      -d '{"load_balancer_id": "lbs_01jbweblb"}'
    ```

## 4. Point your domains at it and test

Add `A` records for `www.acme.example` and `shop.acme.example` with the public IP at your DNS
provider. Before DNS has spread, test each name directly:

```bash
curl -I --resolve www.acme.example:443:203.0.113.40 https://www.acme.example/
curl -I --resolve shop.acme.example:443:203.0.113.40 https://shop.acme.example/
openssl s_client -connect 203.0.113.40:443 -servername shop.acme.example </dev/null | openssl x509 -noout -subject
```

The last command prints the certificate served for `shop.acme.example`: `CN=shop.acme.example`.

## Keep it running

- **Renewals.** Upload the new certificate, then on the **Listeners** tab choose **Change
  certificates** and pick it in place of the old one. Delete the old one after. See
  [Rotate a certificate](../security/certificates.md#rotate-a-certificate).
- **More domains.** Add up to ten certificates by host name to the same listener. See
  [Several certificates on one listener](../security/sni.md).
- **Health.** The **Listeners** tab shows each instance's recorded health. An instance that fails
  its checks stops getting traffic.

## Clean up

Delete the load balancer: its listeners, pools and health checks go with it, and its public IP is
detached and stays allocated until you release it. Then delete the certificates and, if you made
them for this, the instances.
