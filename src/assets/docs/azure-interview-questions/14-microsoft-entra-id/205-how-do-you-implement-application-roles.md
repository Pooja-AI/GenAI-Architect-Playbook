# How do you implement application roles?

## Short answer
Define app roles in the app registration and assign them to users, groups and service principals.

## Key points
- Examples: CWD.User, CWD.Admin, Agent.Operator, Approver.
- Roles appear in the token; APIM and CWD enforce them.
- Separate roles for registry changes and destructive-action approval.

## CWD context
Roles grant features; entitlements grant data.
