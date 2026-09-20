# How would you version models?

## Short answer
Version models through the registry, with metadata linking to code and data.

## Key points
- Automatic version numbers, tags for status.
- Lineage to job, data asset and commit.
- Azure ML registries share models across workspaces, for example dev to prod.

## CWD context
Deployments reference an explicit model version, never "latest".
