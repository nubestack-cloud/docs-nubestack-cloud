"""Copy the customer API contract and its error codes from a Nexus checkout into this site.

    python scripts/refresh_api.py /path/to/nexus      (or NEXUS_DIR=/path/to/nexus)

Reads, from the checkout:
    openapi/v1.json                the generated customer API contract
    broker/nexus/api/problems.py   the problem codes, their titles and which are retryable
Writes:
    openapi/v1.json                the contract the API reference is rendered from
    data/problems.json             the codes the Errors page lists

The copy changes presentation only, never the contract: the title, a placeholder server, the
product's name in descriptions, and the grouping of operations into tags by what they act on.
Paths, parameters, headers, bodies and responses are unchanged.
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Operations grouped by what they act on; the first match wins.
TAGS: list[tuple[str, str, str]] = [
    (r"/invitations/\{org_id\}/\{invitation_id\}", "Invitations", "Look up, accept or decline an invitation you were sent."),
    (r"^/v1/me$", "Organizations", "Who you are, your organization, its settings, locations and catalog, and closing it."),
    (r"/servers\b|/console-requests\b", "Instances", "Create, change, act on and delete instances; consoles and console logs."),
    (r"/instance-launches|/launch-templates", "Launch templates", "Saved instance settings, and launching several instances at once."),
    (r"/instance-groups", "Instance groups", "A number of instances from a template, kept running."),
    (r"/server-groups", "Server groups", "Keep instances on different hosts, or together."),
    (r"/images\b", "Images", "The project's own images."),
    (r"/volumes|/volume-snapshots", "Volumes and snapshots", "Block storage volumes and their snapshots."),
    (r"/schedules", "Schedules", "Backup, power and size schedules."),
    (r"/load-balancers", "Load balancers", "Load balancers, listeners, pools, members and health checks."),
    (r"/certificates", "Certificates", "TLS certificates for HTTPS listeners."),
    (r"/security-groups", "Security groups", "Firewall rules for instances and load balancers."),
    (r"/floating-ips", "Public IPs", "Addresses reachable from the Internet."),
    (r"/networks|/subnets|/routers|/internet-gateway|/network-topology|:bootstrap-network", "Networking",
     "Networks, address ranges, routing, Internet gateways and the network topology."),
    (r"/ssh-keys", "SSH keys", "Public keys copied into new instances."),
    (r"/service-accounts", "Service accounts and API keys", "Identities for automation, their API keys and cloud credentials."),
    (r"/roles|/role-actions", "Roles", "Built-in and custom roles, and the actions a role may hold."),
    (r"/members|/member-grants|/invitations|/ownership", "Members and invitations", "The organization's members, their roles, and invitations."),
    (r"/grants", "Project access", "Who holds which role on a project."),
    (r"/quota|/entitlements", "Quota", "Budgets, project quota, presets and requests for more."),
    (r"/usage|/statements|/rate-card|/costs", "Usage and costs", "Measured usage, statements, the rate card and the cost explorer. Provisional."),
    (r"/audit-events", "Audit log", "Every change, refusal and security event in the organization."),
    (r"/operations", "Operations", "Follow and cancel the work a change started."),
    (r"/clouds\.yaml|/connection$|/console$", "Native access", "Connection details, clouds.yaml and console links for each location."),
    (r"/deletion-report|:cancel-deletion|:delete-now|:confirm-deletion|:resume|/placements", "Projects",
     "Projects, their locations, and deleting or resuming them."),
    (r"/projects/\{project_id\}/\{collection\}|/inventory", "Resources", "Lists, reads, attachments and activity of any resource type."),
    (r"/projects", "Projects", "Projects, their locations, and deleting or resuming them."),
    (r"closure|:close|data-export|/settings|/notification-preferences|/locations|/catalog|^/v1/orgs/\{org_id\}$",
     "Organizations", "Who you are, your organization, its settings, locations and catalog, and closing it."),
]

# Codes only the provider's own consoles and tools answer; a customer never sees them.
OPERATOR_ONLY = set("""
acr_required reason_required not_an_operator operator_removed workload_retry_is_a_new_operation slug_taken
org_has_owner org_pending org_not_pending limit_below_usage budget_below_allocation cap_below_allocation
self_approval rate_draft_exists rate_not_draft rate_effective_from rate_currency_month_start rate_line_invalid
change_pending change_expired change_decided change_void last_operator root_required last_root self_change
operator_active staff_account_exists operation_not_terminal resync_not_workload_repair nothing_to_resync
generation_superseded projection_pending not_this_deletion blocked_reason_changed not_closed records_purged
profile_incomplete value_above_maximum minimum_above_value profile_exists profile_retired profile_is_default
tier_exists retire_first last_tier same_approver request_closed commitment_needs_platform_operator
quota_increase_forbidden partition_quarantined access_window_required proposal_lapsed staff_mfa_pinned
already_reviewed gate_failed release_unverified withdrawals_unconfirmed second_operator_required
not_in_maintenance cloud_quarantined not_serving invalid_transition placements_remain repair_window_too_wide
repair_in_progress run_in_progress deployment_quarantined deployment_lost cloud_not_prepared cloud_registered
cloud_not_registered cloud_closed enrolment_code_unknown enrolment_code_used enrolment_code_cancelled
enrolment_code_expired session_unknown session_key_mismatch request_stale session_ended session_expired
too_many_reports result_already_posted result_invalid result_not_approvable location_not_admissible
integrity_failed token_key_unknown
""".split())


def rename(text: str) -> str:
    """The platform's name in prose becomes the service's; header and field names stay."""
    text = re.sub(r"\bNexus's\b", "NubeStack Cloud's", text)
    return re.sub(r"\bNexus\b(?![-_])", "NubeStack Cloud", text)


def walk(node, key=None):
    if isinstance(node, list):
        return [walk(v) for v in node]
    if isinstance(node, dict):
        return {k: walk(v, k) for k, v in node.items()}
    if isinstance(node, str) and key in {"description", "summary", "title"}:
        return rename(node)
    return node


def main() -> int:
    nexus = Path(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("NEXUS_DIR", ROOT.parent / "nexus")).resolve()
    source = nexus / "openapi" / "v1.json"
    if not source.exists():
        print(f"No contract at {source}. Pass the path to a Nexus checkout.", file=sys.stderr)
        return 2
    spec = json.loads(source.read_text())
    spec["info"] = {
        **spec.get("info", {}),
        "title": "NubeStack Cloud API",
        "description": (
            "The NubeStack Cloud customer API, version 1. Authenticate with a service account's API key "
            "as a bearer token. Changes that run in a location answer `202 Accepted` with an operation to follow."
        ),
    }
    spec["servers"] = [{"url": "https://api.nubestack.cloud", "description": "Placeholder: use the API address NubeStack gives you"}]
    # The bearer scheme, named for the header it uses so the reference reads "Authorization".
    spec["components"]["securitySchemes"] = {"Authorization": {
        "type": "http", "scheme": "bearer", "bearerFormat": "API key",
        "description": "Bearer followed by a service account's API key. The console uses your signed-in session instead.",
    }}
    seen: dict[str, str] = {}
    for path, item in spec["paths"].items():
        for method, op in item.items():
            if not isinstance(op, dict) or "responses" not in op:
                continue
            hit = next(((name, desc) for pattern, name, desc in TAGS if re.search(pattern, path)), None)
            name, desc = hit or ((op.get("tags") or ["Other"])[0].capitalize(), "")
            op["tags"] = [name]
            if op.get("security"):
                op["security"] = [{"Authorization": []}]
            seen.setdefault(name, desc)
    order = list(dict.fromkeys(name for _, name, _ in TAGS))
    spec["tags"] = [{"name": n, "description": seen[n]} for n in sorted(seen, key=lambda n: order.index(n) if n in order else 99)]
    spec = walk(spec)
    (ROOT / "openapi").mkdir(exist_ok=True)
    (ROOT / "openapi" / "v1.json").write_text(json.dumps(spec, indent=2, ensure_ascii=False) + "\n")

    problems = (nexus / "broker" / "nexus" / "api" / "problems.py").read_text()
    titles_block = problems[problems.index("TITLES = {"): problems.index("\n}\n", problems.index("TITLES = {"))]
    retry_block = problems[problems.index("RETRYABLE = frozenset({"): problems.index("})", problems.index("RETRYABLE = frozenset({"))]
    titles = re.findall(r'^\s*"([a-z0-9_]+)":\s*"([^"]+)"', titles_block, re.M)
    retryable = set(re.findall(r'"([a-z0-9_]+)"', retry_block))
    customer = sorted(
        ({"code": c, "title": rename(t), "retryable": c in retryable} for c, t in titles if c not in OPERATOR_ONLY),
        key=lambda p: p["code"],
    )
    (ROOT / "data").mkdir(exist_ok=True)
    (ROOT / "data" / "problems.json").write_text(json.dumps(customer, indent=2) + "\n")
    print(f"API: {len(spec['paths'])} paths in {len(spec['tags'])} groups -> openapi/v1.json")
    print(f"Errors: {len(customer)} customer codes of {len(titles)} -> data/problems.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
