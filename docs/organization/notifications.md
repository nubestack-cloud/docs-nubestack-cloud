---
title: E-mail notices
methods: true
---

# E-mail notices

Choose which optional notices this organization sends you. Preferences belong to you in the selected organization; they do not change another member's choices or your preferences in a different organization.

<!-- methods -->
## Choose maintenance notices

1. Select the intended organization.
2. Open the account menu and choose **E-mail notices**.
3. Review the switches for maintenance starting, being extended and ending in locations you use.
4. Change each optional switch as needed. Read any saved-value or delivery notice on the page.

![Personal maintenance notices and the messages always sent](../assets/screens/organization/notifications.webp)

Invitations addressed to you, closure of an organization you own and answers to quota requests you made are listed as **Always sent**. They cannot be disabled using the maintenance switches.

## With the API

Read your preferences with `GET /v1/orgs/{org_id}/notification-preferences`. Update one offered kind using `PUT /v1/orgs/{org_id}/notification-preferences/{kind}` with `{"enabled": true}` or `false`.

The update returns the saved preferences with `200`; it is not a cloud provisioning operation. Use the kinds returned by the API rather than inventing message categories. See [the organization reference](/api/reference/organizations.md).

## Delivery and maintenance

If the page says the provider is not sending email yet, saving a preference does not guarantee delivery; the choice applies when email is enabled. Check the dates and time zones in maintenance notices, and use the console's location and operation status when investigating an affected request.

A maintenance notice is not an automatic application failover. Arrange your application's own recovery plan if it must continue through a location outage. Ask through your supplied [support route](/help/support.md) if the maintenance scope is unclear.
