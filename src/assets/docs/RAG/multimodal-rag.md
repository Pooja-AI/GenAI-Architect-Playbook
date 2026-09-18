# Multimodal RAG

Multimodal RAG extends retrieval-augmented generation beyond plain text to include other content types — images, tables, charts, audio, and video — as both retrievable content and query input.

## Why It's Needed
Many real-world documents (PDFs, slide decks, technical manuals) contain critical information in images, diagrams, and tables that plain-text extraction loses or garbles.

## Approaches
- **Multimodal embeddings** — use models (e.g., CLIP-style) that embed images and text into a shared vector space, enabling text queries to retrieve relevant images and vice versa.
- **Image-to-text preprocessing** — generate textual descriptions/captions of images (via a vision-capable LLM) at ingestion time, then embed and index the descriptions alongside the original image reference.
- **Table-aware processing** — extract tables as structured data (not flattened text) and either embed them specially or convert to a text format (e.g., markdown tables) that preserves row/column relationships.
- **Multimodal generation** — pass retrieved images directly into a vision-capable LLM alongside text context, letting the model reason over both modalities when generating an answer.

## Challenges
- Multimodal embedding models are generally less mature and more limited than text-only embedding models.
- Chunking and retrieval strategies need to account for images/tables as distinct, non-splittable units.
- Higher storage and compute costs for image embeddings and vision-model inference.

Multimodal RAG is increasingly important as knowledge bases include technical diagrams, charts, screenshots, and scanned documents where the visual content itself carries meaning.
