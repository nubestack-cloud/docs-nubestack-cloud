---
action_tabs: true
title: Load balancers
---

# Load balancers

A load balancer distributes traffic across instances. Use it when an application has several backends or needs one stable frontend while you replace instances. It lives on a subnet in one location.

<div class="docs-method-picker" hidden role="group" aria-label="Instruction method">
<span>Show instructions for</span>
<div><button type="button" data-interface-choice="Console" aria-pressed="true">Console</button><button type="button" data-interface-choice="API" aria-pressed="false">API</button></div>
</div>

<div class="docs-method-note" markdown>

[Set up API authentication and variables](/api/overview.md#before-you-start). Replace example IDs and catalog choices. Reuse an idempotency key for retries of one request; use a new key for each new action.

</div>

| Part | Purpose |
|---|---|
| Listener | Accepts a protocol and port, such as TCP 80 or HTTPS 443 |
| Pool | Chooses how traffic is distributed |
| Member | A backend private address and port |
| Health check | Tests whether a backend should receive traffic |

![Load balancers in the project](../assets/screens/networking/load-balancers.webp)

<figure class="docs-diagram">
<div>
<!-- diagram: https-application -->
</div>
<figcaption>An HTTPS listener uses a certificate and forwards to healthy, reachable backends.</figcaption>
</figure>


## Create a load balancer

=== "Console"

    1. Open **Networking → Load balancers → Create load balancer**.
    2. Select the location, name and subnet containing the backends.
    3. Choose **Standard** for TCP or UDP. Choose **Application** for HTTP or HTTPS where that type is offered.
    4. Add a listener and its port. For HTTPS, choose a [certificate](/security/certificates.md) in this project and location.
    5. Add a pool, its balancing algorithm, and backend addresses and ports.
    6. Add a health check that matches what the application serves. Review and create.
    7. Follow the operation. Attach a [public IP](/networking/public-ips.md) if the service should be reachable from the Internet.

    ![Create a load balancer and its initial listener](../assets/screens/networking/load-balancer-create.webp)

    The API and catalog determine the protocols each type accepts. HTTPS termination is `TERMINATED_HTTPS` in the API. A Standard TCP listener can pass encrypted bytes to a backend, but does not terminate HTTPS itself.

=== "API"

    <span id="with-the-api" data-docs-method="API"></span>

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "location": "loc_example",
      "display_name": "web-lb",
      "subnet_id": "snet_example",
      "offering": "default",
      "listeners": [
        {
          "protocol": "TCP",
          "port": 80,
          "pool": {
            "algorithm": "ROUND_ROBIN",
            "members": [
              {
                "address": "192.0.2.20",
                "port": 8080
              }
            ]
          }
        }
      ]
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#post-load-balancer).


## Add a listener

=== "Console"

    Open the load balancer's **Listeners** tab and choose **Add listener**. Set its name, protocol and port, then choose the pool. HTTPS termination requires an Application offering and a certificate in this project and location. A listener without a pool accepts no application traffic.

    ![Add a listener to the load balancer](../assets/screens/networking/load-balancer-add-listener.webp)

=== "API"

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/listeners" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "display_name": "https",
      "protocol": "TERMINATED_HTTPS",
      "port": 443,
      "certificate_id": "crt_example",
      "pool_id": "lbp_example"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#create-load-balancer-listener).

    Where the body has `expected`, the all-zero hash is an example: replace it with the current `lb_configuration.version` you read. Protocol and port are fixed after listener creation.


## Edit or delete a listener

=== "Console"

    Use **Edit listener** to rename it or change its default pool. Protocol and port are fixed; add another listener for a new protocol or port. **Delete listener** removes the incoming endpoint, retaining the pool and backend instances.

=== "API"

    **Change a listener**

    ```bash
    curl --fail-with-body -i -X PATCH "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/listeners/$CHILD_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "expected": "0000000000000000000000000000000000000000000000000000000000000000",
      "certificate_id": "crt_replacement"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#update-load-balancer-listener).

    **Delete a listener**

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/listeners/$CHILD_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "expected": "0000000000000000000000000000000000000000000000000000000000000000"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#delete-load-balancer-listener).

    Where the body has `expected`, the all-zero hash is an example: replace it with the current `lb_configuration.version` you read. Protocol and port are fixed after listener creation.


## Create or change a pool

=== "Console"

    On **Listeners**, choose **Add pool** and select its protocol and balancing algorithm. **Edit pool** changes its name or algorithm. Keep its protocol compatible with the listener. Inspect all listeners using a shared pool before changing it.

    ![The listener, pool and member relationships](../assets/screens/networking/load-balancer-listeners.webp)

=== "API"

    **Add a pool**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/pools" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "display_name": "web-pool",
      "protocol": "HTTP",
      "algorithm": "ROUND_ROBIN"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#create-load-balancer-pool).

    **Change a pool**

    ```bash
    curl --fail-with-body -i -X PATCH "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/pools/$CHILD_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "expected": "0000000000000000000000000000000000000000000000000000000000000000",
      "algorithm": "ROUND_ROBIN"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#update-load-balancer-pool).

    Where the body has `expected`, the all-zero hash is an example: replace it with the current `lb_configuration.version` you read. Protocol and port are fixed after listener creation.


## Change pool members

=== "Console"

    Use **Change members** to save the complete intended backend list, including private address and application port. Members must be reachable from the load balancer's subnet. An instance group can manage its own pool membership; manual changes to those members can be reversed by the group.

=== "API"

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/pools/$POOL_ID/members:replace" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "members": [
        {
          "address": "192.0.2.20",
          "port": 8080
        }
      ]
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#put-lb-members).

    Where the body has `expected`, the all-zero hash is an example: replace it with the current `lb_configuration.version` you read. Protocol and port are fixed after listener creation.


## Configure a health check

=== "Console"

    Set the pool's health check type, interval, timeout and retry count. Match HTTP checks to an application-readiness path and success codes where offered. An active instance is not proof that its application is ready. **Remove health check** stops checking that pool.

=== "API"

    **Set a pool's health check**

    ```bash
    curl --fail-with-body -i -X POST "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/pools/$POOL_ID/health-monitor" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "type": "HTTP",
      "delay": 10,
      "timeout": 5,
      "max_retries": 3
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#set-health-monitor).

    **Remove a pool's health check**

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/pools/$POOL_ID/health-monitor" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#clear-health-monitor).


## HTTPS and certificate rotation

=== "Console"

    Upload the replacement certificate first. Edit the HTTPS listener, choose the new certificate and follow the operation. Verify the certificate served at your domain before deleting the old one. Each HTTPS listener currently uses one certificate; multiple certificates on one listener through SNI are coming later.

    ![Select the replacement certificate](../assets/screens/networking/certificate-switch.webp)

=== "API"

    ```bash
    curl --fail-with-body -i -X PATCH "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/listeners/$CHILD_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "expected": "0000000000000000000000000000000000000000000000000000000000000000",
      "certificate_id": "crt_replacement"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#update-load-balancer-listener).

    Where the body has `expected`, the all-zero hash is an example: replace it with the current `lb_configuration.version` you read. Protocol and port are fixed after listener creation.


## Delete a pool

=== "Console"

    Move or remove listeners that reference it, remove its members and health check, then choose **Delete pool**. The refusal names remaining dependencies. Backend instances and the load balancer remain.

=== "API"

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID/pools/$CHILD_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY" \
      -H "Content-Type: application/json" \
      --data '{
      "expected": "0000000000000000000000000000000000000000000000000000000000000000"
    }'
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#delete-load-balancer-pool).

    Where the body has `expected`, the all-zero hash is an example: replace it with the current `lb_configuration.version` you read. Protocol and port are fixed after listener creation.


## Delete the load balancer

=== "Console"

    Delete the balancer from **Manage → Delete** and review the confirmation. Its listeners, pools, members and health checks are removed; backend instances and uploaded certificates remain. Detach and release public IPs separately as required by the refusal or confirmation.

    The create body allows at most 10 listeners, and a pool body at most 100 members. The location's offering and project quota may impose lower limits. Changes can briefly affect connections; wait for each operation before submitting a dependent change.

=== "API"

    ```bash
    curl --fail-with-body -i -X DELETE "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/load-balancers/$LB_ID" \
      -H "Authorization: Bearer $NUBESTACK_API_KEY" \
      -H "Idempotency-Key: $REQUEST_KEY"
    ```

    A `202` accepts the change. Follow `operation.href` to its final result before the next dependent action.

    [Request fields and responses](/api/reference/load-balancers.md#delete-load-balancer).
