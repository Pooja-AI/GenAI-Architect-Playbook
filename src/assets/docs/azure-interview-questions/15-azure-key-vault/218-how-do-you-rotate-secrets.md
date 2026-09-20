# How do you rotate secrets?

## Short answer
Rotate secrets with an automated, zero-downtime process.

## Key points
- Prefer identity-based access so fewer secrets exist.
- Key auto-rotation and certificate auto-renewal.
- SecretNearExpiry events trigger a Function that creates a new credential and writes a new secret version.
- Version-less references and dual-credential overlap; test rotation regularly.

## CWD context
Rehearse rotation before it becomes an emergency.
