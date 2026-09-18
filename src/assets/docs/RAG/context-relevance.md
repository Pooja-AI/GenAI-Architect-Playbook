# Context Relevance

Context relevance measures how relevant the retrieved chunks are to the user's original query — evaluating the retrieval step independently from the final generated answer.

## Why Evaluate It Separately
Generation quality can look fine even when retrieval was poor, if the LLM's parametric knowledge happens to "cover" for weak retrieval. Measuring context relevance isolates retrieval performance so problems can be diagnosed and fixed at the right stage.

## How It's Measured
- **LLM-as-judge** — ask an LLM to rate each retrieved chunk's relevance to the query on a scale (e.g., relevant/partially relevant/irrelevant), then aggregate into a score like precision@k.
- **Signal-to-noise ratio** — measure what fraction of the retrieved context is actually useful versus extraneous/off-topic.

## Low Context Relevance Usually Indicates
- Chunking strategy is producing fragments that don't align well with typical queries.
- Embedding model isn't well suited to the domain.
- Retrieval parameters (k, similarity threshold) need tuning.
- The knowledge base may simply be missing relevant content for that query.

Context relevance is a leading indicator: fixing it typically improves both faithfulness and answer relevance downstream.
