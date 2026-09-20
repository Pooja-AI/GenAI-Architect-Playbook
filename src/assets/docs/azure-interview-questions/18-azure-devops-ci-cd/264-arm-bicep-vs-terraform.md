# ARM/Bicep vs Terraform?

## Short answer
Bicep is Azure-native infrastructure as code; Terraform is multi-cloud with a large provider ecosystem.

## Key points
- ARM templates: JSON, verbose; Bicep compiles to ARM with cleaner syntax and same-day support for new Azure features, no state file.
- Terraform: state and plan workflow, providers for Azure, Databricks, Snowflake and more.
- Choose Bicep for Azure-only teams; Terraform for multi-cloud or existing skills.

## CWD context
Consistency across the team matters more than the tool.
