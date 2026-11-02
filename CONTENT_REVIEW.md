# Customer guide content review

Audience: people using NubeStack Cloud to run workloads, and organization/project administrators managing their own account. Platform installation, underlying cloud administration and provider operator workflows are outside this site.

The product checkout is read-only. Source paths below are reviewer evidence, not customer instructions. Every published feature is described within the current console/API behavior; screenshot captures use a local mocked API and cannot demonstrate production-cloud validation.

| Area | Customer guides | Coverage checked | Product evidence in `../nexus` |
|---|---|---|---|
| Account and console | [get-started/account.md](docs/get-started/account.md); [get-started/console.md](docs/get-started/console.md) | Invitations, second factor, organization/project switching, list freshness and operation notices | `portal/src/pages/Invite.tsx; portal/src/Shell.tsx` |
| Project lifecycle | [organization/projects.md](docs/organization/projects.md); [concepts/deletion-and-retention.md](docs/concepts/deletion-and-retention.md) | Grants, adding/removing locations, cascade vs empty-only deletion, cancellation and resumption | `portal/src/pages/ProjectSettings.tsx` |
| Instances | [compute/instances.md](docs/compute/instances.md); [compute/manage-instances.md](docs/compute/manage-instances.md) | Creation, user data, data disks, console and log, lifecycle actions, rebuild, resize, rescue, connections and deletion | `portal/src/pages/CreateInstance.tsx; portal/src/pages/ServerDetail.tsx` |
| Images and keys | [compute/images.md](docs/compute/images.md); [compute/ssh-keys.md](docs/compute/ssh-keys.md) | Project images vs catalog choices, saved system disks, public SSH keys and ownership | `portal/src/pages/Images.tsx; portal/src/pages/KeyPairs.tsx` |
| Reusable compute | [compute/launch-templates.md](docs/compute/launch-templates.md); [compute/server-groups.md](docs/compute/server-groups.md); [compute/instance-groups.md](docs/compute/instance-groups.md) | Template versions, bulk launch, host policy, replacement, manual/scheduled counts and keep/delete choices | `portal/src/pages/LaunchTemplates.tsx; portal/src/pages/ServerGroups.tsx; portal/src/pages/InstanceGroups.tsx` |
| Networking | [networking/index.md](docs/networking/index.md); [networking/networks.md](docs/networking/networks.md); [networking/routing.md](docs/networking/routing.md) | Ranges, DHCP/static allocations, private routing, gateway, static routes and forwarding | `portal/src/pages/CreateNetwork.tsx; portal/src/pages/NetworkSubnets.tsx; portal/src/pages/Routing.tsx` |
| Access to services | [networking/security-groups.md](docs/networking/security-groups.md); [networking/public-ips.md](docs/networking/public-ips.md) | Additive firewall rules, public IP allocation, associations, tags, detach/release and dependencies | `portal/src/pages/Firewall.tsx; portal/src/pages/ServerConnections.tsx` |
| Load balancing and HTTPS | [networking/load-balancers.md](docs/networking/load-balancers.md); [security/certificates.md](docs/security/certificates.md) | Standard vs Application types, listener/pool/member/check tree, certificate upload/switch, no multi-certificate SNI promise | `portal/src/pages/LoadBalancers.tsx; portal/src/pages/LbChildren.tsx; portal/src/pages/Certificates.tsx` |
| Topology | [networking/network-map.md](docs/networking/network-map.md) | Resource relationships, location filters and stale/partial information; no connectivity-test claim | `portal/src/pages/NetworkTopology.tsx` |
| Persistent storage | [storage/volumes.md](docs/storage/volumes.md); [tutorials/persistent-storage.md](docs/tutorials/persistent-storage.md) | Creation, attachment, guest filesystem steps, detach/extend/type/bootable/move, and deletion blockers | `portal/src/pages/Volumes.tsx` |
| Recovery | [storage/snapshots.md](docs/storage/snapshots.md); [tutorials/recover-a-volume.md](docs/tutorials/recover-a-volume.md) | Same-storage limitation, detached manual snapshot, new-volume restoration, rename and recovery testing | `portal/src/pages/Snapshots.tsx; portal/src/pages/ResourceDetail.tsx` |
| Schedules | [storage/schedules.md](docs/storage/schedules.md); [tutorials/scale-an-application.md](docs/tutorials/scale-an-application.md) | Backup-kind snapshot schedules, power and group sizes, edits, creator permissions, retention and kept snapshots | `portal/src/pages/Schedules.tsx` |
| People and automation | [organization/members.md](docs/organization/members.md); [organization/custom-roles.md](docs/organization/custom-roles.md); [organization/service-accounts.md](docs/organization/service-accounts.md) | Invites and roles, custom actions, API key issue/rotation/revocation, project grants and native credentials | `portal/src/pages/Members.tsx; portal/src/pages/Roles.tsx; portal/src/pages/ServiceAccounts.tsx` |
| Policy and notices | [organization/settings.md](docs/organization/settings.md); [organization/notifications.md](docs/organization/notifications.md) | Second factor, domains, audit/export, closure and personal optional/always-sent notices | `portal/src/pages/OrgSettings.tsx; portal/src/pages/NotificationPreferences.tsx` |
| Quota and reporting | [organization/quota.md](docs/organization/quota.md); [organization/usage.md](docs/organization/usage.md); [organization/statements-and-costs.md](docs/organization/statements-and-costs.md) | Allocation vs capacity, increase requests, provisional quantities, rates, estimates and unrated amounts | `portal/src/pages/QuotaRequests.tsx; portal/src/pages/Usage.tsx; portal/src/pages/CostExplorer.tsx` |
| API | [api/overview.md](docs/api/overview.md); [api/requests.md](docs/api/requests.md); [api/operations.md](docs/api/operations.md); [api/errors.md](docs/api/errors.md) | Bearer identity, idempotency, ETags, pagination, operations and problem codes; all customer operations in generated reference | `openapi/v1.json; broker/nexus/api/problems.py` |
| Native tools | [native-access/overview.md](docs/native-access/overview.md); [native-access/horizon.md](docs/native-access/horizon.md); [native-access/openstack-cli.md](docs/native-access/openstack-cli.md) | Customer Horizon sign-in, secret-free device configuration and noninteractive service-account credentials | `portal/src/pages/CloudsDirectly.tsx; portal/src/pages/ProjectCloudAccess.tsx` |

## Substantive corrections

- Snapshots and backup-kind schedules are same-storage recovery points, not separate-storage backups. The image-backed instance system disk is not included in an attached-volume snapshot schedule.
- Compute → Images lists saved project images; published operating-system choices are selected during instance creation.
- Individual deletion is final after successful operation completion, rather than immediately on acceptance.
- Network range editing is on the Address range tab; the HTTPS action is Switch certificate.
- Provisional statements do not imply implemented payment collection, taxes or a final invoice workflow.
- API and Console procedures share prerequisites and verification; credentials, version checks and response status remain endpoint-specific.

## Deliberate limitations

The dedicated NubeStack CLI and Terraform provider, multiple-certificate SNI and separate-storage backup service are not presented as available. API origin and support contact remain explicit placeholders until NubeStack supplies production details. Large-project topology limitations and resource freshness are explained.
