# How would Lambda access S3 securely?

## Short answer
Give the Lambda execution role read access only to the specific bucket and prefix.

## Key points
- s3:GetObject on the exact ARN; kms:Decrypt on the bucket's key.
- Bucket policy also restricts access; use a gateway VPC endpoint when the function is in a VPC.
- No keys or broad wildcards.

## CWD context
Both sides (role and bucket policy) express the same least privilege.
