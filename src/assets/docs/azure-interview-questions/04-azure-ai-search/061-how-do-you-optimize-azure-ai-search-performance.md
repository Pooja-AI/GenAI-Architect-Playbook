# How do you optimize Azure AI Search performance?

## Short answer
Optimise AI Search by right-sizing the index and keeping queries lean.

## Key points
- Retrievable fields limited to what is needed; filterable only where required.
- Vector compression and tuned HNSW parameters.
- Appropriate SKU, replicas and partitions; small top-k; limit semantic-ranker candidates.
- Co-locate with the app; load-test to find the knee.

## CWD context
Optimise with measurements, not guesses.
