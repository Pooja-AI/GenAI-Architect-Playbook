# Handling Conflicting Documents in RAG

Real-world knowledge bases often contain **contradictory information** — outdated policy versions, conflicting team guidance, or simply differing opinions across documents — which can confuse retrieval and generation.

## Why This Happens
- Multiple versions of a document exist without clear versioning (e.g., an old and new policy PDF both indexed).
- Different departments provide slightly different guidance on the same topic.
- Time-sensitive information changes, but old documents remain in the index.

## Mitigation Strategies
- **Metadata-based recency filtering** — tag documents with dates and prefer or exclude based on freshness at query time.
- **Deduplication and version control** — actively remove or flag outdated document versions from the index during ingestion.
- **Explicit conflict acknowledgment** — instruct the model to note when retrieved sources disagree, rather than picking one arbitrarily or blending them into a false consensus.
- **Source authority weighting** — rank or prefer documents from authoritative sources (e.g., official policy over a meeting notes doc) when conflicts arise.
- **Surface both perspectives** — for genuinely ambiguous or evolving topics, let the answer present the conflicting views with their sources rather than forcing a single answer.

## Key Principle
Silently picking one of several conflicting sources without flagging the disagreement can produce confidently wrong answers — transparency about conflicts is usually safer than false certainty.
