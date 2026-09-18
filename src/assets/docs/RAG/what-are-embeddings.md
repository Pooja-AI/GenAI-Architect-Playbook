# What Are Embeddings?

Embeddings are numerical vector representations of text (or other data) that capture semantic meaning. Texts with similar meaning are mapped to vectors that are close together in vector space, even if they use different words.

## Example
"How do I reset my password?" and "Steps to change my login credentials" would produce similar embedding vectors, despite sharing almost no words in common.

## How They're Made
An embedding model (a neural network trained on large text corpora) converts a piece of text into a fixed-length vector, typically ranging from 256 to 3072+ dimensions depending on the model.

## Why They Matter for RAG
Embeddings enable **semantic search**: instead of matching exact keywords, a RAG system compares the embedding of a user's query to the embeddings of document chunks, finding the most conceptually relevant matches using similarity metrics like cosine similarity.
