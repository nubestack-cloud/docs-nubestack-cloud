# Documentation completion report

The customer documentation now uses MkDocs 1.6.1 and Material 9.7.7. Astro, Starlight, their integrations, configuration, source structure and dependencies have been removed. Existing useful drafts and brand assets were preserved.

## Design

The replacement design was built from a blank stylesheet: neutral surfaces, a compact header, service navigation in a persistent sidebar, restrained teal links, readable articles and a practical homepage. Desktop and phone layouts support light and dark themes. The previous banner, custom colors and card styling were discarded.

## Coverage

52 authored pages cover onboarding, concepts, compute, networking, storage, certificates, organization administration, API usage, native access and help. The generated reference covers 228 operations in 26 service groups and 323 request/response schemas. The errors guide generates a table of 189 customer problem codes.

### Guides

- **get-started:** [account](docs/get-started/account.md), [create-a-project](docs/get-started/create-a-project.md), [first-instance](docs/get-started/first-instance.md), [organizations](docs/get-started/organizations.md).
- **concepts:** [deletion-and-retention](docs/concepts/deletion-and-retention.md), [limits](docs/concepts/limits.md), [locations](docs/concepts/locations.md), [operations](docs/concepts/operations.md), [projects-and-quotas](docs/concepts/projects-and-quotas.md), [roles-and-permissions](docs/concepts/roles-and-permissions.md), [tags](docs/concepts/tags.md), [usage-and-costs](docs/concepts/usage-and-costs.md).
- **compute:** [images](docs/compute/images.md), [instance-groups](docs/compute/instance-groups.md), [instances](docs/compute/instances.md), [launch-templates](docs/compute/launch-templates.md), [manage-instances](docs/compute/manage-instances.md), [server-groups](docs/compute/server-groups.md), [ssh-keys](docs/compute/ssh-keys.md).
- **networking:** [internet-gateways](docs/networking/internet-gateways.md), [load-balancers](docs/networking/load-balancers.md), [network-map](docs/networking/network-map.md), [networks](docs/networking/networks.md), [public-ips](docs/networking/public-ips.md), [routing](docs/networking/routing.md), [security-groups](docs/networking/security-groups.md).
- **storage:** [schedules](docs/storage/schedules.md), [snapshots](docs/storage/snapshots.md), [volumes](docs/storage/volumes.md).
- **security:** [certificates](docs/security/certificates.md).
- **organization:** [activity](docs/organization/activity.md), [custom-roles](docs/organization/custom-roles.md), [members](docs/organization/members.md), [quota](docs/organization/quota.md), [service-accounts](docs/organization/service-accounts.md), [settings](docs/organization/settings.md), [statements-and-costs](docs/organization/statements-and-costs.md), [usage](docs/organization/usage.md).
- **api:** [authentication](docs/api/authentication.md), [errors](docs/api/errors.md), [operations](docs/api/operations.md), [overview](docs/api/overview.md), [requests](docs/api/requests.md).
- **native-access:** [horizon](docs/native-access/horizon.md), [openstack-cli](docs/native-access/openstack-cli.md), [overview](docs/native-access/overview.md).
- **tools:** [cli](docs/tools/cli.md), [terraform](docs/tools/terraform.md).
- **help:** [glossary](docs/help/glossary.md), [support](docs/help/support.md), [troubleshooting](docs/help/troubleshooting.md).

## Screenshots

75 console screenshots were regenerated from the real portal using only the documentation mock world, a 1365px viewport, scale factor 2 and light theme. Network calls outside the local portal are blocked. The runner checks rendered text and retains a text audit beside each screenshot scenario; it crops empty panel padding and stops its Vite process. No product source or test fixture was edited.

- **compute:** [images](docs/assets/screens/compute/images.webp), [instance-console-log](docs/assets/screens/compute/instance-console-log.webp), [instance-create](docs/assets/screens/compute/instance-create.webp), [instance-delete](docs/assets/screens/compute/instance-delete.webp), [instance-detail](docs/assets/screens/compute/instance-detail.webp), [instance-group-create](docs/assets/screens/compute/instance-group-create.webp), [instance-group-detail](docs/assets/screens/compute/instance-group-detail.webp), [instance-groups](docs/assets/screens/compute/instance-groups.webp), [instance-manage-menu](docs/assets/screens/compute/instance-manage-menu.webp), [instance-networks](docs/assets/screens/compute/instance-networks.webp), [instance-resize](docs/assets/screens/compute/instance-resize.webp), [instances-list](docs/assets/screens/compute/instances-list.webp), [launch-template-detail](docs/assets/screens/compute/launch-template-detail.webp), [launch-templates](docs/assets/screens/compute/launch-templates.webp), [server-group-create](docs/assets/screens/compute/server-group-create.webp), [server-groups](docs/assets/screens/compute/server-groups.webp), [ssh-key-add](docs/assets/screens/compute/ssh-key-add.webp), [ssh-keys](docs/assets/screens/compute/ssh-keys.webp).
- **concepts:** [operation](docs/assets/screens/concepts/operation.webp), [project-access](docs/assets/screens/concepts/project-access.webp), [project-activity](docs/assets/screens/concepts/project-activity.webp), [project-delete](docs/assets/screens/concepts/project-delete.webp), [project-locations](docs/assets/screens/concepts/project-locations.webp), [project-quota](docs/assets/screens/concepts/project-quota.webp), [project-settings](docs/assets/screens/concepts/project-settings.webp).
- **get-started:** [invitation-accept](docs/assets/screens/get-started/invitation-accept.webp), [invitation-signed-out](docs/assets/screens/get-started/invitation-signed-out.webp), [new-project](docs/assets/screens/get-started/new-project.webp), [org-overview](docs/assets/screens/get-started/org-overview.webp), [project-overview](docs/assets/screens/get-started/project-overview.webp), [projects](docs/assets/screens/get-started/projects.webp).
- **native-access:** [consoles-and-cli](docs/assets/screens/native-access/consoles-and-cli.webp).
- **networking:** [internet-gateways](docs/assets/screens/networking/internet-gateways.webp), [load-balancer-add-listener](docs/assets/screens/networking/load-balancer-add-listener.webp), [load-balancer-create](docs/assets/screens/networking/load-balancer-create.webp), [load-balancer-detail](docs/assets/screens/networking/load-balancer-detail.webp), [load-balancer-listeners](docs/assets/screens/networking/load-balancer-listeners.webp), [load-balancers](docs/assets/screens/networking/load-balancers.webp), [network-create](docs/assets/screens/networking/network-create.webp), [network-detail](docs/assets/screens/networking/network-detail.webp), [networks](docs/assets/screens/networking/networks.webp), [public-ip-allocate](docs/assets/screens/networking/public-ip-allocate.webp), [public-ip-attach](docs/assets/screens/networking/public-ip-attach.webp), [public-ips](docs/assets/screens/networking/public-ips.webp), [routing](docs/assets/screens/networking/routing.webp), [security-group-create](docs/assets/screens/networking/security-group-create.webp), [security-group-rules](docs/assets/screens/networking/security-group-rules.webp), [security-groups](docs/assets/screens/networking/security-groups.webp), [topology](docs/assets/screens/networking/topology.webp).
- **organization:** [api-key-new](docs/assets/screens/organization/api-key-new.webp), [audit-log](docs/assets/screens/organization/audit-log.webp), [cost-explorer](docs/assets/screens/organization/cost-explorer.webp), [invite](docs/assets/screens/organization/invite.webp), [members](docs/assets/screens/organization/members.webp), [quota](docs/assets/screens/organization/quota.webp), [role-create](docs/assets/screens/organization/role-create.webp), [roles](docs/assets/screens/organization/roles.webp), [service-account](docs/assets/screens/organization/service-account.webp), [service-accounts](docs/assets/screens/organization/service-accounts.webp), [settings](docs/assets/screens/organization/settings.webp), [statement-open](docs/assets/screens/organization/statement-open.webp), [statements](docs/assets/screens/organization/statements.webp), [usage](docs/assets/screens/organization/usage.webp).
- **security:** [certificate-detail](docs/assets/screens/security/certificate-detail.webp), [certificate-upload](docs/assets/screens/security/certificate-upload.webp), [certificates](docs/assets/screens/security/certificates.webp).
- **storage:** [schedule-create](docs/assets/screens/storage/schedule-create.webp), [schedules](docs/assets/screens/storage/schedules.webp), [snapshots](docs/assets/screens/storage/snapshots.webp), [volume-attach](docs/assets/screens/storage/volume-attach.webp), [volume-create](docs/assets/screens/storage/volume-create.webp), [volume-detail](docs/assets/screens/storage/volume-detail.webp), [volume-extend](docs/assets/screens/storage/volume-extend.webp), [volume-manage-menu](docs/assets/screens/storage/volume-manage-menu.webp), [volumes](docs/assets/screens/storage/volumes.webp).

## Deliberately unavailable or provisional

- Dedicated NubeStack CLI and Terraform provider: coming later. No invented installation commands or provider resources.
- Several certificates on one HTTPS listener through SNI: coming later.
- Support contact and public API origin: explicit placeholders until NubeStack supplies production details.
- Usage, statements and cost explorer: provisional; no promised payment, tax or final invoicing behavior.
- Large-project network-map grouping and operation links: described as still being improved.
- Screenshots demonstrate the mocked console, not validation against a production cloud.

## Verification

Strict MkDocs builds validate navigation, document paths and section anchors. `scripts/check.py` additionally checks built HTML links and assets, the search index, screenshot text audits, customer sample-data restrictions and unfinished stubs. `scripts/check-browser.ts` exercises the built site in desktop/mobile light and dark themes, search navigation and theme persistence. The checked-in CI workflow builds and runs the static checks.

Validation passed on 2 November 2026:

- Strict build and the built-site checker: 81 HTML pages, no broken local links or anchors, complete search and screenshot text audits.
- Browser checks: 1440px and 390px, light and dark; homepage, articles, generated reference, actual search-result navigation, mobile menu and persisted theme selection.
- All 75 screenshot scenarios regenerated successfully with tighter crops.
- All 15 generated service example bodies validated against the customer OpenAPI schemas.
- Nexus product working tree remained unchanged.

Work is committed locally and is not pushed or deployed.
