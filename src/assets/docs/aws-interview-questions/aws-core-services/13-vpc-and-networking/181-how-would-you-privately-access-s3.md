# How would you privately access S3?

## Short answer
Access S3 privately through a gateway endpoint plus policies that require it.

## Key points
- Route-table entry to the S3 endpoint; endpoint policy limiting buckets.
- Bucket policy denying requests not coming through the endpoint (aws:SourceVpce).
- Use an S3 interface endpoint for on-premises or cross-VPC access.

## CWD context
The bucket policy makes private access enforced, not optional.
