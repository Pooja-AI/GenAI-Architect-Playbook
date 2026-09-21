# How do you version CWD APIs?

## Short answer
Use stages for environments and path or header versions for API versions.

## Key points
- Stages (dev, prod) are environments, not API versions.
- Version in the path (/v1) or a header; custom-domain base-path mappings.
- Canary releases per stage; announce deprecations; keep backward compatibility.

## CWD context
The contract is public; treat changes with care.
