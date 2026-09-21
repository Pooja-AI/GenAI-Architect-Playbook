# How would you optimize Glue cost?

## Short answer
Reduce Glue cost with right-sizing, incremental work and cheaper execution options.

## Key points
- Auto scaling and right-sized workers; Flex execution class for non-urgent jobs.
- Bookmarks and incremental loads; efficient formats; compact small files.
- Fewer or no crawlers; Lambda or Athena for small tasks; tags and budgets.

## CWD context
Idle workers and full reloads are the usual waste.
