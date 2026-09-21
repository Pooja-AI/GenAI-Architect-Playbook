# How would you partition data in S3?

## Short answer
Partition S3 data by low-cardinality columns that queries filter on, and keep files a sensible size.

## Key points
- Hive-style prefixes such as source_system and date; avoid over-partitioning.
- Target roughly 128 MB to 1 GB files; partition projection for many partitions.
- Separate raw and curated zones; partition indexes in the catalogue.

## CWD context
Match partitioning to how data is read.
