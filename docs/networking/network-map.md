---
methods: true
title: Network map
---

# Network map

The network map shows how your project's networks, routers, instances, load balancers and public IPs connect. Use it to find a missing path or understand which resources a network change affects.

![The network topology of web-shop](../assets/screens/networking/topology.webp)

## Read the map

1. Open **Networking → Network topology** in a project, or choose **View topology** on its overview.
2. Select a location to focus on one cloud.
3. Follow connections from an instance to its network and router. For an Internet-facing service, check its public IP and gateway as well.
4. Select a node to open its resource page and inspect the configuration there.

The organization also has a topology view for resources you are allowed to see. A visible line describes known configuration; it does not test connectivity or show whether a guest firewall accepts traffic.

## Missing or stale data

Read the freshness and partial-data notices. If one location is unavailable, the view can show what was last known and data from the other locations. An empty map can mean an empty project, a filter, missing access or resources not yet read. Use a resource list's **Refresh** before assuming a resource is gone.

The map is most useful for smaller projects. Large-project grouping and operation links are still being improved. Use lists and resource detail pages when the map becomes crowded.

## With the API

```bash
curl --fail-with-body "$NUBESTACK_API/v1/orgs/$ORG/projects/$PROJECT/network-topology" \
  -H "Authorization: Bearer $NUBESTACK_API_KEY"
```

This is a read request returning `200`, with no operation. The organization view is `GET /v1/orgs/{org_id}/network-topology`. Consult the [reference](/api/reference/index.md) for filters and response fields.

The map creates and deletes nothing. Make changes on the relevant [network](/networking/networks.md), [routing](/networking/routing.md) or [instance](/compute/manage-instances.md) page.
