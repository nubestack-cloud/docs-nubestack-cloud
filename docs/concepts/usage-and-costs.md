---
title: Usage and costs
description: What NubeStack Cloud measures, how statements and the cost explorer price it, and why every figure is provisional for now.
---

# Usage and costs

NubeStack Cloud measures what your organization uses: how many hours each instance existed, how
many gigabytes of storage you kept and for how long, how long you held public IPs. Once NubeStack
has published its rates, that usage is priced into a monthly **statement** and shown day by day in
the **cost explorer**.

!!! warning "Provisional"

    Every usage figure, statement, price estimate and cost in the console is marked
    **provisional**. Measurement is still being checked against each location's own records, and
    until that is done the figures can change. A provisional statement is not an invoice. Use the
    commercial information supplied with your account for billing questions; the console does not
    collect payments or calculate taxes.

## What is measured

| Measure | Unit | Counted while |
|---|---|---|
| Instance hours | hours | the instance exists, in any state, including stopped and shelved |
| vCPU hours | vCPU·hours | the instance is running or starting |
| RAM | GiB·hours | the instance is running or starting |
| Volumes | GiB·hours | the volume exists, attached or not |
| Volume snapshots | GiB·hours | the snapshot exists |
| Images | GiB·hours | one of your own images exists |
| Public IP hours | hours | the public IP is allocated to the project, attached or not |
| Internet gateway hours | hours | the gateway exists |
| Load balancer hours | hours | the load balancer exists, in any state |

Which measures are charged, and at what price, is set in NubeStack's rate card: **Billing →
Prices**. A price for one size is set by its catalog name, such as an instance size, a volume type
or a load balancer type, and applies in every location that offers it. A stopped instance still
counts instance hours; its vCPU and RAM hours stop.

## Where to see it

- **Billing → Usage**, in the organization, for owners, admins and the billing role: pick a
  period, then break a measure down by project, location or kind of resource.
  See [Usage](../organization/usage.md).
- **Billing → Statements**, **Cost explorer** and **Prices**, for the same roles: what each month
  cost at the published rates, where the money goes, and the rates themselves.
  See [Statements and cost explorer](../organization/statements-and-costs.md).
- **Billing** in a project: that project's usage and cost, for the same roles.
- **Quota**, at the bottom of a project's menu: what that project used this month, for anyone
  with a role on the project.
- **Create pages**: owners, admins and the billing role see a price estimate per hour or per
  month before they create something billed. Dialogs that create an Internet gateway or a
  snapshot say its rate.

## How usage is built

Usage comes from what each location reports every few minutes. When something starts or stops
between two reports, the moment is estimated; such hours are marked **partly estimated**. A
location that has not reported recently is shown with the time of its last report. Missing hours
are never filled in as zero: **Hours not counted** shows them, and they are added when the
location reports again. Corrections never
rewrite history silently: a correction to a month already closed appears on the next statement as
an **adjustment**.

Usage is recorded for everything in your projects, including what you make with a location's own
dashboard or CLI. A resource that failed to create may still have been counted for the time it
existed. After a project or the organization is deleted, its usage records are kept.

## Keep costs down

- Release [public IPs](../networking/public-ips.md) you no longer need: an allocated address counts
  even when attached to nothing, and stays allocated after its instance is deleted.
- Delete snapshots and images you no longer need; they count for as long as they exist.
- Stop instances you are not using, or put them on a [power schedule](../storage/schedules.md):
  vCPU and RAM hours stop while an instance is stopped. Instance hours, disks and addresses still
  count.
- Delete an [Internet gateway](../networking/internet-gateways.md) you made only for a test.
- Use [tags](tags.md) and the cost explorer's **Tag** view to see which team or
  environment spends what.
