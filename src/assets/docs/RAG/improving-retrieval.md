# Improving Retrieval Quality

Retrieval quality is the single biggest lever for RAG system performance. Here are the main techniques to improve it, roughly in order of typical impact.

## Chunking
- Experiment with chunk size and overlap.
- Use structure-aware or semantic chunking instead of naive fixed-size splitting.

## Better Embeddings
- Choose an embedding model well-suited to your domain and language(s).
- Consider fine-tuning or using contextual retrieval to enrich chunk representations.

## Hybrid Search
- Combine vector and keyword (BM25) search to catch both semantic matches and exact-term matches.

## Reranking
- Add a cross-encoder reranker to refine the top candidates before passing them to the LLM.

## Query Understanding
- Use query expansion, multi-query retrieval, or query rewriting to bridge vocabulary gaps between user questions and document text.

## Metadata Filtering
- Filter by date, document type, or category to narrow the search space and eliminate irrelevant matches.

## Evaluation
- Build a golden dataset of query/relevant-chunk pairs and continuously measure retrieval metrics (recall@k, precision@k, MRR) to guide improvements empirically rather than by guesswork.
