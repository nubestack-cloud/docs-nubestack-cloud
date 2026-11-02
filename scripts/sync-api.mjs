// Copies the customer API contract and its error codes from a Nexus checkout into this site.
//
//   NEXUS_DIR=/path/to/nexus node scripts/sync-api.mjs      (or: npm run sync:api)
//
// Reads, from the checkout:
//   openapi/v1.json                  the generated customer API contract (spec 008)
//   broker/nexus/api/problems.py     the problem codes, their titles and which are retryable
// Writes:
//   openapi/nubestack-cloud-v1.json  the contract the API reference pages are built from
//   data/problems.json           the codes the Errors page lists
//
// The copy changes presentation only, never the contract: the title and server address, the
// product's name in descriptions, and the grouping of operations into tags by path. Paths,
// parameters, headers (such as `Nexus-Invitation-Secret`), bodies and responses are unchanged.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nexus = resolve(process.env.NEXUS_DIR ?? process.argv[2] ?? join(root, "..", "nexus"));
const spec = JSON.parse(readFileSync(join(nexus, "openapi/v1.json"), "utf8"));

// ---- The contract -------------------------------------------------------------------------
spec.info = {
  ...spec.info,
  title: "NubeStack Cloud API",
  description:
    "The NubeStack Cloud customer API, version 1. Every path starts with `/v1`. Authenticate with a " +
    "service account's API key as a bearer token. Changes that run in a location answer `202 Accepted` " +
    "with an operation to follow. See the API guide at /api/overview/ for how to call it.",
};
spec.servers = [{ url: "https://api.nubestack.cloud", description: "Placeholder: use the API address NubeStack gives you" }];

// Operations grouped by what they act on, first match wins; the API's own tag otherwise.
const TAGS = [
  [/\/invitations\/\{org_id\}\/\{invitation_id\}/, "Invitations"],
  [/^\/v1\/me$/, "Organizations"],
  [/\/servers\b|\/console-requests\b/, "Instances"],
  [/\/instance-launches|\/launch-templates/, "Launch templates"],
  [/\/instance-groups/, "Instance groups"],
  [/\/server-groups/, "Server groups"],
  [/\/images\b/, "Images"],
  [/\/volumes|\/volume-snapshots/, "Volumes and snapshots"],
  [/\/schedules/, "Schedules"],
  [/\/load-balancers/, "Load balancers"],
  [/\/certificates/, "Certificates"],
  [/\/security-groups/, "Security groups"],
  [/\/floating-ips/, "Public IPs"],
  [/\/networks|\/subnets|\/routers|\/internet-gateway|\/network-topology|:bootstrap-network/, "Networking"],
  [/\/ssh-keys/, "SSH keys"],
  [/\/service-accounts/, "Service accounts and API keys"],
  [/\/roles|\/role-actions/, "Roles"],
  [/\/members|\/member-grants|\/invitations|\/ownership/, "Members and invitations"],
  [/\/grants/, "Project access"],
  [/\/quota|\/entitlements/, "Quota"],
  [/\/usage|\/statements|\/rate-card|\/costs/, "Usage and costs"],
  [/\/audit-events/, "Audit log"],
  [/\/operations/, "Operations"],
  [/\/clouds\.yaml|\/connection$|\/console$/, "Native access"],
  [/\/deletion-report|:cancel-deletion|:delete-now|:confirm-deletion|:resume/, "Projects"],
  [/\/placements/, "Projects"],
  [/\/projects\/\{project_id\}\/\{collection\}|\/inventory/, "Resources (all types)"],
  [/\/projects/, "Projects"],
  [/closure|:close|data-export/, "Organizations"],
  [/\/settings|\/notification-preferences|\/locations|\/catalog|^\/v1\/orgs\/\{org_id\}$/, "Organizations"],
];
const DESCRIPTIONS = {
  "Organizations": "Who you are, your organization, its settings, locations and catalog, and closing it.",
  "Invitations": "Look up, accept or decline an invitation you were sent.",
  "Members and invitations": "The organization's members, their roles, and invitations.",
  "Roles": "Built-in and custom roles, and the actions a role may hold.",
  "Project access": "Who holds which role on a project.",
  "Projects": "Projects, their locations, and deleting or resuming them.",
  "Quota": "Your organization's budgets, project quota, presets and requests for more.",
  "Instances": "Virtual machines: create, change, act on, delete; consoles and console logs.",
  "Launch templates": "Saved instance settings, and launching several instances at once.",
  "Instance groups": "A number of instances from a template kept running.",
  "Server groups": "Keep instances on different hosts, or together.",
  "Images": "The project's own images.",
  "Volumes and snapshots": "Block storage and point-in-time copies.",
  "Schedules": "Backup, power and size schedules.",
  "Networking": "Networks, address ranges, routing, Internet gateways and the network map.",
  "Security groups": "Firewall rules for instances.",
  "Public IPs": "Addresses reachable from the Internet.",
  "Load balancers": "Load balancers, listeners, pools, members and health checks.",
  "Certificates": "TLS certificates for HTTPS listeners.",
  "SSH keys": "Public keys copied into new instances.",
  "Service accounts and API keys": "Identities for automation, their API keys and cloud credentials.",
  "Usage and costs": "Measured usage, statements, the rate card and the cost explorer. Provisional.",
  "Audit log": "Every change, refusal and security event in the organization.",
  "Operations": "Follow and cancel the work a change started.",
  "Native access": "Connection details, clouds.yaml and console links for each location.",
  "Resources (all types)": "Lists, reads, attachments and activity of any resource type.",
};

const seen = new Set();
for (const [path, item] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(item)) {
    if (!op || typeof op !== "object" || !("responses" in op)) continue;
    const hit = TAGS.find(([re]) => re.test(path));
    const tag = hit ? hit[1] : (op.tags?.[0] ?? "Other").replace(/^./, (c) => c.toUpperCase());
    op.tags = [tag];
    seen.add(tag);
    void method;
  }
}
const order = [...new Set(TAGS.map(([, t]) => t))];
spec.tags = [...seen]
  .sort((a, b) => (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b)))
  .map((name) => ({ name, description: DESCRIPTIONS[name] ?? "" }));

// The product's name in prose: "Nexus" is the platform NubeStack Cloud runs on. A header or
// field name containing it (`Nexus-Invitation-Secret`) is part of the contract and stays.
const rename = (text) => text.replace(/\bNexus's\b/g, "NubeStack Cloud's").replace(/\bNexus\b(?![-_])/g, "NubeStack Cloud");
const walk = (node, key) => {
  if (Array.isArray(node)) return node.map((v) => walk(v));
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) node[k] = walk(v, k);
    return node;
  }
  if (typeof node === "string" && (key === "description" || key === "summary")) return rename(node);
  return node;
};
walk(spec);

mkdirSync(join(root, "openapi"), { recursive: true });
writeFileSync(join(root, "openapi/nubestack-cloud-v1.json"), JSON.stringify(spec, null, 2) + "\n");

// ---- The problem codes --------------------------------------------------------------------
const problems = readFileSync(join(nexus, "broker/nexus/api/problems.py"), "utf8");
const titlesBlock = problems.slice(problems.indexOf("TITLES = {"), problems.indexOf("\n}\n", problems.indexOf("TITLES = {")));
const retryBlock = problems.slice(problems.indexOf("RETRYABLE = frozenset({"), problems.indexOf("})", problems.indexOf("RETRYABLE = frozenset({")));
const titles = [...titlesBlock.matchAll(/^\s*"([a-z0-9_]+)":\s*"([^"]+)"/gm)].map(([, code, title]) => ({ code, title }));
const retryable = new Set([...retryBlock.matchAll(/"([a-z0-9_]+)"/g)].map(([, c]) => c));

// Codes only the operator console, the platform's own tools or cloud onboarding can answer: a
// customer never sees them, so the Errors page leaves them out.
const OPERATOR_ONLY = new Set([
  "acr_required", "reason_required", "not_an_operator", "operator_removed", "workload_retry_is_a_new_operation",
  "slug_taken", "org_has_owner", "org_pending", "org_not_pending", "limit_below_usage", "budget_below_allocation",
  "cap_below_allocation", "self_approval", "rate_draft_exists", "rate_not_draft", "rate_effective_from",
  "rate_currency_month_start", "rate_line_invalid", "change_pending", "change_expired", "change_decided", "change_void",
  "last_operator", "root_required", "last_root", "self_change", "operator_active", "staff_account_exists",
  "operation_not_terminal", "resync_not_workload_repair", "nothing_to_resync", "generation_superseded",
  "projection_pending", "not_this_deletion", "blocked_reason_changed", "not_closed", "records_purged",
  "profile_incomplete", "value_above_maximum", "minimum_above_value", "profile_exists", "profile_retired",
  "profile_is_default", "tier_exists", "retire_first", "last_tier", "same_approver", "request_closed",
  "commitment_needs_platform_operator", "quota_increase_forbidden", "partition_quarantined",
  "access_window_required", "proposal_lapsed", "staff_mfa_pinned", "already_reviewed", "gate_failed",
  "release_unverified", "withdrawals_unconfirmed", "second_operator_required", "not_in_maintenance",
  "cloud_quarantined", "not_serving", "invalid_transition", "placements_remain", "repair_window_too_wide",
  "repair_in_progress", "run_in_progress", "deployment_quarantined", "deployment_lost", "cloud_not_prepared",
  "cloud_registered", "cloud_not_registered", "cloud_closed", "enrolment_code_unknown", "enrolment_code_used",
  "enrolment_code_cancelled", "enrolment_code_expired", "session_unknown", "session_key_mismatch", "request_stale",
  "session_ended", "session_expired", "too_many_reports", "result_already_posted", "result_invalid",
  "result_not_approvable", "location_not_admissible", "integrity_failed", "token_key_unknown",
]);
const customer = titles
  .filter(({ code }) => !OPERATOR_ONLY.has(code))
  .map(({ code, title }) => ({ code, title: rename(title), retryable: retryable.has(code) }))
  .sort((a, b) => a.code.localeCompare(b.code));
mkdirSync(join(root, "data"), { recursive: true });
writeFileSync(join(root, "data/problems.json"), JSON.stringify(customer, null, 2) + "\n");

console.log(`API: ${Object.keys(spec.paths).length} paths in ${spec.tags.length} groups -> openapi/nubestack-cloud-v1.json`);
console.log(`Errors: ${customer.length} customer codes of ${titles.length} -> data/problems.json`);
