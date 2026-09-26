### Why Azure AI Search instead of Pinecone?

For CWD, the main reason was **enterprise integration and security**.

* **Azure AI Search** supports **hybrid search** — keyword/BM25 + vector + semantic ranking.
* Strong integration with the **Azure ecosystem** and enterprise data sources.
* Supports **metadata/ACL filtering**, which is important for authorization-aware RAG.
* Easier integration with **Azure OpenAI, Entra ID, Azure networking and monitoring**.
* We could keep the RAG layer within our **Azure enterprise environment**.

**Pinecone** is also a strong vector database, but it would mainly solve the vector-search requirement rather than providing the same Azure-native enterprise search integration.

**Interview answer:**

> “We chose Azure AI Search because CWD was deployed primarily on Azure and we needed enterprise-grade hybrid search, semantic ranking, metadata and ACL filtering. It also integrated well with Azure OpenAI, Entra ID, networking and monitoring. Pinecone is a strong option for vector search, but Azure AI Search was a better fit for our Azure-native enterprise RAG architecture.”
