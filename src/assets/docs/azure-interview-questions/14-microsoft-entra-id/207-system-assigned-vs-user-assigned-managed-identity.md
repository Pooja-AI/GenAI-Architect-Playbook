# System-assigned vs user-assigned managed identity?

## Short answer
System-assigned identities live and die with the resource; user-assigned identities are standalone and reusable.

## Key points
- System-assigned: simple, one-to-one, deleted with the resource.
- User-assigned: pre-provisioned RBAC, survive redeployment, shared across replicas.
- Sharing one identity widens the blast radius.

## CWD context
One user-assigned identity per Worker type is a sound middle path.
