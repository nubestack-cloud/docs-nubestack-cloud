// Answers the customer API in the browser with the sample world (world.ts), the way the Nexus
// portal's own mock (portal/e2e/mock-api.ts) does for its tests. The joins that work out a
// resource's attachments and the network map are imported from that mock, so they stay the
// product's; everything else here is this site's sample data.
import type { Page } from "playwright";
import * as W from "./world.ts";

type Helpers = {
  relatedOf: (collection: string, id: string, lists: Record<string, unknown[]>) => unknown;
  topologyOf: (lists: Record<string, unknown[]>, query: URLSearchParams, placements: unknown[]) => unknown;
  launchesOf: (query: URLSearchParams, launches: unknown[]) => unknown;
};

const envelope = (items: unknown[]) => ({ items, next_cursor: null, complete: true, sources: [] });
// The Nexus mock's helpers name its own organization and project in links; use ours.
const ours = (value: unknown) => JSON.parse(JSON.stringify(value).replaceAll("org_mock", W.ORG).replaceAll("prj_mock", W.PROJECT));

export interface MockOptions {
  /** The project role the signed-in person holds on web-shop. */
  role?: string;
  /** Extra answers for a shot, tried first: path (after /api) → JSON, or a function of the URL. */
  extra?: Record<string, unknown | ((url: URL) => unknown)>;
}

export async function installMock(page: Page, helpers: Helpers, options: MockOptions = {}): Promise<void> {
  const O = `/v1/orgs/${W.ORG}`;
  const P = `${O}/projects/${W.PROJECT}`;
  const projects = W.PROJECTS.map((p) => (p.id === W.PROJECT && options.role ? { ...p, your_role: options.role } : p));
  let opCount = 0;

  await page.route("**/auth/session", (route) => route.fulfill({ json: { authenticated: true, csrf_token: "t", banner: null } }));
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();
    const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => route.fulfill({ status, json: body, headers });

    for (const [key, value] of Object.entries(options.extra ?? {})) {
      const [m, p] = key.includes(" ") ? key.split(" ", 2) as [string, string] : ["GET", key];
      if (m === method && p === path) return json(typeof value === "function" ? (value as (u: URL) => unknown)(url) : value);
    }

    if (method !== "GET") {
      opCount += 1;
      const op = { id: `op_01jbdocs${String(opCount).padStart(18, "0")}`, state: "queued", href: `${O}/operations/op_${opCount}` };
      if (path === `${O}/projects`) return json({ project: { id: "prj_new" }, operation: op }, 202);
      if (path === `${O}/ssh-keys`) return json({ id: "key_new" }, 201);
      if (path.endsWith("/launch-templates")) return json({ id: "ltp_new" }, 201);
      if (path.endsWith("/schedules")) return json({ ...W.SCHEDULES[0], id: "sch_new" }, 201);
      if (path.includes("/schedules/")) return json(W.SCHEDULES[0]);
      if (path.endsWith("/instance-groups")) return json({ ...W.GROUP, id: "igr_new", members: [] }, 201);
      if (path.includes("/instance-groups/")) return json(W.GROUP);
      if (path.endsWith("/api-keys")) return json({ ...W.API_KEY, secret: W.API_KEY_SECRET }, 201);
      if (path.endsWith("/service-accounts")) return json(W.SERVICE_ACCOUNT, 201);
      if (path.endsWith("/invitations")) {
        return json({ id: "inv_new", email: "zain@acme.example", role: "member", project_grants: [], expires_at: W.NOW,
          link: "https://console.nubestack.example/invite/org_acme/inv_new#secret", emailed: true }, 201);
      }
      return json({ operation: op }, 202);
    }

    if (path === "/v1/me") return json(W.ME);
    // An invitation, as the person holding its link reads it (the secret is a header).
    if (path === `/v1/invitations/${W.ORG}/${W.INVITATION_ID}`) {
      return json({ organization: { id: W.ORG, display_name: "Acme" }, role: "member", project_count: 1,
        expires_at: W.INVITATIONS.items[0]!.expires_at, email_matches: true, invited_by: "Ayesha Khan" });
    }
    if (path === `${P}/deletion-report`) {
      return json({ retention_s: 7 * 86400, data_as_of: W.NOW, placements: [
        { placement_id: W.PL_KHI, location: "pak-khi-1", empty: false, externally_visible: [],
          counts: { server: 3, volume: 2, volume_snapshot: 2, network: 2, floating_ip: 3, load_balancer: 1, security_group: 4 } },
        { placement_id: W.PL_ISB, location: "pak-isb-1", empty: false, externally_visible: [],
          counts: { server: 1, volume: 1, network: 1 } },
      ] });
    }
    if (path === O) return json(W.ORGANIZATION);
    if (path === `${O}/projects`) return json({ items: projects, next_cursor: null, data_as_of: W.NOW });
    const project = projects.find((p) => path === `${O}/projects/${p.id}`);
    if (project) return json(project);
    if (path === `${O}/catalog`) {
      const location = url.searchParams.get("location") ?? "";
      return json({ location, offerings: W.CATALOG[location] ?? [] });
    }
    if (path === `${P}/quota`) return json(W.QUOTA);
    if (path === `${O}/ssh-keys`) return json(W.SSH_KEYS);
    if (path === `${O}/quota-profiles`) return json(W.PROFILES);
    if (path === `${O}/locations`) {
      return json({ items: W.LOCATION_LIST.map((l) => ({ ...l, jurisdiction: "PK", status: "available" })), next_cursor: null });
    }
    if (path === `${O}/members`) return json(W.MEMBERS);
    if (path === `${O}/member-grants`) return json(W.MEMBER_GRANTS);
    if (path === `${O}/invitations`) return json(W.INVITATIONS);
    if (path === `${O}/entitlements`) return json(W.ENTITLEMENTS);
    if (path === `${O}/audit-events`) return json(W.AUDIT_EVENTS);
    if (path === `${O}/operations`) return json(W.OPERATIONS);
    const operation = W.OPERATIONS.items.find((o) => path === `${O}/operations/${o.id}`);
    if (operation) return json(operation.id === W.OPERATION.id ? W.OPERATION : { ...operation, steps: [] });
    if (path === `${O}/usage` || path === `${P}/usage`) return json(W.usage(url.searchParams.get("group_by")));
    if (path === `${O}/statements`) return json(W.STATEMENTS);
    if (path === `${O}/statements/${W.STATEMENT_OPEN.id}`) return json(W.STATEMENT_OPEN);
    if (path === `${O}/statements/${W.STATEMENT_CLOSED.id}`) return json(W.STATEMENT_CLOSED);
    if (path === `${O}/rate-card`) return json(W.RATE_CARD);
    if (path === `${O}/costs`) {
      const answer = W.costs(url.searchParams.get("period") ?? new Date().toISOString().slice(0, 7),
        (url.searchParams.get("group_by") ?? "project") as Parameters<typeof W.costs>[1]);
      return answer ? json(answer)
        : json({ type: "about:blank", title: "No costs for that month", status: 422, code: "period_out_of_range" }, 422);
    }
    if (path === `${O}/quota-requests`) return json(W.QUOTA_REQUESTS);
    if (path === `${O}/settings`) return json(W.ORG_SETTINGS, 200, { ETag: `"${W.ORG_SETTINGS.version}"` });
    if (path === `${O}/notification-preferences`) {
      return json({ email_enabled: true, items: [
        { kind: "maintenance_started", description: "When maintenance starts in a location you use.", enabled: true },
        { kind: "maintenance_extended", description: "When a maintenance window is extended.", enabled: true },
        { kind: "maintenance_ended", description: "When the location is available for new changes again.", enabled: true },
      ] });
    }
    if (path === `${O}/roles`) return json(W.ROLES);
    if (path === `${O}/role-actions`) return json(W.ROLE_ACTIONS);
    const role = [W.ROLE_DEPLOYER, W.ROLE_AUDITOR].find((r) => path === `${O}/roles/${r.id}`);
    if (role) return json(role, 200, { ETag: `"${role.version}"` });
    if (path === `${P}/roles`) return json({ items: W.ROLES.items.filter((r) => r.scope === "project") });
    if (path === `${P}/role-actions`) {
      return json({ items: W.ROLE_ACTIONS.items.filter((a) => a.scopes.includes("project")).map(({ held_on_every_project: every, ...a }) => ({ ...a, held: every ?? a.held })) });
    }
    if (path === `${P}/grants`) return json(W.PROJECT_GRANTS);
    if (path.endsWith("/grants")) return json({ items: [], next_cursor: null });

    // Service accounts.
    const SA = `${O}/service-accounts`;
    if (path === SA) {
      return json({ items: [{ ...W.SERVICE_ACCOUNT, active_keys: 1, grants: 1 }, { ...W.SERVICE_ACCOUNT_2, active_keys: 1, grants: 1 }], next_cursor: null });
    }
    const account = [W.SERVICE_ACCOUNT, W.SERVICE_ACCOUNT_2].find((a) => path.startsWith(`${SA}/${a.id}`));
    if (account) {
      if (path.endsWith("/api-keys")) return json({ items: [W.API_KEY], next_cursor: null });
      if (path.endsWith("/native-credentials")) return json({ items: account === W.SERVICE_ACCOUNT ? [W.NATIVE_CREDENTIAL] : [], next_cursor: null });
      return json({ ...account, grants: [{ project_id: W.PROJECT, role: "project_member", id: "grt_sa1" }], native_identities: [] });
    }

    // Schedules, groups, launches, templates, certificates.
    if (path === `${P}/schedules`) {
      const target = url.searchParams.get("target");
      const listed = W.SCHEDULES.map(({ runs: _r, ...s }) => s).filter((s) => !target || s.targets.some((t) => t.id === target));
      return json({ items: listed });
    }
    const schedule = W.SCHEDULES.find((s) => path === `${P}/schedules/${s.id}`);
    if (schedule) return json(schedule, 200, { ETag: `"${schedule.version}"` });
    if (path === `${P}/instance-groups`) {
      const memberOf = url.searchParams.get("member");
      const listed = [W.GROUP, W.PAUSED_GROUP].map(({ members: _m, ...g }) => g);
      return json({ items: memberOf ? (W.GROUP.members.some((m) => m.id === memberOf) ? [listed[0]] : []) : listed });
    }
    const group = [W.GROUP, W.PAUSED_GROUP].find((g) => path === `${P}/instance-groups/${g.id}`);
    if (group) return json(group, 200, { ETag: `"${group.version}"` });
    if (path === `${P}/instance-launches`) return json(helpers.launchesOf(url.searchParams, [W.LAUNCH]));
    if (path === `${P}/launch-templates`) return json(envelope([W.TEMPLATE]));
    if (path === `${P}/launch-templates/${W.TEMPLATE.id}`) return json(W.TEMPLATE, 200, { ETag: `"${W.TEMPLATE.version}"` });
    if (path === `${P}/certificates`) return json({ items: W.CERTIFICATES });
    const cert = W.CERTIFICATES.find((c) => path === `${P}/certificates/${c.id}`);
    if (cert) return json(cert);
    if (path === `${P}/network-topology`) {
      const placements = projects.find((p) => p.id === W.PROJECT)!.placements;
      return json(ours(helpers.topologyOf(W.LISTS as Record<string, unknown[]>, url.searchParams, placements)), 200, { "Cache-Control": "no-store" });
    }
    if (path === `${O}/network-topology`) return json({ items: [], next_cursor: null });

    // Native access.
    const connection = path.match(/\/placements\/(plc_[a-z0-9]+)\/connection$/);
    if (connection) {
      const loc = connection[1] === W.PL_ISB ? W.ISB : W.KHI;
      return json({ auth_url: `https://identity.${loc.slug}.example/v3`, identity_provider: "nubestack", protocol: "openid",
        client_id: "openstack-cli", project_id: `kp-${loc.slug}`, region: "RegionOne", location: loc.slug, native_access: true });
    }
    const consoleLink = path.match(/\/placements\/(plc_[a-z0-9]+)\/console$/);
    if (consoleLink) {
      const loc = consoleLink[1] === W.PL_ISB ? W.ISB : W.KHI;
      const server = url.searchParams.get("server");
      return json({ kind: "horizon", native_access: true, label: `Open ${loc.display_name} in Horizon`,
        url: `https://console.${loc.slug}.example/auth/switch/kp-${loc.slug}/?next=${server ? `/project/instances/${server}/` : "/project/"}` });
    }
    const forwarding = path.match(/\/servers\/([a-z]{3}_[0-9a-z]+)\/forwarding$/);
    if (forwarding) return json({ offered: true, items: [{ network_id: W.ID.netApp, network: "app", port_id: "port-web1", addresses: ["10.0.0.11"], forwarding: [], others: [] }] });

    const item = path.match(/\/(volume-snapshots|images|networks|servers|volumes|load-balancers|load-balancer-listeners|load-balancer-pools|load-balancer-health-monitors|security-groups|floating-ips|server-groups|subnets|routers|ports)\/([a-z]{3}_[0-9a-z]+)$/);
    if (item) {
      const found = (W.LISTS[item[1] ?? ""] ?? []).find((r) => r.id === item[2]);
      if (found) return json(found);
    }
    const related = path.match(/\/([a-z-]+)\/([a-z]{3}_[0-9a-z]+)\/related$/);
    if (related) return json(ours(helpers.relatedOf(related[1] ?? "", related[2] ?? "", W.LISTS as Record<string, unknown[]>)));
    // A resource's activity: the operations that acted on it, newest first.
    const activity = path.match(/\/([a-z]{3}_[0-9a-z]+)\/activity$/);
    if (activity) {
      const mine = W.OPERATIONS.items.filter((o) => o.resource.id === activity[1]).map((o) => ({ ...o, role: "target" }));
      return json({ items: mine, next_cursor: null });
    }
    if (path.endsWith("/activity")) return json({ items: [], next_cursor: null });
    const collection = path.split("/").pop() ?? "";
    if (path.startsWith(`${P}/`) && collection in W.LISTS) {
      const location = url.searchParams.get("location");
      return json(envelope((W.LISTS[collection] ?? []).filter((r) => !location || r.location === location)));
    }
    if (path.startsWith(`${O}/projects/${W.PROJECT_2}/`)) return json(envelope([]));
    return json({ status: 404, code: "not_found", title: "Not found" }, 404);
  });
}
