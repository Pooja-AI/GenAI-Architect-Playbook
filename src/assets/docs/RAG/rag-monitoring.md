# RAG Monitoring

Monitoring a production RAG system means continuously tracking its health, quality, and performance after deployment — not just evaluating it before launch.

## What to Monitor
- **Latency** — end-to-end and per-stage (retrieval, reranking, generation) response times.
- **Retrieval quality signals** — average similarity scores, zero-result rate, distribution of retrieved chunk counts.
- **Generation quality signals** — faithfulness and relevance scores sampled from live traffic (often via automated LLM-as-judge checks on a sample of interactions).
- **Cost** — embedding, vector database, reranking, and LLM token spend over time.
- **Error rates** — failed retrievals, timeout rates, malformed queries.
- **User feedback signals** — thumbs up/down, follow-up question rate, session abandonment.

## Alerting
Set alerts for anomalies like sudden spikes in zero-result rate, latency degradation, or drops in sampled faithfulness scores — these often indicate upstream issues like a broken ingestion pipeline or embedding model change.

## Relationship to Evaluation
Monitoring extends evaluation into production: while golden-dataset evaluation (see `rag-evaluation.md`) tests the system against known cases, monitoring observes real-world behavior on live, unpredictable traffic.
