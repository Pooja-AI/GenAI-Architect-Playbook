# How do you implement least privilege?

## Short answer
Implement least privilege by starting minimal and tightening with evidence.

## Key points
- Specific actions and resource ARNs, not wildcards; conditions for VPC, tags or MFA.
- Separate roles per function; permission boundaries and SCPs.
- Access Analyzer policy generation from CloudTrail activity and unused-access findings; regular reviews.

## CWD context
Applies to agents and tools as much as to people.
