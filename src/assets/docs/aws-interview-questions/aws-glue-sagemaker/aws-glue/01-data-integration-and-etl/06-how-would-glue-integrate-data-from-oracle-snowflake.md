# How would Glue integrate data from Oracle/Snowflake?

## Short answer
Read Oracle through JDBC and Snowflake through the native connector, using private connections.

## Key points
- Glue connection in a private subnet with security groups; credentials in Secrets Manager.
- Partitioned reads for parallelism; incremental by watermark.
- DMS for change data capture from Oracle where lower latency is needed.

## CWD context
Avoid heavy scans on production databases during business hours.
