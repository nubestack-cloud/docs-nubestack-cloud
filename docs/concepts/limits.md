---
title: Limits
description: The fixed limits of NubeStack Cloud, apart from your quota.
---

# Limits

Your **quota** limits how much a project holds in each location, and your organization's
**budget** limits the quota (see [Projects and quotas](/concepts/projects-and-quotas.md#quota)).
The limits below are fixed by the product. A request past one is refused with the code shown,
before anything is made.

## Organization

| What | Limit | Refusal |
|---|---|---|
| Projects | set by NubeStack for your organization; the organization's **Overview** shows it | `project_limit` |
| Service accounts | 100 | `service_account_limit` |
| Active API keys per service account | 2 (the key and its successor while you rotate) | `api_key_limit` |
| Cloud credentials per service account, per project location | 2 | `credential_limit` |
| Custom roles for the organization | 50 | `role_limit` |
| Custom roles of one project | 20 | `role_limit` |
| Custom organization roles one member holds | 10 | |
| Tag keys in use across the organization | 50 | `tag_keys_limit` |
| Invitation e-mail domains | 20 | |

## Per project

| What | Limit | Refusal |
|---|---|---|
| Launch templates | 50, each with up to 100 versions | `launch_template_limit`, `launch_template_version_limit` |
| Schedules | 20, each acting on up to 10 volumes or instances in one location | `schedule_limit` |
| Instance groups | 20 | `instance_group_limit` |
| Certificates per location | 50 | `certificate_limit` |
| SSH keys per owner (you, or one project) | 50 | `ssh_key_limit` |

## Instances

| What | Limit |
|---|---|
| Instances in one launch | 1 to 10 |
| Data volumes attached at launch | 8 |
| Server groups a project has in a location, and instances in one group | 10 each, set by the location |
| Instances one host may run in a **Different hosts** group | 1 to 10 |
| User data | 49,149 bytes |
| Metadata keys | 1 to 64 letters, digits, `-` or `_`; values up to 255 characters |
| Console log shown | the last 50 to 2,000 lines, at most 100 KB |
| Browser console | closes 10 minutes after it opens |
| Name | up to 255 characters |

## Instance groups

| What | Limit |
|---|---|
| Size (minimum, desired, maximum) | 0 to 100, with minimum ≤ desired ≤ maximum |
| Instances created at once (surge) | 1 to 10 |
| Failed creates in a row before the group pauses | 3 |

## Networking

| What | Limit |
|---|---|
| Network range | a private IPv4 range from `/16` to `/28`, inside `10.0.0.0/8`, `172.16.0.0/12` or `192.168.0.0/16` |
| DNS servers per range | 4 |
| Routes on a project's router | 16 |
| Forwarded ranges per instance interface | 10 |
| Internet gateways | 1 per project and location |
| Load balancer listeners | 10 per load balancer, no two on the same protocol and port |
| Pool members | 100 per pool |
| Health check | every 1 to 3,600 s; 1 to 10 retries; the timeout shorter than the interval |

## Storage

| What | Limit |
|---|---|
| Volume size | 1 to 4,096 GiB, and at least the image or snapshot it starts from |
| Snapshots a backup schedule keeps, per volume | 1 to 100 |
| How often a schedule runs | at most once an hour |

## Certificates

| What | Limit |
|---|---|
| Chain | up to 5 intermediate certificates |
| Private key | RSA of 2,048 bits or more, or EC on P-256 or P-384, without a passphrase |
| Validity at upload | valid now and for at least another day |
| Certificates per HTTPS listener | 1 |

## API

| What | Limit |
|---|---|
| Page size of a list | 1 to 200, 50 by default |
| `Idempotency-Key` | up to 255 of letters, digits and `.` `_` `~` `-` |
| API key lifetime | 1 to 365 days, 90 by default |
| Requests too fast | refused with `429`; wait the seconds in `Retry-After` |
