# How would you scale OpenSearch?

## Short answer
Scale OpenSearch by adding capacity and by lowering the cost of each query.

## Key points
- Serverless: automatic OCUs with a maximum; managed: nodes, shards and replicas.
- Filters, lower dimensions and caching reduce per-query work.
- Separate collections isolate workloads.

## CWD context
Monitor OCU utilisation against your limit.
