# Security Group vs NACL?

## Short answer
Security groups are stateful and allow-only at the resource level; NACLs are stateless and rule-ordered at the subnet level.

## Key points
- Security group: return traffic automatic; evaluates all rules.
- NACL: allow and deny rules in order; must permit return traffic and ephemeral ports.

## CWD context
Security groups are the main control; NACLs add coarse subnet-level blocks.
