# Why Use RAG?

## The Problem
LLMs are trained on a fixed snapshot of data. They don't know about your private documents, recent events after their training cutoff, or internal company knowledge — and they can confidently make things up (hallucinate) when they don't know an answer.

## What RAG Solves
- **Freshness** — Retrieve up-to-date information without retraining the model.
- **Grounding** — Answers are based on real, citable source documents, reducing hallucination.
- **Private data access** — Query internal knowledge bases, wikis, and documents the model was never trained on.
- **Cost efficiency** — Cheaper than fine-tuning a model every time knowledge changes.
- **Traceability** — Retrieved sources can be shown to users, enabling verification and trust.

## When to Use It
RAG is ideal for Q&A over documentation, customer support knowledge bases, enterprise search, and any application where answers need to reference specific, current, or proprietary content.
