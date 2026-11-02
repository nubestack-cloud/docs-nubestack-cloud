// The documentation's screenshots: where each is taken and what is captured. Names map to
// docs/assets/screens/<name>.webp, which the pages import.
import type { Page } from "playwright";
import type { Shot } from "./take.ts";
import { ID, INVITATION_ID, INVITEE, ORG, PROJECT, SERVICE_ACCOUNT, TEMPLATE } from "./world.ts";

const org = (section: string) => `/orgs/${ORG}/${section}`;
const project = (section: string) => `/orgs/${ORG}/projects/${PROJECT}/${section}`;

/** Opens a row's or a page's Manage menu: the button named "Manage <name>", or the first "Manage". */
const manage = (name?: string) => async (page: Page) => {
  const button = name ? page.getByRole("button", { name: `Manage ${name}`, exact: true }) : page.getByRole("button", { name: /^Manage/ });
  await button.first().click();
  await page.waitForTimeout(200);
};
const click = (name: string | RegExp, role: "button" | "link" | "tab" = "button") => async (page: Page) => {
  await page.getByRole(role, { name }).first().click();
  await page.waitForTimeout(300);
};
/** Opens a menu item from the open Manage menu. */
const item = (name: string | RegExp) => async (page: Page) => {
  await page.locator(".row-menu-item, [role=menuitem]").filter({ hasText: name }).first().click();
  await page.waitForTimeout(400);
};
/** Clicks the first element in the content panel showing this text; skips it when there is none. */
const pick = (text: string | RegExp) => async (page: Page) => {
  const radio = page.locator("main.content").getByRole("radio", { name: text }).filter({ visible: true }).first();
  const target = (await radio.count()) ? radio
    : page.locator("main.content").getByText(text, { exact: typeof text === "string" }).filter({ visible: true }).first();
  if (await target.count()) { await target.click({ timeout: 5000 }).catch(() => undefined); await page.waitForTimeout(300); }
};
const fill = (label: string | RegExp, value: string) => async (page: Page) => {
  const content = page.locator("main.content");
  const labelled = content.getByLabel(label);
  const controls = labelled.and(content.locator("input, textarea"));
  const field = (await controls.count()) ? controls.first() : labelled.locator("input, textarea").first();
  if (await field.count()) { await field.fill(value); await page.waitForTimeout(150); }
};
const chain = (...steps: ((page: Page) => Promise<void>)[]) => async (page: Page) => { for (const s of steps) await s(page); };

export const SHOTS: Shot[] = [
  // Customer-guide review: task details and dialogs missing from the original set.
  { name: "compute/image-create", path: project("images"), wait: "main h1", act: click("Create image"), clip: "dialog" },
  { name: "compute/instance-tags", path: project(`instances/${ID.web1}`), wait: "main h1", act: click(/^Tags/, "tab"), clip: "main" },
  { name: "storage/snapshot-restore", path: project(`volumes/new?snapshot=${ID.snap}`), wait: "main h1", clip: "main", height: 1200,
    act: fill(/^Name$/, "db-data-restored") },
  { name: "storage/volume-snapshot", path: project("volumes"), wait: "scratch", act: chain(manage("scratch"), item(/Create snapshot/)), clip: "dialog" },
  { name: "networking/network-ranges", path: project(`networks/${ID.netApp}`), wait: "main h1", act: chain(click(/^Address range/, "tab"), click("Edit ranges")), clip: "dialog", height: 1100 },
  // Spec 070 §12: an HTTPS listener's certificates, the default and the ones served by host name.
  { name: "security/listener-certificates", path: project(`load-balancers/${ID.lb}`), wait: "main h1", clip: "dialog", height: 1100,
    act: chain(click(/^Listeners/, "tab"), click(/^Change certificates/)) },
  { name: "security/listener-sni", path: project(`load-balancers/${ID.lb}`), wait: "main h1", clip: "main", height: 1300,
    act: click(/^Listeners/, "tab") },
  { name: "security/second-factor", path: org("settings"), wait: "main h1", clip: "main", height: 1000,
    act: click(/^Security/, "tab") },
  { name: "organization/quota-presets", path: org("quota-presets"), wait: "main h1", clip: "main" },
  { name: "organization/quota-requests", path: org("quota-requests"), wait: "main h1", clip: "main" },
  { name: "organization/member-project-roles", path: org("members"), wait: "Bilal Ahmed", act: chain(manage("Bilal Ahmed"), item("Project roles")), clip: "dialog" },
  { name: "organization/notifications", path: org("notifications"), wait: "main h1", clip: "main" },
  { name: "organization/quota-request", path: org("quota-requests/new"), wait: "main h1", clip: "main", height: 1200 },
  // Get started
  { name: "get-started/org-overview", path: org("overview"), wait: "main h1" },
  { name: "get-started/projects", path: org("projects"), wait: "web-shop", clip: "main" },
  { name: "get-started/new-project", path: org("projects/new"), wait: "main h1", clip: "main", height: 1300 },
  { name: "get-started/project-overview", path: project("overview"), wait: "main h1" },

  // Compute
  { name: "compute/instances-list", path: project("instances"), wait: "web-1", clip: "main" },
  { name: "compute/instance-create", path: project("instances/new"), wait: "main h1", height: 2600, clip: "main",
    act: chain(pick("Karachi"), fill(/^Name$/, "web-3"), pick("Medium"), pick("Ubuntu 24.04"), pick("app"), pick("ayesha-laptop")) },
  { name: "compute/instance-resize", path: project("instances"), wait: "web-1", act: chain(manage("web-1"), item("Resize")), clip: "dialog" },
  { name: "compute/instance-delete", path: project("instances"), wait: "web-1", act: chain(manage("web-2"), item("Delete")), clip: "dialog" },
  { name: "compute/instance-networks", path: project(`instances/${ID.web1}?tab=networks`), wait: "main h1", clip: "main",
    act: click(/^Networks/, "tab") },
  { name: "compute/instance-console-log", path: project(`instances/${ID.web1}`), wait: "main h1", clip: "main",
    act: click(/^Console log/, "tab") },
  { name: "compute/instance-detail", path: project(`instances/${ID.web1}`), wait: "main h1", clip: "main", height: 1100 },
  { name: "compute/instance-manage-menu", path: project("instances"), wait: "web-1", act: manage("web-1"), clip: "main" },
  { name: "compute/ssh-keys", path: project("key-pairs"), wait: "ayesha-laptop", clip: "main" },
  { name: "compute/ssh-key-add", path: project("key-pairs/new"), wait: "main h1", clip: "main" },
  { name: "compute/images", path: project("images"), wait: "web-golden", clip: "main" },
  { name: "compute/server-groups", path: project("server-groups"), wait: "web-spread", clip: "main" },
  { name: "compute/server-group-create", path: project("server-groups/new"), wait: "main h1", clip: "main", act: chain(pick("Karachi"), fill(/^Name$/, "web-spread")) },
  { name: "compute/launch-templates", path: project("launch-templates"), wait: "main h1", clip: "main" },
  { name: "compute/launch-template-detail", path: project(`launch-templates/${TEMPLATE.id}`), wait: "main h1", clip: "main", height: 1300 },
  { name: "compute/instance-groups", path: project("instance-groups"), wait: "batch-workers", clip: "main" },
  { name: "compute/instance-group-detail", path: project(`instance-groups/${ID.group}`), wait: "main h1", clip: "main", height: 1200 },
  { name: "compute/instance-group-create", path: project("instance-groups/new"), wait: "main h1", clip: "main", height: 1300 },

  // Networking
  { name: "networking/topology", path: project("network-topology"), wait: "main h1", height: 1000 },
  { name: "networking/networks", path: project("networks"), wait: "main h1", clip: "main" },
  { name: "networking/network-create", path: project("networks/new"), wait: "main h1", clip: "main", height: 1400, act: chain(pick("Karachi"), fill(/^Name$/, "app-private"), fill(/^Range/, "10.20.0.0/24")) },
  { name: "networking/routing", path: project("routing"), wait: "main h1", clip: "main" },
  { name: "networking/internet-gateways", path: project("internet-gateways"), wait: "main h1", clip: "main" },
  { name: "networking/security-groups", path: project("security-groups"), wait: "ssh-office", clip: "main" },
  { name: "networking/security-group-rules", path: project(`security-groups/${ID.sgWeb}`), wait: "main h1", clip: "main", height: 1200,
    act: click(/^Rules/, "tab") },
  { name: "networking/public-ips", path: project("public-ips"), wait: "203.0.113.21", clip: "main" },
  { name: "networking/public-ip-attach", path: project("public-ips"), wait: "198.51.100.7", act: chain(manage("198.51.100.7"), item(/^Attach/)), clip: "dialog" },
  { name: "networking/public-ip-allocate", path: project("public-ips/new"), wait: "main h1", clip: "main" },
  { name: "networking/security-group-create", path: project("security-groups/new"), wait: "main h1", clip: "main", height: 1200 },
  { name: "networking/load-balancers", path: project("load-balancers"), wait: "web-lb", clip: "main" },
  { name: "networking/load-balancer-create", path: project("load-balancers/new"), wait: "main h1", clip: "main", height: 1700 },
  { name: "networking/load-balancer-detail", path: project(`load-balancers/${ID.lb}`), wait: "main h1", clip: "main", height: 1300 },

  // Storage
  { name: "storage/volumes", path: project("volumes"), wait: "db-data", clip: "main" },
  { name: "storage/volume-create", path: project("volumes/new"), wait: "main h1", clip: "main", height: 1200, act: chain(pick("Karachi"), fill(/^Name$/, "app-data"), fill(/^Size/, "20")) },
  { name: "storage/volume-attach", path: project("volumes"), wait: "scratch", act: chain(manage("scratch"), item(/^Attach/)), clip: "dialog" },
  { name: "storage/volume-extend", path: project("volumes"), wait: "scratch", act: chain(manage("scratch"), item(/^Extend/)), clip: "dialog" },
  { name: "storage/volume-detail", path: project(`volumes/${ID.volDb}`), wait: "main h1", clip: "main", height: 1100 },
  { name: "storage/snapshots", path: project("snapshots"), wait: "db-data-before-upgrade", clip: "main" },
  { name: "storage/schedules", path: project("schedules"), wait: "nightly", clip: "main" },
  { name: "storage/schedule-create", path: project("schedules/new"), wait: "main h1", clip: "main", height: 1300 },

  // Security
  { name: "security/certificates", path: project("certificates"), wait: "www-2026", clip: "main" },
  { name: "security/certificate-upload", path: project("certificates/new"), wait: "main h1", clip: "main", height: 1300 },
  { name: "security/certificate-detail", path: project(`certificates/${ID.certWww}`), wait: "main h1", clip: "main" },

  // Organization
  { name: "organization/members", path: org("members"), wait: "Bilal Ahmed", clip: "main" },
  { name: "organization/invite", path: org("members/invite"), wait: "main h1", clip: "main", height: 1100, act: fill(/^E-mail$/, "zain@acme.example") },
  { name: "organization/roles", path: org("roles"), wait: "Deployer", clip: "main" },
  { name: "organization/role-create", path: org("roles/new"), wait: "main h1", clip: "main", height: 1200 },
  { name: "organization/service-accounts", path: org("service-accounts"), wait: "automation-prod", clip: "main" },
  { name: "organization/service-account", path: org(`service-accounts/${SERVICE_ACCOUNT.id}`), wait: "main h1", clip: "main", height: 1100 },
  { name: "organization/settings", path: org("settings"), wait: "main h1", clip: "main", height: 1100 },
  { name: "organization/audit-log", path: org("activity"), wait: "main h1", clip: "main" },
  { name: "organization/quota", path: org("quota"), wait: "main h1", clip: "main", height: 1100 },
  { name: "organization/usage", path: org("usage"), wait: "main h1", clip: "main", height: 1100 },
  { name: "organization/statements", path: org("statements"), wait: "main h1", clip: "main", height: 1200 },
  { name: "organization/cost-explorer", path: org("billing/costs"), wait: "main h1", clip: "main", height: 1100 },

  // Project
  { name: "concepts/project-quota", path: project("quota"), wait: "main h1", clip: "main", height: 1100 },
  { name: "concepts/project-access", path: project("settings?tab=access"), wait: "main h1", clip: "main" },
  { name: "concepts/project-locations", path: project("settings?tab=locations"), wait: "main h1", clip: "main" },
  { name: "concepts/project-delete", path: project("settings?tab=danger"), wait: "main h1",
    act: click("Delete project"), clip: "dialog", height: 1100 },
  { name: "concepts/operation", path: project(`operations/op_01jbweb2create000000000001`), wait: "main h1", clip: "main" },
  { name: "concepts/project-activity", path: project("activity"), wait: "main h1", clip: "main" },

  // Invitations
  { name: "get-started/invitation-signed-out", path: `/invite/${ORG}/${INVITATION_ID}#docs-example-secret`, wait: "h1", signedOut: true },
  { name: "get-started/invitation-accept", path: `/invite/${ORG}/${INVITATION_ID}#docs-example-secret`, wait: "h1",
    mock: { extra: { "/v1/me": INVITEE } } },

  // Service account key
  { name: "organization/api-key-new", path: org(`service-accounts/${SERVICE_ACCOUNT.id}/keys/new`), wait: "main h1", clip: "main" },

  // Native access
  { name: "native-access/consoles-and-cli", path: project("cloud-access"), wait: "main h1", clip: "main", height: 1000 },

];
