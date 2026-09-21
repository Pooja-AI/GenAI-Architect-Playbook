# How would you control access to documents?

## Short answer
Control access to documents at several layers.

## Key points
- IAM roles per component with prefix-scoped policies, or S3 Access Points.
- Short-lived presigned URLs issued only after an entitlement check.
- Document-level entitlements enforced in retrieval through ACL metadata, not by S3 alone.
- CloudTrail data events for audit.

## CWD context
Users never get direct bucket access.
