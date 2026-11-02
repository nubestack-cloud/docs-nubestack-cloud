---
title: Glossary
description: The words NubeStack Cloud's console, API and docs use, in one place.
---

# Glossary

API key
:   A secret a [service account](../organization/service-accounts.md) sends as a bearer token to
    call the API. Shown once when issued.

Catalog
:   What a location offers: instance sizes, images, volume types and load balancer types.

Certificate
:   A TLS certificate with its private key, served by HTTPS load balancer listeners.

Cloud credential
:   An OpenStack application credential for one project in one location, for unattended tools.

Default certificate
:   The certificate an HTTPS listener serves to clients whose host name matches none of its other
    certificates. See [SNI](../security/sni.md).

Horizon
:   A location's own OpenStack dashboard.

Idempotency key
:   A value you send with a change so that sending it again does not make it twice.

Image
:   A saved system disk that instances start from: the location's, or one of your own.

Instance
:   A virtual machine in one location.

Instance group
:   A number of instances from a launch template, kept running.

Internet gateway
:   Outbound Internet access for a project's routed networks in one location.

Launch template
:   Saved, versioned instance settings to launch one to ten instances like it.

Listener
:   The protocol and port a load balancer answers on.

Load balancer
:   One address that spreads traffic over a pool of instances.

Location
:   One of NubeStack's independent clouds: Karachi (`pak-khi-1`) or Islamabad (`pak-isb-1`).

Nexus
:   The platform NubeStack Cloud runs on. The console shows the name in a few places: **Created by:
    Nexus** for resources NubeStack Cloud made for you, **outside Nexus** for resources made with a
    location's own tools, and possibly on a location's sign-in page. It is not a different account.

Operation
:   The record of a change being carried out in a location, from accepted to its final state.

Organization
:   Your account: its members, projects, roles, quota and usage.

Placement
:   In the API, a project's presence in one location (`plc_…`), for example in quota and Internet
    gateway routes.

Pool
:   The instances a load balancer listener sends traffic to, with a balancing method.

Project
:   A group of resources and the people who may use them, in one or more locations.

Provisional
:   Still being checked: usage and cost figures may change and are not a bill.

Public IP
:   An address that makes one instance or load balancer reachable from the Internet. `floating-ips`
    in the API.

Quota
:   How much a project may hold in a location, shared out of the organization's budget.

Routed network
:   A network attached to the project's private router in its location.

Schedule
:   Something that runs on a timetable: backups, power, or an instance group's size.

Security group
:   Firewall rules for instances and load balancers. Rules allow; nothing denies.

Server group
:   A rule to place instances on different hosts, or together.

Service account
:   An identity for automation, with roles, API keys and cloud credentials.

SNI
:   Server Name Indication: the host name a client asks for when it starts TLS, which lets one
    listener serve a different certificate for each domain.

Snapshot
:   A point-in-time copy of a volume, on the same storage.

SSH key
:   A public key copied into new instances so you can log in.

Subnet
:   A network's address range, with its gateway, DHCP and DNS settings.

Tag
:   A `key: value` label to filter lists and break down costs.

Volume
:   A disk that keeps its data apart from any one instance.
