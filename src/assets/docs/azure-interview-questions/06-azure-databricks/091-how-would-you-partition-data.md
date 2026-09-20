# How would you partition data?

## Short answer
Partition by low-cardinality columns that are commonly filtered, and avoid over-partitioning.

## Key points
- Typical choices: date or tenant.
- Too many partitions creates many small files and slow reads.
- For high-cardinality filters use liquid clustering or Z-order instead.
- Organise ADLS folders by source and date for lifecycle management.

## CWD context
Match partitioning to the way data is read.
