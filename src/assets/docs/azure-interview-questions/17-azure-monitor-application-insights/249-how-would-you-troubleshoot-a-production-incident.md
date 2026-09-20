# How would you troubleshoot a production incident?

## Short answer
Troubleshoot an incident with a repeatable path from impact to root cause.

## Key points
- Assess impact and scope; check Service Health and alerts.
- Take the correlation ID and time window; open the end-to-end trace; find the failing span.
- Check recent changes: deployments, prompt, model and config versions; check quotas and throttling.
- Mitigate (roll back, fall back, scale, flag off), verify, then run a post-incident review.

## CWD context
Mitigate first, investigate second.
