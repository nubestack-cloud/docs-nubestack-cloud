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

    Every usage figure, statement and cost in the console is marked **provisional**. Measurement is
    still being checked against each location's own records, and until that is done the figures can
    change. A statement is not an invoice: invoices come separately from NubeStack, and while figures
    are provisional the invoice is the one that counts.


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

Which measures are charged, and at what price, is set in NubeStack's rate card, shown at the bottom
of the **Statements** page. A stopped instance still counts instance hours; a stopped instance's
vCPU and RAM hours stop.

## Where to see it

- **Usage**, in the organization's left panel, for owners, admins and the billing role: pick a
  period, then break a measure down by project, location or kind of resource.
  See [Usage](/organization/usage.md).
- **Statements** and **Cost explorer**, for owners, admins and the billing role: what each month
  cost at the published rates, and where the money goes, by project, service, location or tag.
  See [Statements and cost explorer](/organization/statements-and-costs.md).
- **Quota and usage**, at the bottom of a project's left panel: what that project used, for anyone
  with a role on the project.

## How usage is built

Usage comes from what each location reports every few minutes. When something starts or stops
between two reports, the moment is estimated; such hours are marked **partly estimated**. A
location that has not reported recently is shown with the time of its last report; missing hours
are never filled in as zero, and are added when the location reports again. Corrections never
rewrite history silently: a correction to a month already closed appears on the next statement as
an **adjustment**.

Usage is recorded for everything in your projects, including what you make with a location's own
dashboard or CLI. A resource that failed to create may still have been counted for the time it
existed. After a project or the organization is deleted, its usage records are kept.

## Keep costs down

- Release [public IPs](/networking/public-ips.md) you no longer need: an allocated address counts
  even when attached to nothing, and stays allocated after its instance is deleted.
- Delete snapshots and images you no longer need; they count for as long as they exist.
- Stop instances you are not using, or put them on a [power schedule](/storage/schedules.md):
  vCPU and RAM hours stop while an instance is stopped. Instance hours, disks and addresses still
  count.
- Delete an [Internet gateway](/networking/internet-gateways.md) you made only for a test.
- Use [tags](/concepts/tags.md) and the cost explorer's **Tag** view to see which team or
  environment spends what.
