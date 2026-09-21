# How would you implement hybrid search?

## Short answer
Hybrid search combines a BM25 query and a vector query and merges their scores.

## Key points
- Use a hybrid query with a search pipeline that normalises and combines scores with weights (or fuse ranks with RRF in the application).
- Filters apply to both parts.
- Verify feature support for your OpenSearch version and Serverless.

## CWD context
Hybrid is the default mode because enterprise questions mix codes and natural language.
