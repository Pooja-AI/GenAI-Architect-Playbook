# How would you handle large datasets?

## Short answer
Handle large datasets by keeping work distributed and minimising shuffles and small files.

## Key points
- Autoscaling clusters and Photon.
- Filter early, broadcast small tables, manage skew.
- Compact files (OPTIMIZE) and use liquid clustering or Z-order.
- Prefer incremental processing over full reloads.

## CWD context
Look at the Spark UI first when a job is slow.
