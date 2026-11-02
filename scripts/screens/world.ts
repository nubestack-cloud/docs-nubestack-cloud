// The sample world the documentation's screenshots show: the organization Acme, its projects
// web-shop and analytics in NubeStack's two locations, Karachi (pak-khi-1) and Islamabad
// (pak-isb-1), and its people. Sample data only: names are invented, e-mail addresses use
// acme.example, and every public address is from a documentation range (203.0.113.0/24,
// 198.51.100.0/24, 192.0.2.0/24). Shapes are the customer API's, as the Nexus portal's own mock
// (portal/e2e/mock-api.ts) answers them.

// A fixed moment, so relative times and the month's costs read the same on every run.
export const FIXED_NOW = Date.parse("2026-10-21T07:30:00Z");
const now = FIXED_NOW;
export const NOW = new Date(now).toISOString();
const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();
const ahead = (minutes: number) => new Date(now + minutes * 60_000).toISOString();
const DAY = 24 * 60;

export const ORG = "org_01jbacme00000000000000001";
export const PROJECT = "prj_01jbwebshop000000000000001";
export const PROJECT_2 = "prj_01jbanalytics00000000000001";

export const KHI = { id: "loc_01jbkhi00000000000000000001", slug: "pak-khi-1", display_name: "Karachi" };
export const ISB = { id: "loc_01jbisb00000000000000000001", slug: "pak-isb-1", display_name: "Islamabad" };
export const LOCATION_LIST = [KHI, ISB];

const placement = (id: string, location: typeof KHI, minutes: number) => ({
  id, location, status: "ready", reason: null, conditions: [], provider: { keystone_project_id: `kp-${location.slug}` },
  lifecycle: { desired: "active", observed: "active" }, data_as_of: ago(minutes),
});
export const PL_KHI = "plc_01jbkhi00000000000000000001";
export const PL_ISB = "plc_01jbisb00000000000000000001";

export const PROJECTS = [
  { id: PROJECT, slug: "web-shop", display_name: "web-shop", lifecycle_state: "active", created_at: ago(40 * DAY),
    your_role: "project_admin", placements: [placement(PL_KHI, KHI, 2), placement(PL_ISB, ISB, 3)] },
  { id: PROJECT_2, slug: "analytics", display_name: "analytics", lifecycle_state: "active", created_at: ago(12 * DAY),
    your_role: "project_admin", placements: [placement("plc_01jbana00000000000000000001", ISB, 4)] },
];

// ---- Resources ----------------------------------------------------------------------------
export const TAGGED = new Set(["server", "volume", "network", "floating_ip"]);
const tagsVersion = (tags: Record<string, string>) =>
  Object.entries(tags).map(([k, v]) => `${k}${v}`).join("").padEnd(32, "0").slice(0, 32).replace(/[^0-9a-f]/g, "a");

type Attrs = Record<string, unknown>;
export interface Row {
  id: string; type: string; location: string; display_name: string; status: string | null; phase: string;
  provider: { deployment: string; region: string; id: string }; attributes: Attrs; origin: string; created_at: string;
  [extra: string]: unknown;
}

export function resource(type: string, id: string, cloudId: string, location: string, name: string, attributes: Attrs,
  extra: Record<string, unknown> = {}): Row {
  const tags = (extra["tags"] as Record<string, string> | undefined) ?? {};
  return {
    id, type, location, display_name: name, status: "active", phase: "active", last_operation: null, error: null,
    provider: { deployment: "dep", region: "RegionOne", id: cloudId },
    attributes, origin: "nexus", created_at: ago(9 * DAY),
    ...(TAGGED.has(type) ? { tags, tags_version: tagsVersion(tags), tags_drift: null } : {}),
    observation: { source: "poll", observed_at: ago(2), data_as_of: ago(2), stale: false, source_status: "ok", lifecycle: "active" },
    ...extra,
  };
}

const flavor = (name: string, vcpus: number, ram: number, disk: number) => ({ original_name: name, vcpus, ram, disk });
const SMALL = flavor("Small", 1, 2048, 20);
const MEDIUM = flavor("Medium", 2, 4096, 40);
const LARGE = flavor("Large", 4, 8192, 80);

// Cloud IDs the rows refer to each other by, as each location reports them.
const C = {
  web1: "7c1d2e3f-0a1b-4c2d-8e3f-4a5b6c7d8e01", web2: "7c1d2e3f-0a1b-4c2d-8e3f-4a5b6c7d8e02",
  db1: "7c1d2e3f-0a1b-4c2d-8e3f-4a5b6c7d8e03", batch1: "7c1d2e3f-0a1b-4c2d-8e3f-4a5b6c7d8e04",
  netApp: "net-app-khi", netDb: "net-db-khi", netIsb: "net-app-isb",
  subApp: "sub-app-khi", subDb: "sub-db-khi", subIsb: "sub-app-isb",
  rtrKhi: "rtr-khi", rtrIsb: "rtr-isb",
  sgDefault: "sg-default-khi", sgWeb: "sg-web-khi", sgSsh: "sg-ssh-khi", sgDb: "sg-db-khi", sgDefaultIsb: "sg-default-isb",
  lb: "lb-web-khi", lbVipPort: "port-lb-vip", lstHttp: "lst-http", lstHttps: "lst-https", pool: "pool-web", hm: "hm-web",
  volDb: "vol-db-data", volScratch: "vol-scratch", volBatch: "vol-batch",
};

export const ID = {
  web1: "srv_01jbweb100000000000000001", web2: "srv_01jbweb200000000000000001", db1: "srv_01jbdb1000000000000000001",
  batch1: "srv_01jbbatch10000000000000001",
  netApp: "net_01jbapp00000000000000000001", netDb: "net_01jbdb000000000000000000001", netIsb: "net_01jbappisb000000000000000001",
  volDb: "vol_01jbdbdata0000000000000001", volScratch: "vol_01jbscratch000000000000001", volBatch: "vol_01jbbatch0000000000000001",
  snap: "vsn_01jbdbsnap0000000000000001", image: "img_01jbgolden000000000000001",
  sgDefault: "sgr_01jbdefault000000000000001", sgWeb: "sgr_01jbweb00000000000000001", sgSsh: "sgr_01jbssh00000000000000001",
  sgDb: "sgr_01jbdb000000000000000001",
  fipWeb: "fip_01jbweb100000000000000001", fipLb: "fip_01jblb0000000000000000001", fipFree: "fip_01jbspare0000000000000001",
  lb: "lbs_01jbweblb0000000000000001", lstHttp: "lbl_01jbhttp000000000000000001", lstHttps: "lbl_01jbhttps00000000000000001",
  pool: "lbp_01jbwebpool000000000000001", hm: "lbh_01jbwebcheck00000000000001",
  rtrKhi: "rtr_01jbkhi00000000000000000001", rtrIsb: "rtr_01jbisb00000000000000000001",
  sgpSpread: "sgp_01jbspread00000000000000001",
  template: "ltp_01jbweb00000000000000000001", group: "igr_01jbweb00000000000000000001", group2: "igr_01jbbatch000000000000000001",
  certWww: "crt_01jbwww00000000000000000001", certApi: "crt_01jbapi00000000000000000001",
  schedBackup: "sch_01jbnightly000000000000001", schedPower: "sch_01jbofficehours0000000001",
};

const addr = (ip: string, network: string, type: "fixed" | "floating") => ({ addr: ip, network, type, version: 4 });

export const LISTS: Record<string, Row[]> = {
  servers: [
    resource("server", ID.web1, C.web1, "pak-khi-1", "web-1", {
      flavor: MEDIUM, image_id: "img-ubuntu-2404", key_name: "ayesha-laptop", locked: false, availability_zone: "nova",
      security_groups: ["default", "web"], volumes_attached: [],
      addresses: [addr("192.0.2.11", "app", "fixed"), addr("203.0.113.21", "app", "floating")],
    }, { status: "ACTIVE", tags: { env: "prod", team: "web" } }),
    resource("server", ID.web2, C.web2, "pak-khi-1", "web-2", {
      flavor: MEDIUM, image_id: "img-ubuntu-2404", key_name: "ayesha-laptop", locked: false, availability_zone: "nova",
      security_groups: ["default", "web"], volumes_attached: [], addresses: [addr("192.0.2.12", "app", "fixed")],
    }, { status: "ACTIVE", tags: { env: "prod", team: "web" } }),
    resource("server", ID.db1, C.db1, "pak-khi-1", "db-1", {
      flavor: LARGE, image_id: "img-ubuntu-2404", key_name: "ayesha-laptop", locked: false, availability_zone: "nova",
      security_groups: ["db"], volumes_attached: [{ id: C.volDb }], addresses: [addr("198.51.100.10", "db", "fixed")],
    }, { status: "ACTIVE", tags: { env: "prod", team: "data" } }),
    resource("server", ID.batch1, C.batch1, "pak-isb-1", "batch-1", {
      flavor: SMALL, image_id: "img-ubuntu-2404", key_name: "ayesha-laptop", locked: false, availability_zone: "nova",
      security_groups: ["default"], volumes_attached: [], addresses: [addr("192.0.2.20", "app", "fixed")],
    }, { status: "SHUTOFF", tags: { env: "dev" } }),
  ],
  networks: [
    resource("network", ID.netApp, C.netApp, "pak-khi-1", "app", { subnets: [C.subApp], routed: true }, { tags: { env: "prod" },
      routing: { enabled: true, router_id: ID.rtrKhi, pending: false },
      internet_access: { enabled: true, router_id: ID.rtrKhi, pending: false, observed_gateway: true, project_gateway: true } }),
    resource("network", ID.netDb, C.netDb, "pak-khi-1", "db", { subnets: [C.subDb], routed: true }, { tags: { env: "prod" },
      routing: { enabled: true, router_id: ID.rtrKhi, pending: false },
      internet_access: { enabled: true, router_id: ID.rtrKhi, pending: false, observed_gateway: true, project_gateway: true } }),
    resource("network", ID.netIsb, C.netIsb, "pak-isb-1", "app", { subnets: [C.subIsb], routed: true }, {
      routing: { enabled: true, router_id: ID.rtrIsb, pending: false },
      internet_access: { enabled: false, router_id: ID.rtrIsb, pending: false, observed_gateway: false, project_gateway: false } }),
  ],
  subnets: [
    resource("subnet", "sbn_01jbapp00000000000000000001", C.subApp, "pak-khi-1", "app-v4",
      { cidr: "192.0.2.0/24", network_id: C.netApp, gateway_ip: "192.0.2.1", enable_dhcp: true,
        allocation_pools: [{ start: "192.0.2.10", end: "192.0.2.199" }], dns_nameservers: [], ip_version: 4 }),
    resource("subnet", "sbn_01jbdb000000000000000000001", C.subDb, "pak-khi-1", "db-v4",
      { cidr: "198.51.100.0/24", network_id: C.netDb, gateway_ip: "198.51.100.1", enable_dhcp: true,
        allocation_pools: [{ start: "198.51.100.10", end: "198.51.100.199" }], dns_nameservers: [], ip_version: 4 }),
    resource("subnet", "sbn_01jbappisb000000000000000001", C.subIsb, "pak-isb-1", "app-v4",
      { cidr: "192.0.2.0/24", network_id: C.netIsb, gateway_ip: "192.0.2.1", enable_dhcp: true,
        allocation_pools: [{ start: "192.0.2.10", end: "192.0.2.199" }], dns_nameservers: [], ip_version: 4 }),
  ],
  routers: [
    resource("router", ID.rtrKhi, C.rtrKhi, "pak-khi-1", "web-shop-private", {
      external_gateway: { network_id: "public-khi", enable_snat: true, external_fixed_ips: [{ ip_address: "198.51.100.2" }] },
      routes: [] }, { project_gateway: true, private_router: true,
      internet_gateway: { snat_enabled: true, addresses: ["198.51.100.2"], enabled: true, pending: false, desired: true, state: "active" } }),
    resource("router", ID.rtrIsb, C.rtrIsb, "pak-isb-1", "web-shop-private", { external_gateway: null, routes: [] },
      { project_gateway: true, private_router: true,
        internet_gateway: { snat_enabled: null, addresses: [], enabled: false, pending: false, desired: false, state: "absent" } }),
  ],
  ports: [
    resource("port", "prt_01jbweb10000000000000000001", "port-web1", "pak-khi-1", "", { device_id: C.web1, device_owner: "compute:nova",
      network_id: C.netApp, security_group_ids: [C.sgDefault, C.sgWeb], fixed_ips: [{ ip_address: "192.0.2.11", subnet_id: C.subApp }] }),
    resource("port", "prt_01jbweb20000000000000000001", "port-web2", "pak-khi-1", "", { device_id: C.web2, device_owner: "compute:nova",
      network_id: C.netApp, security_group_ids: [C.sgDefault, C.sgWeb], fixed_ips: [{ ip_address: "192.0.2.12", subnet_id: C.subApp }] }),
    resource("port", "prt_01jbdb100000000000000000001", "port-db1", "pak-khi-1", "", { device_id: C.db1, device_owner: "compute:nova",
      network_id: C.netDb, security_group_ids: [C.sgDb], fixed_ips: [{ ip_address: "198.51.100.10", subnet_id: C.subDb }] }),
    resource("port", "prt_01jbbatch1000000000000000001", "port-batch1", "pak-isb-1", "", { device_id: C.batch1, device_owner: "compute:nova",
      network_id: C.netIsb, security_group_ids: [C.sgDefaultIsb], fixed_ips: [{ ip_address: "192.0.2.20", subnet_id: C.subIsb }] }),
    resource("port", "prt_01jbrtrapp00000000000000001", "port-rtr-app", "pak-khi-1", "", { device_id: C.rtrKhi,
      device_owner: "network:router_interface", network_id: C.netApp, fixed_ips: [{ ip_address: "192.0.2.1", subnet_id: C.subApp }] }),
    resource("port", "prt_01jbrtrdb000000000000000001", "port-rtr-db", "pak-khi-1", "", { device_id: C.rtrKhi,
      device_owner: "network:router_interface", network_id: C.netDb, fixed_ips: [{ ip_address: "198.51.100.1", subnet_id: C.subDb }] }),
    resource("port", "prt_01jbrtrisb00000000000000001", "port-rtr-isb", "pak-isb-1", "", { device_id: C.rtrIsb,
      device_owner: "network:router_interface", network_id: C.netIsb, fixed_ips: [{ ip_address: "192.0.2.1", subnet_id: C.subIsb }] }),
    resource("port", "prt_01jblbvip00000000000000001", C.lbVipPort, "pak-khi-1", "", { device_id: C.lb,
      device_owner: "Octavia", network_id: C.netApp, security_group_ids: [], fixed_ips: [{ ip_address: "192.0.2.50", subnet_id: C.subApp }] }),
  ],
  "security-groups": [
    resource("security_group", ID.sgDefault, C.sgDefault, "pak-khi-1", "default", { rules: [
      { id: "r1", direction: "egress", ethertype: "IPv4", protocol: null, port_range_min: null, port_range_max: null, remote_ip_prefix: null, remote_group_id: null },
      { id: "r2", direction: "ingress", ethertype: "IPv4", protocol: null, port_range_min: null, port_range_max: null, remote_ip_prefix: null, remote_group_id: C.sgDefault },
    ], cloud_default: true }),
    resource("security_group", ID.sgWeb, C.sgWeb, "pak-khi-1", "web", { rules: [
      { id: "r3", direction: "ingress", ethertype: "IPv4", protocol: "tcp", port_range_min: 80, port_range_max: 80, remote_ip_prefix: "0.0.0.0/0", remote_group_id: null },
      { id: "r4", direction: "ingress", ethertype: "IPv4", protocol: "tcp", port_range_min: 443, port_range_max: 443, remote_ip_prefix: "0.0.0.0/0", remote_group_id: null },
      { id: "r5", direction: "ingress", ethertype: "IPv4", protocol: "tcp", port_range_min: 22, port_range_max: 22, remote_ip_prefix: "203.0.113.0/24", remote_group_id: null },
      { id: "r6", direction: "egress", ethertype: "IPv4", protocol: null, port_range_min: null, port_range_max: null, remote_ip_prefix: null, remote_group_id: null },
    ] }),
    resource("security_group", ID.sgSsh, C.sgSsh, "pak-khi-1", "ssh-office", { rules: [
      { id: "r7", direction: "ingress", ethertype: "IPv4", protocol: "tcp", port_range_min: 22, port_range_max: 22, remote_ip_prefix: "203.0.113.0/24", remote_group_id: null },
      { id: "r8", direction: "egress", ethertype: "IPv4", protocol: null, port_range_min: null, port_range_max: null, remote_ip_prefix: null, remote_group_id: null },
    ] }),
    resource("security_group", ID.sgDb, C.sgDb, "pak-khi-1", "db", { rules: [
      { id: "r9", direction: "ingress", ethertype: "IPv4", protocol: "tcp", port_range_min: 5432, port_range_max: 5432, remote_ip_prefix: null, remote_group_id: C.sgWeb },
      { id: "r10", direction: "egress", ethertype: "IPv4", protocol: null, port_range_min: null, port_range_max: null, remote_ip_prefix: null, remote_group_id: null },
    ] }),
  ],
  "floating-ips": [
    resource("floating_ip", ID.fipWeb, "fip-web1", "pak-khi-1", "203.0.113.21", { floating_ip_address: "203.0.113.21",
      port_id: "port-web1", fixed_ip_address: "192.0.2.11" }, { tags: { env: "prod" } }),
    resource("floating_ip", ID.fipLb, "fip-lb", "pak-khi-1", "203.0.113.40", { floating_ip_address: "203.0.113.40",
      port_id: C.lbVipPort, fixed_ip_address: "192.0.2.50" }, { tags: { env: "prod" } }),
    resource("floating_ip", ID.fipFree, "fip-spare", "pak-khi-1", "198.51.100.7", { floating_ip_address: "198.51.100.7" }),
  ],
  "server-groups": [
    { ...resource("server_group", ID.sgpSpread, "sgp-spread", "pak-khi-1", "web-spread", { policy: "anti-affinity",
      max_server_per_host: null, members: [C.web1, C.web2], truncated: false }), status: null },
  ],
  volumes: [
    resource("volume", ID.volDb, C.volDb, "pak-khi-1", "db-data", { size: 100, volume_type: "standard", bootable: false,
      multiattach: false, attachments: [{ server_id: C.db1, device: "/dev/vdb" }] }, { status: "in-use", tags: { env: "prod", team: "data" } }),
    resource("volume", ID.volScratch, C.volScratch, "pak-khi-1", "scratch", { size: 20, volume_type: "fast", bootable: false,
      multiattach: false, attachments: [] }, { status: "available", tags: { env: "dev" } }),
    resource("volume", ID.volBatch, C.volBatch, "pak-isb-1", "batch-data", { size: 50, volume_type: "standard", bootable: false,
      multiattach: false, attachments: [] }, { status: "available" }),
  ],
  "volume-snapshots": [
    resource("volume_snapshot", ID.snap, "snap-db", "pak-khi-1", "db-data-before-upgrade", { size: 100, volume_id: C.volDb, status: "available" }),
    resource("volume_snapshot", "vsn_01jbnightly00000000000000001", "snap-nightly", "pak-khi-1", "nightly-20261101-0200",
      { size: 100, volume_id: C.volDb, status: "available" }),
  ],
  images: [
    resource("image", ID.image, "img-golden", "pak-khi-1", "web-golden", { status: "active", visibility: "private", size: 3 * 1024 ** 3,
      min_disk: 40, disk_format: "qcow2" }),
  ],
  "load-balancers": [
    { ...resource("load_balancer", ID.lb, C.lb, "pak-khi-1", "web-lb", {
      vip_address: "192.0.2.50", vip_port_id: C.lbVipPort, vip_subnet_id: C.subApp,
      provisioning_status: "ACTIVE", operating_status: "ONLINE", listener_ids: [C.lstHttp, C.lstHttps], pool_ids: [C.pool],
      provider: "amphora", flavor: "standard" }), status: "ACTIVE" },
  ],
  "load-balancer-listeners": [
    resource("lb_listener", ID.lstHttp, C.lstHttp, "pak-khi-1", "http", { loadbalancer_id: C.lb, protocol: "HTTP", protocol_port: 80,
      default_pool_id: C.pool, provisioning_status: "ACTIVE" }),
    resource("lb_listener", ID.lstHttps, C.lstHttps, "pak-khi-1", "https", { loadbalancer_id: C.lb, protocol: "TERMINATED_HTTPS",
      protocol_port: 443, default_pool_id: C.pool, provisioning_status: "ACTIVE", default_tls_container_ref: "secret-www" }),
  ],
  "load-balancer-pools": [
    resource("lb_pool", ID.pool, C.pool, "pak-khi-1", "web-pool", { loadbalancer_id: C.lb, protocol: "HTTP", lb_algorithm: "ROUND_ROBIN",
      healthmonitor_id: C.hm, provisioning_status: "ACTIVE", listener_ids: [C.lstHttp, C.lstHttps],
      members: [
        { address: "192.0.2.11", protocol_port: 8080, operating_status: "ONLINE", weight: 1, name: "web-1" },
        { address: "192.0.2.12", protocol_port: 8080, operating_status: "ONLINE", weight: 1, name: "web-2" },
      ] }),
  ],
  "load-balancer-health-monitors": [
    resource("lb_health_monitor", ID.hm, C.hm, "pak-khi-1", "web-check", { type: "HTTP", delay: 5, timeout: 3, max_retries: 3,
      url_path: "/healthz", pool_id: C.pool, provisioning_status: "ACTIVE" }),
  ],
};

// Spec 024 task 16: the features of the standard (amphora) type, as the catalog answers them.
export const LB_FEATURES = {
  version: "2026.1-1", protocols: ["HTTP", "HTTPS", "TCP", "TERMINATED_HTTPS", "UDP"],
  algorithms: ["LEAST_CONNECTIONS", "ROUND_ROBIN", "SOURCE_IP"],
  monitors: ["HTTP", "HTTPS", "TCP", "TLS-HELLO", "UDP-CONNECT"],
  monitors_by_protocol: { HTTP: ["HTTP", "TCP"], HTTPS: ["HTTPS", "TCP", "TLS-HELLO"], TERMINATED_HTTPS: ["HTTP", "TCP"],
    TCP: ["HTTP", "HTTPS", "TCP", "TLS-HELLO"], UDP: ["HTTP", "TCP", "UDP-CONNECT"] },
  tls_passthrough: ["HTTPS"], tls_termination: ["TERMINATED_HTTPS"],
  pool_protocols: { HTTP: "HTTP", HTTPS: "HTTPS", TCP: "TCP", TERMINATED_HTTPS: "HTTP", UDP: "UDP" }, member_weight: true,
  monitor_bounds: { delay_min: 1, delay_max: 3600, timeout_min: 1, timeout_below_delay: true, max_retries_min: 1, max_retries_max: 10, udp_connect_delay_min: 3 },
};
LISTS["load-balancers"]![0]!["lb_features"] = LB_FEATURES;
// What the console needs to edit the tree: each listener's and pool's settings as last read, with
// their version, and the pool's member list (spec 024 AC-14).
for (const l of LISTS["load-balancer-listeners"]!) {
  l["lb_parent_id"] = ID.lb;
  l["lb_configuration"] = { version: "v1", values: { name: l.display_name, protocol: l.attributes["protocol"], port: l.attributes["protocol_port"],
    pool_id: C.pool, algorithm: null, ...(l.attributes["protocol"] === "TERMINATED_HTTPS" ? { tls_secret_id: "secret-www" } : {}) } };
}
for (const p of LISTS["load-balancer-pools"]!) {
  p["lb_parent_id"] = ID.lb;
  p["lb_configuration"] = { version: "v1", values: { name: p.display_name, protocol: "HTTP", port: null, pool_id: null, algorithm: "ROUND_ROBIN" } };
  p["lb_members"] = { version: "m1", values: [
    { address: "192.0.2.11", port: 8080, weight: 1, backup: false, enabled: true },
    { address: "192.0.2.12", port: 8080, weight: 1, backup: false, enabled: true }] };
}

// ---- Certificates, templates, groups, schedules -------------------------------------------
const certificate = (id: string, name: string, cn: string, days: number, inUse: { listener_id: string; listener_name: string }[]) => ({
  id, display_name: name, location: "pak-khi-1", state: "active", subject: `CN=${cn}`, names: [cn, ...(cn.startsWith("www.") ? [cn.slice(4)] : [])],
  not_before: ago(30 * DAY), not_after: ahead(days * DAY + 60), days_left: days,
  fingerprint_sha256: "3f9a1c0e7b2d4a6f8c1e3b5d7f9a2c4e6b8d0f1a3c5e7b9d2f4a6c8e0b1d3f5a", key_type: "EC", key_bits: 256, chain_length: 1,
  in_use_by: inUse, last_operation: null, error: null, created_at: ago(30 * DAY),
});
export const CERTIFICATES = [
  certificate(ID.certWww, "www-2026", "www.acme.example", 214, [{ listener_id: ID.lstHttps, listener_name: "https" }]),
  certificate(ID.certApi, "api-2025", "api.acme.example", 12, []),
];

export const TEMPLATE = {
  id: ID.template, name: "web", description: "Web front end, Ubuntu 24.04, joins web-pool",
  current_version: 2, version: 3, shown_version: 2, has_user_data: true,
  versions: [{ version: 1, has_user_data: false, created_at: ago(20 * DAY) }, { version: 2, has_user_data: true, created_at: ago(6 * DAY) }],
  server: { location: KHI.id, display_name: "web", offering: "medium", image: "ubuntu-24-04", network: ID.netApp,
    security_groups: [ID.sgDefault, ID.sgWeb], ssh_key: "ssh_01jbayesha00000000000000001", public_ip: "none",
    load_balancer: { pool_id: ID.pool, port: 8080 } },
  created_at: ago(20 * DAY), updated_at: ago(6 * DAY),
};

const op = (id: string, state: string) => ({ id, href: `/v1/orgs/${ORG}/operations/${id}`, state });
const RUN_AS = { id: "usr_01jbayesha00000000000000001", you: true, kind: "person", name: "Ayesha Khan", email: "ayesha@acme.example" };
export const GROUP = {
  id: ID.group, name: "web", location: KHI.id, template: { id: ID.template, name: "web", version: null },
  desired: 3, min: 2, max: 6, max_surge: 1, pool_id: ID.pool, member_port: 8080, state: "active", paused_reason: null,
  last_error: null, last_reconcile_at: ago(1), counts: { creating: 1, active: 2, failed: 0, deleting: 0 },
  run_as: RUN_AS.id, run_as_actor: RUN_AS, version: 4, created_at: ago(6 * DAY), updated_at: ago(1 * DAY),
  members: [
    { id: ID.web1, name: "web-1", state: "active", status: "ACTIVE", failure: null, operation: op("op_01jbg1", "succeeded"),
      delete_operation: null, created_at: ago(6 * DAY) },
    { id: ID.web2, name: "web-2", state: "active", status: "ACTIVE", failure: null, operation: op("op_01jbg2", "succeeded"),
      delete_operation: null, created_at: ago(6 * DAY) },
    { id: "srv_01jbweb300000000000000001", name: "web-3", state: "creating", status: null, failure: null,
      operation: op("op_01jbg3", "running"), delete_operation: null, created_at: ago(1) },
  ],
};
export const PAUSED_GROUP = {
  ...GROUP, id: ID.group2, name: "batch-workers", location: ISB.id, desired: 2, min: 0, max: 4, pool_id: null, member_port: null,
  state: "paused", paused_reason: "create_failures", last_error: "offering_not_found",
  counts: { creating: 0, active: 0, failed: 3, deleting: 0 }, members: [],
};

export const LAUNCH = {
  id: "lch_01jbweb00000000000000000001", state: "succeeded", count: 2, created_at: ago(6 * DAY),
  template: { id: ID.template, version: 2, name: "web" },
  instances: [
    { server: { id: ID.web1, name: "web-1", href: "" }, operation: { id: "op_01jbl1", state: "succeeded", error: null, href: "" }, present: true },
    { server: { id: ID.web2, name: "web-2", href: "" }, operation: { id: "op_01jbl2", state: "succeeded", error: null, href: "" }, present: true },
  ],
};

const SCHEDULE_RUN = (id: string, minutes: number) => ({ id, action: "snapshot", scheduled_for: ago(minutes), state: "accepted", reason: null,
  operations: [op(`op_${id.slice(4, 14)}`, "succeeded")], targets: [{ id: ID.volDb, operation: `op_${id.slice(4, 14)}` }], created_at: ago(minutes) });
export const SCHEDULES = [
  { id: ID.schedBackup, kind: "backup", name: "nightly", target_type: "volume",
    targets: [{ id: ID.volDb, name: "db-data", present: true }],
    recurrence: { frequency: "daily", time: "02:00" }, power: null, time_zone: "Asia/Karachi", keep: 7,
    state: "active", paused_reason: null, next_run_at: ahead(5 * 60), next_stop_at: null, next_start_at: null,
    last_run_at: ago(19 * 60), run_as: RUN_AS.id, run_as_actor: RUN_AS, version: 3, created_at: ago(14 * DAY), updated_at: ago(3 * DAY),
    runs: [SCHEDULE_RUN("srn_01jbrun0000000000000000001", 19 * 60), SCHEDULE_RUN("srn_01jbrun0000000000000000002", 43 * 60)] },
  { id: ID.schedPower, kind: "power", name: "office-hours", target_type: "server",
    targets: [{ id: ID.batch1, name: "batch-1", present: true }],
    recurrence: null, power: { frequency: "weekly", days: ["mon", "tue", "wed", "thu", "fri"], stop_at: "20:00", start_at: "08:00" }, time_zone: "Asia/Karachi", keep: null,
    state: "active", paused_reason: null, next_run_at: ahead(8 * 60), next_stop_at: ahead(20 * 60), next_start_at: ahead(8 * 60),
    last_run_at: ago(4 * 60), run_as: RUN_AS.id, run_as_actor: RUN_AS, version: 1, created_at: ago(10 * DAY), updated_at: ago(10 * DAY),
    runs: [] },
];

// ---- Catalog, quota -----------------------------------------------------------------------
const offering = (kind: string, slug: string, display_name: string, attributes: Attrs = {}) =>
  ({ kind, slug, display_name, attributes, availability: "available" });
const COMPUTE = [
  offering("compute", "small", "Small", { vcpus: 1, ram_mb: 2048, root_gb: 20 }),
  offering("compute", "medium", "Medium", { vcpus: 2, ram_mb: 4096, root_gb: 40 }),
  offering("compute", "large", "Large", { vcpus: 4, ram_mb: 8192, root_gb: 80 }),
];
const IMAGES = [
  offering("image", "ubuntu-24-04", "Ubuntu 24.04", { os_distro: "ubuntu", os_version: "24.04" }),
  offering("image", "debian-12", "Debian 12", { os_distro: "debian", os_version: "12" }),
  offering("image", "rocky-9", "Rocky Linux 9", { os_distro: "rocky", os_version: "9" }),
];
export const CATALOG: Record<string, unknown[]> = {
  [KHI.id]: [...COMPUTE, ...IMAGES,
    offering("volume_type", "standard", "Standard", { description: "Replicated SSD" }),
    offering("volume_type", "fast", "Fast", { description: "Local NVMe" }),
    offering("load_balancer", "standard", "Standard", { features: LB_FEATURES })],
  [ISB.id]: [...COMPUTE, ...IMAGES, offering("volume_type", "standard", "Standard", { description: "Replicated SSD" })],
};

const quotaClass = (resource_class: string, display_name: string, unit: string, limit: number, used: number) => ({
  resource_class, display_name, unit, status: "active", desired: String(limit),
  applied: { value: String(limit), state: "applied", enforced: true, reason: null },
  in_use: { value: String(used), state: "known", reason: null, data_as_of: ago(2) }, below_in_use: false,
});
export const QUOTA = {
  data_as_of: ago(2),
  items: [
    { placement: { id: PL_KHI, location: "pak-khi-1", deployment: "dep" }, classes: [
      quotaClass("instances", "Instances", "count", 10, 3), quotaClass("vcpu", "vCPUs", "count", 20, 8),
      quotaClass("ram_gib", "RAM (GiB)", "gib", 40, 16), quotaClass("volumes", "Volumes", "count", 10, 2),
      quotaClass("volume_gb", "Volume storage (GiB)", "gib", 500, 120), quotaClass("networks", "Networks", "count", 5, 2),
      quotaClass("subnets", "Subnets", "count", 10, 2), quotaClass("security_groups", "Security groups", "count", 10, 4),
      quotaClass("floating_ips", "Public IPs", "count", 5, 3) ] },
    { placement: { id: PL_ISB, location: "pak-isb-1", deployment: "dep" }, classes: [
      quotaClass("instances", "Instances", "count", 4, 1), quotaClass("vcpu", "vCPUs", "count", 8, 1),
      quotaClass("ram_gib", "RAM (GiB)", "gib", 16, 2), quotaClass("volumes", "Volumes", "count", 5, 1),
      quotaClass("volume_gb", "Volume storage (GiB)", "gib", 200, 50), quotaClass("networks", "Networks", "count", 3, 1),
      quotaClass("subnets", "Subnets", "count", 5, 1), quotaClass("security_groups", "Security groups", "count", 5, 1),
      quotaClass("floating_ips", "Public IPs", "count", 2, 0) ] },
  ],
};

export const PROFILES = {
  default_profile: "standard", chosen: null,
  classes: [
    { resource_class: "vcpu", display_name: "vCPUs", unit: "count", status: "active", max_value: "1000" },
    { resource_class: "ram_gib", display_name: "RAM (GiB)", unit: "gib", status: "active", max_value: "4096" },
    { resource_class: "instances", display_name: "Instances", unit: "count", status: "active", max_value: "500" },
  ],
  custom: [{ name: "custom:web", display_name: "Web team", custom: true, version: 1,
    values: { vcpu: { value: "8", minimum: "0" }, ram_gib: { value: "16", minimum: "0" }, instances: { value: "4", minimum: "0" } } }],
  profiles: [
    { name: "small", display_name: "Small", values: { vcpu: { value: "4", minimum: "0" }, ram_gib: { value: "8", minimum: "0" }, instances: { value: "2", minimum: "0" } } },
    { name: "standard", display_name: "Standard", values: { vcpu: { value: "20", minimum: "0" }, ram_gib: { value: "40", minimum: "0" }, instances: { value: "10", minimum: "0" } } },
  ],
};

const klass = (resource_class: string, display_name: string, budget: string, allocated: string, unit = "count") => ({
  resource_class, display_name, unit, status: "active", budget, allocated,
  available: String(Number(budget) - Number(allocated)), tier_default: budget,
});
export const ENTITLEMENTS = {
  tier: "standard", projects: { limit: 10, used: 2 },
  locations: [
    { location: KHI.id, slug: KHI.slug, display_name: KHI.display_name, placements: 1, data_as_of: ago(3),
      classes: [klass("vcpu", "vCPUs", "48", "20"), klass("ram_gib", "RAM", "192", "40", "gib"),
        klass("instances", "Instances", "20", "10"), klass("volume_gb", "Volume storage (GiB)", "2000", "500", "gib"),
        klass("floating_ips", "Public IPs", "10", "5")] },
    { location: ISB.id, slug: ISB.slug, display_name: ISB.display_name, placements: 2, data_as_of: ago(3),
      classes: [klass("vcpu", "vCPUs", "32", "16"), klass("ram_gib", "RAM", "128", "32", "gib"),
        klass("instances", "Instances", "12", "8"), klass("volume_gb", "Volume storage (GiB)", "1000", "400", "gib")] },
  ],
};
export const QUOTA_REQUESTS = { items: [
  { id: "qrq_01jbreq0000000000000000001", state: "open", decision_note: null, decided_at: null, created_at: ago(2 * DAY), version: 1,
    location: KHI.id, reason: "Holiday sale traffic from 1 December", values: { vcpu: { current: "48", requested: "64" } } },
  { id: "qrq_01jbreq0000000000000000000", state: "approved", decision_note: "Approved for the quarter.", decided_at: ago(20 * DAY),
    created_at: ago(22 * DAY), version: 2, location: ISB.id, reason: "Analytics batch jobs", values: { instances: { current: "8", requested: "12" } } },
] };

// ---- People -------------------------------------------------------------------------------
export const ME_ID = "usr_01jbayesha00000000000000001";
export const ME = {
  id: ME_ID, profile: { display_name: "Ayesha Khan", email: "ayesha@acme.example" },
  memberships: [{ organization: { id: ORG, slug: "acme", display_name: "Acme" }, membership_id: "mem_01jbayesha0000000000000001",
    roles: ["owner"], status: "active" }],
};
export const ORGANIZATION = { id: ORG, slug: "acme", display_name: "Acme", lifecycle_state: "active", your_roles: ["owner"] };

const member = (n: string, principal: string, name: string, email: string, roles: string[]) =>
  ({ id: `mem_01jb${n.padEnd(22, "0")}`, principal_id: principal, display_name: name, email, roles, status: "active", account_status: "active", version: 1 });
export const MEMBERS = { items: [
  member("ayesha", ME_ID, "Ayesha Khan", "ayesha@acme.example", ["owner"]),
  member("bilal", "usr_01jbbilal000000000000000001", "Bilal Ahmed", "bilal@acme.example", ["admin"]),
  member("sara", "usr_01jbsara0000000000000000001", "Sara Malik", "sara@acme.example", ["member"]),
  member("usman", "usr_01jbusman000000000000000001", "Usman Tariq", "usman@acme.example", ["member"]),
  member("hina", "usr_01jbhina0000000000000000001", "Hina Raza", "hina@acme.example", ["billing"]),
  member("omar", "usr_01jbomar0000000000000000001", "Omar Farooq", "omar@acme.example", ["viewer"]),
], next_cursor: null };
const grant = (id: string, project: string, role: string) => ({ id, project_id: project, role, version: 1, created_at: ago(9 * DAY) });
export const MEMBER_GRANTS = { items: [
  { member_id: MEMBERS.items[0]!.id, principal_id: ME_ID, grants: [grant("grt_01jb1", PROJECT, "project_admin"), grant("grt_01jb2", PROJECT_2, "project_admin")] },
  { member_id: MEMBERS.items[1]!.id, principal_id: MEMBERS.items[1]!.principal_id, grants: [grant("grt_01jb3", PROJECT, "project_admin")] },
  { member_id: MEMBERS.items[2]!.id, principal_id: MEMBERS.items[2]!.principal_id, grants: [grant("grt_01jb4", PROJECT, "project_member")] },
  { member_id: MEMBERS.items[3]!.id, principal_id: MEMBERS.items[3]!.principal_id, grants: [grant("grt_01jb5", PROJECT_2, "project_member"), grant("grt_01jb6", PROJECT, "project_reader")] },
  { member_id: MEMBERS.items[4]!.id, principal_id: MEMBERS.items[4]!.principal_id, grants: [] },
  { member_id: MEMBERS.items[5]!.id, principal_id: MEMBERS.items[5]!.principal_id, grants: [] },
], next_cursor: null, visibility: "organization" };
const projectGrant = (id: string, member: number, role: string, days: number) => ({
  id, project_id: PROJECT, principal_id: MEMBERS.items[member]!.principal_id, principal_type: "human", role, version: 1,
  status: { state: "active", placements: [{ id: PL_KHI, locations: ["pak-khi-1"], status: "ready", reason: null },
    { id: PL_ISB, locations: ["pak-isb-1"], status: "ready", reason: null }] }, created_at: ago(days * DAY) });
export const PROJECT_GRANTS = { items: [
  projectGrant("grt_01jb1", 0, "project_admin", 40), projectGrant("grt_01jb3", 1, "project_admin", 30),
  projectGrant("grt_01jb4", 2, "project_member", 20), projectGrant("grt_01jb6", 3, "project_reader", 5),
  { id: "grt_01jbsa1", project_id: PROJECT, principal_id: "sa_01jbterraform000000000000001", principal_type: "service",
    service_account_name: "automation-prod", role: "rol_01jbdeployer00000000000001", version: 1,
    status: { state: "active", placements: [{ id: PL_KHI, locations: ["pak-khi-1"], status: "ready", reason: null }] }, created_at: ago(18 * DAY) },
], next_cursor: null };
export const INVITATION_ID = "inv_01jbzain00000000000000000001";
export const INVITEE = { id: "usr_01jbzain0000000000000000001", profile: { display_name: "Zain Hussain", email: "zain@acme.example" }, memberships: [] };
export const INVITATIONS = { items: [
  { id: "inv_01jbzain00000000000000000001", email: "zain@acme.example", role: "member", status: "pending",
    project_grants: [{ project_id: PROJECT, role: "project_member" }], expires_at: ahead(6 * DAY), created_at: ago(DAY),
    invited_by: { id: ME_ID, name: "Ayesha Khan" } },
] };

const BUILT_IN = (id: string, scope: string, actions: string[], keystone: string | null, description = "") => ({
  id, name: id, description, scope, project_id: null, builtin: true, actions, keystone_role: keystone,
  holders: null, version: null, created_at: null, updated_at: null });
export const ROLE_DEPLOYER = {
  id: "rol_01jbdeployer00000000000001", name: "Deployer", description: "CI pipelines that ship the web shop", scope: "project",
  project_id: null, builtin: false, actions: ["project.read", "workload.read", "workload.create", "workload.update"],
  keystone_role: "member", holders: 2, version: 3, created_at: ago(15 * DAY), updated_at: ago(4 * DAY) };
export const ROLE_AUDITOR = {
  id: "rol_01jbauditor000000000000001", name: "Auditor", description: "Reads the audit log and usage", scope: "organization",
  project_id: null, builtin: false, actions: ["org.read", "audit.read", "usage.read"],
  keystone_role: null, holders: 1, version: 1, created_at: ago(15 * DAY), updated_at: ago(15 * DAY) };
export const ROLES = { items: [
  BUILT_IN("owner", "organization", ["audit.read", "org.close", "org.read", "usage.read"], null),
  BUILT_IN("admin", "organization", ["audit.read", "org.read", "usage.read"], null),
  BUILT_IN("member", "organization", ["org.read", "ssh_key.add_own"], null),
  BUILT_IN("project_admin", "project", ["project.read", "workload.read", "workload.create"], "member"),
  BUILT_IN("project_member", "project", ["project.read", "workload.read", "workload.create"], "member"),
  BUILT_IN("project_reader", "project", ["project.read", "usage.read", "workload.read"], "reader"),
  ROLE_DEPLOYER, ROLE_AUDITOR,
] };
export const ROLE_ACTIONS = { items: [
  { action: "org.read", description: "See the organization", scopes: ["organization"], held: true, held_on_every_project: false },
  { action: "audit.read", description: "Read the organization's audit log", scopes: ["organization"], held: true, held_on_every_project: false },
  { action: "usage.read", description: "See usage", scopes: ["organization", "project"], held: true, held_on_every_project: true },
  { action: "project.read", description: "See a project", scopes: ["organization", "project"], held: true, held_on_every_project: true },
  { action: "workload.read", description: "See instances, volumes, networks and other resources", scopes: ["organization", "project"], held: true, held_on_every_project: true },
  { action: "workload.create", description: "Create instances, volumes, networks and other resources", scopes: ["project"], held: true, held_on_every_project: true },
  { action: "workload.update", description: "Change instances, volumes, networks and other resources", scopes: ["project"], held: true, held_on_every_project: true },
  { action: "workload.delete", description: "Delete instances, volumes, networks and other resources", scopes: ["project"], held: true, held_on_every_project: true },
] };

export const SSH_KEYS = { items: [
  { id: "ssh_01jbayesha00000000000000001", display_name: "ayesha-laptop", owner: { type: "principal", principal_id: ME_ID }, key_type: "ssh-ed25519",
    public_key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleKeyForTheDocumentationOnly0000",
    fingerprint: "SHA256:Qm9vZG9jcy1leGFtcGxlLWZpbmdlcnByaW50LW9ubHk", created_at: ago(40 * DAY) },
  { id: "ssh_01jbdeploy00000000000000001", display_name: "web-shop-deploy", owner: { type: "project", project_id: PROJECT }, key_type: "ssh-ed25519",
    public_key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAnotherExampleKeyForTheDocsOnly000",
    fingerprint: "SHA256:ZXhhbXBsZS1wcm9qZWN0LWtleS1mb3ItdGhlLWRvY3M", created_at: ago(20 * DAY) },
] };

export const SERVICE_ACCOUNT = {
  id: "sa_01jbterraform000000000000001", display_name: "automation-prod", description: "Deployment automation in CI for web-shop",
  kind: "organization", role: "member", status: "active", created_by: ME_ID, created_at: ago(18 * DAY), version: 1 };
export const SERVICE_ACCOUNT_2 = {
  id: "sa_01jbcideploy000000000000001", display_name: "ci-deploy", description: "Deploys from the main branch",
  kind: "organization", role: "member", status: "active", created_by: ME_ID, created_at: ago(9 * DAY), version: 1 };
export const API_KEY = {
  id: "key_01jbgithub00000000000000001", key_id: "q3v7kz2m9x4c8b1n6t5r0w2y7p", display_name: "github-actions",
  scopes: [], status: "active", revoked_reason: null, expires_at: ahead(71 * DAY), last_used_at: ago(35), created_by: ME_ID,
  created_at: ago(18 * DAY), predecessor_id: null };
export const NATIVE_CREDENTIAL = {
  id: "ncr_01jbkhi00000000000000000001", placement_id: PL_KHI, project_id: PROJECT, location: KHI.slug, status: "active",
  display_name: "automation-prod-pak-khi-1", expires_at: ahead(80 * DAY), created_at: ago(10 * DAY), created_by: ME_ID,
  keystone_credential_id: "a1b2c3d4e5f60718293a4b5c6d7e8f90" };
export const API_KEY_SECRET = "nxk_q3v7kz2m9x4c8b1n6t5r0w2y7p_ExampleSecretShownOnceForTheDocsOnly0000";

export const ORG_SETTINGS = {
  mfa_required: true, mfa_grace_until: null,
  second_factor: { platform_requires: false, always_for_roles: ["owner", "admin"] },
  members_create_projects: false, viewers_read_audit: false, invitation_domains: ["acme.example"], version: "3",
  descriptions: {}, owner_only: ["mfa_required", "invitation_domains"],
  audit: { lookback_days: 90, max_lookback_days: 365, min_lookback_days: 7, export_enabled: true, version: "1",
    note: "How far back the audit log reads." },
};

// ---- Activity, operations -----------------------------------------------------------------
const actor = (who: "ayesha" | "sara" | "bilal" | "sa" | "system") => ({
  ayesha: { type: "human", id: ME_ID, function: null, name: "Ayesha Khan", email: "ayesha@acme.example" },
  sara: { type: "human", id: MEMBERS.items[2]!.principal_id, function: null, name: "Sara Malik", email: "sara@acme.example" },
  bilal: { type: "human", id: MEMBERS.items[1]!.principal_id, function: null, name: "Bilal Ahmed", email: "bilal@acme.example" },
  sa: { type: "service_account", id: SERVICE_ACCOUNT.id, function: null, name: "automation-prod" },
  system: { type: "system", id: null, function: "scheduler", name: null },
}[who]);
const event = (n: number, minutes: number, name: string, category: string, description: string, who: Parameters<typeof actor>[0],
  target: { type: string; id: string }, extra: Record<string, unknown> = {}) => ({
  id: `aud_01jb${String(n).padStart(22, "0")}`, occurred_at: ago(minutes), name, category, severity: "notice", description,
  outcome: "succeeded", actor: actor(who), target, operation_id: null, request_id: `req_01jb${String(n).padStart(20, "0")}`,
  reason: null, summary: {}, ...extra });
export const AUDIT_EVENTS = { taxonomy_version: 1, next_cursor: null, items: [
  event(1, 4, "workload.server.create", "management", "An instance was requested", "sara", { type: "server", id: ID.web2 },
    { operation_id: "op_01jbweb2create000000000001", project_id: PROJECT }),
  event(2, 30, "workload.volume.snapshot", "management", "A volume snapshot was requested", "system", { type: "volume", id: ID.volDb },
    { operation_id: "op_01jbnightly0000000000000001", project_id: PROJECT }),
  event(3, 95, "iam.member.roles_change", "access", "A member's organization roles changed", "ayesha", { type: "membership", id: MEMBERS.items[3]!.id },
    { summary: { roles: { from: ["viewer"], to: ["member"] } } }),
  event(4, 180, "iam.invitation.created", "access", "Someone was invited", "ayesha", { type: "invitation", id: INVITATIONS.items[0]!.id }),
  event(5, 300, "iam.api_key.created", "credential", "An API key was issued", "bilal", { type: "api_key", id: API_KEY.id }),
  event(6, 600, "workload.load_balancer.update", "management", "A load balancer was changed", "sa", { type: "load_balancer", id: ID.lb },
    { operation_id: "op_01jblbupdate00000000000001", project_id: PROJECT }),
  event(7, 1440, "tenancy.project.created", "management", "A project was created", "ayesha", { type: "project", id: PROJECT_2 }),
  event(8, 1500, "iam.session.denied", "security", "A request was refused", "sara", { type: "project", id: PROJECT_2 },
    { outcome: "denied", severity: "warning", reason: "forbidden" }),
] };

const step = (ordinal: number, action: string, state: string, minutes: number) => ({
  id: `ops_01jb${String(ordinal).padStart(22, "0")}`, ordinal, type: "workload", component: "compute", action,
  service: "compute", region: "RegionOne", state, error: null, attempts: 1, started_at: ago(minutes), completed_at: state === "succeeded" ? ago(minutes - 1) : null,
  result: {}, locations: ["pak-khi-1"],
});
export const OPERATION = {
  id: "op_01jbweb2create000000000001", kind: "server.create", state: "succeeded", error: null,
  accepted_at: ago(4), started_at: ago(4), completed_at: ago(2),
  resource: { type: "server", id: ID.web2, display_name: "web-2", provider_id: C.web2, location: "pak-khi-1" },
  project_id: PROJECT, actor: { id: MEMBERS.items[2]!.principal_id, you: false, kind: "person", name: "Sara Malik", email: "sara@acme.example" },
  steps: [step(1, "create_server", "succeeded", 4), step(2, "await_server", "succeeded", 3)],
};
const listedOp = (id: string, kind: string, state: string, minutes: number, resource: { type: string; id: string; display_name: string },
  who: { id: string; name: string; email?: string; you?: boolean; kind?: string }) => ({
  id, kind, state, error: null, accepted_at: ago(minutes), started_at: ago(minutes), completed_at: state === "running" ? null : ago(minutes - 1),
  resource: { ...resource, location: "pak-khi-1", provider_id: null }, project_id: PROJECT,
  actor: { you: false, kind: "person", ...who }, href: `/v1/orgs/${ORG}/operations/${id}`, steps: [],
});
export const OPERATIONS = { items: [
  listedOp("op_01jbweb3create000000000001", "server.create", "running", 1, { type: "server", id: "srv_01jbweb300000000000000001", display_name: "web-3" },
    { id: ME_ID, name: "Ayesha Khan", you: true }),
  listedOp(OPERATION.id, "server.create", "succeeded", 4, { type: "server", id: ID.web2, display_name: "web-2" }, { id: MEMBERS.items[2]!.principal_id, name: "Sara Malik", email: "sara@acme.example" }),
  listedOp("op_01jbnightly0000000000000001", "volume.snapshot", "succeeded", 30, { type: "volume", id: ID.volDb, display_name: "db-data" }, { id: ME_ID, name: "Ayesha Khan", you: true }),
  listedOp("op_01jblbupdate00000000000001", "load_balancer.update", "succeeded", 600, { type: "load_balancer", id: ID.lb, display_name: "web-lb" }, { id: SERVICE_ACCOUNT.id, name: "automation-prod", kind: "service_account" }),
  listedOp("op_01jbfailedvol000000000000001", "volume.extend", "failed", 900, { type: "volume", id: ID.volScratch, display_name: "scratch" }, { id: MEMBERS.items[2]!.principal_id, name: "Sara Malik", email: "sara@acme.example" }),
], next_cursor: null };

// ---- Usage and costs (provisional; sample figures, not NubeStack's prices) ---------------
export function usage(groupBy: string | null) {
  const rows = groupBy === "project" ? { project: PROJECT } : groupBy === "location" ? { location: KHI.slug } : {};
  return {
    from: ago(30 * DAY), to: NOW, provisional: true, sources: [{ location: KHI.slug, status: "ok", data_as_of: ago(5) },
      { location: ISB.slug, status: "ok", data_as_of: ago(6) }],
    items: [
      { metric: "compute.instance.hours", unit: "h", quantity: "2232", bounded: false },
      { metric: "compute.vcpu.hours", unit: "vCPU·h", quantity: "6696", bounded: false },
      { metric: "compute.ram.gb_hours", unit: "GiB·h", quantity: "13392", bounded: false },
      { metric: "block.volume.gb_hours", unit: "GiB·h", quantity: "126480", bounded: true },
      { metric: "network.floating_ip.hours", unit: "h", quantity: "2232", bounded: false },
      { metric: "loadbalancer.hours", unit: "h", quantity: "744", bounded: false },
    ].map((item) => ({ ...item, ...rows })),
  };
}

const monthStart = (back: number) => { const d = new Date(now); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - back, 1)); };
const ym = (d: Date) => d.toISOString().slice(0, 7);
const iso = (d: Date) => d.toISOString().replace(".000Z", "Z");
const plusDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400_000);
const CUR = monthStart(0), PREV = monthStart(1), NEXT = monthStart(-1);
const HOUR_AGO = new Date(Math.floor(now / 3600_000) * 3600_000 - 15 * 60_000);
const sline = (id: string, kind: "usage" | "adjustment", period: Date, metric: string, unit: string,
  dimension: { key: string; value: string } | null, quantity: string, price: string | null, amount: string | null) => ({
  id, kind, usage_period: ym(period), metric, unit, location: KHI.slug, dimension,
  rated: amount !== null, rate_version: amount !== null ? 2 : null, unit_price: price, quantity, amount,
  hours_from: iso(period), hours_to: iso(plusDays(period, 20)), observations: 40, bounded: false });
const ssum = (id: string, start: Date, state: "open" | "closed", total: string, lines: number, unrated: number) => ({
  id, period: ym(start), period_start: iso(start), period_end: iso(start === PREV ? CUR : NEXT), state, currency: "PKR", total, lines,
  unrated_lines: unrated, provisional: true, as_of: state === "open" ? iso(HOUR_AGO) : iso(plusDays(CUR, 5)),
  closes_at: iso(plusDays(state === "open" ? NEXT : CUR, 5)), closed_at: state === "closed" ? iso(plusDays(CUR, 5)) : null });
export const STATEMENT_OPEN = { ...ssum("stm_01jbcurrent00000000000001", CUR, "open", "18420.50", 4, 1),
  adjustments_after: iso(plusDays(CUR, 5)), built_at: iso(HOUR_AGO), items: [
    sline("stl_1", "usage", CUR, "compute.instance.hours", "hour", { key: "flavor", value: "Medium" }, "1440", "8.5", "12240"),
    sline("stl_2", "usage", CUR, "block.volume.gb_hours", "gb_hour", { key: "volume_type", value: "standard" }, "86400", "0.0715", "6177.60"),
    sline("stl_3", "usage", CUR, "network.floating_ip.hours", "hour", null, "1440", null, null),
    sline("stl_4", "adjustment", PREV, "compute.instance.hours", "hour", { key: "flavor", value: "Medium" }, "0.2", "8.5", "1.70"),
  ] };
const statementTotal = "17010.00";
export const STATEMENT_CLOSED = { ...ssum("stm_01jbprevious0000000000001", PREV, "closed", statementTotal, 1, 0),
  adjustments_after: null, built_at: iso(plusDays(CUR, 5)),
  items: [sline("stl_9", "usage", PREV, "compute.instance.hours", "hour", { key: "flavor", value: "Medium" }, "2001.18", "8.5", statementTotal)] };
export const STATEMENTS = { items: [STATEMENT_OPEN, STATEMENT_CLOSED].map(({ items: _i, adjustments_after: _a, built_at: _b, ...s }) => s), next_cursor: null };
export const RATE_CARD = { currency: "PKR", provisional: true,
  in_force: { version: 2, effective_from: iso(PREV), lines: [
    { metric: "compute.instance.hours", location: null, dimension: { key: "flavor", value: "Medium" }, unit_price: "8.5" },
    { metric: "block.volume.gb_hours", location: null, dimension: { key: "volume_type", value: "standard" }, unit_price: "0.0715" },
  ] }, next: null };

type Grouping = "project" | "service" | "location" | "tag:env" | "tag:team";
const daysOf = (start: Date, n: number, amount: string | null) =>
  Array.from({ length: n }, (_, i) => ({ day: `${ym(start)}-${String(i + 1).padStart(2, "0")}`, amount }));
export function costs(period: string, groupBy: Grouping) {
  const n = Math.max(3, Math.min(28, new Date(now).getUTCDate() - 1));
  const g = (key: string | null, label: string, perDay: number) => ({ key, label, amount: (perDay * n).toFixed(2), days: daysOf(CUR, n, perDay.toFixed(2)) });
  const groups: Record<Grouping, ReturnType<typeof g>[]> = {
    project: [g(PROJECT, "web-shop", 520), g(PROJECT_2, "analytics", 180)],
    service: [g("compute", "Compute", 470), g("block_storage", "Block storage", 160), g("networking", "Networking", 40), g("load_balancers", "Load balancers", 30)],
    location: [g(KHI.slug, "Karachi", 520), g(ISB.slug, "Islamabad", 180)],
    "tag:env": [g("prod", "prod", 480), g("dev", "dev", 90), g(null, "Untagged", 130)],
    "tag:team": [g("web", "web", 330), g("data", "data", 190), g(null, "Untagged", 180)],
  };
  const base = { group_by: groupBy, project: null, currency: "PKR", provisional: true, tag_keys: ["env", "team"],
    services: [{ key: "compute", label: "Compute" }, { key: "block_storage", label: "Block storage" }, { key: "images", label: "Images" },
      { key: "networking", label: "Networking" }, { key: "load_balancers", label: "Load balancers" }] };
  if (period !== ym(CUR)) return null;
  const list = groups[groupBy];
  const total = list.reduce((s, x) => s + Number(x.amount), 0).toFixed(2);
  return { ...base, period, as_of: iso(HOUR_AGO), total, unrated: [],
    groups: list, untagged: groupBy.startsWith("tag:") ? list.find((x) => x.key === null)?.amount ?? null : null,
    previous: { period: ym(PREV), total: "19650.00", groups: list.map((x) => ({ key: x.key, amount: (Number(x.amount) * 28 / n * 0.95).toFixed(2) })), reason: null },
    projection: { amount: (700 * 30).toFixed(2), basis_days: 7, reason: null } };
}
