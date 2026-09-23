### Interview answer

> **I would make CWD cloud-neutral by separating the core agent architecture from cloud-specific infrastructure.** The Coordinator, Delegators, Workers, MCP, A2A, workflow contracts, and business logic should remain portable, while AWS, Azure, or GCP services are implemented behind standard interfaces.
>
> **First, I would keep the agent layer cloud-agnostic.** LangGraph, MCP, A2A, Python/FastAPI, Pydantic contracts, and business logic should not directly depend on Azure or AWS SDKs.
>
> **Second, I would create an abstraction layer for infrastructure services.** For example, the application should call `ObjectStore`, `VectorStore`, `SecretProvider`, `Queue`, `WorkflowStore`, and `LLMProvider` interfaces rather than directly calling S3, Azure Blob, DynamoDB, or Cosmos DB.
>
> **Third, I would isolate LLM providers.** Instead of embedding Azure OpenAI-specific code throughout Workers, I would define a common model interface so the implementation can switch between Azure OpenAI, Amazon Bedrock, Google Vertex AI, or another provider.
>
> **Fourth, I would standardize deployment using containers and Kubernetes.** Docker + Kubernetes/Helm gives us a common deployment model across AKS, EKS, and GKE.
>
> **Finally, I would use infrastructure-as-code with modules.** Terraform can define the common architecture while cloud-specific modules map the abstractions to each provider.

### Cloud-neutral CWD

```text
                    CWD APPLICATION
                         |
       +-----------------+-----------------+
       |                 |                 |
 Coordinator         Delegators         Workers
       |                 |                 |
       +-----------------+-----------------+
                         |
              Cloud-Neutral Interfaces
                         |
       +---------+-------+-------+---------+
       |         |       |       |         |
      LLM      Vector   Queue   Storage   Secrets
    Provider   Store           Store      Provider
       |         |       |       |         |
       +---------+-------+-------+---------+
                         |
              Cloud Adapter Layer
              /        |        \
             /         |         \
          AWS        Azure       GCP
```

### Example

Instead of doing this inside a Worker:

```python
from azure.storage.blob import BlobServiceClient

client = BlobServiceClient(...)
```

I would use:

```python
class ObjectStore:
    def get(self, key: str):
        raise NotImplementedError
```

Then provide implementations:

```text
ObjectStore
   ├── S3ObjectStore
   ├── AzureBlobObjectStore
   └── GCSObjectStore
```

The Worker only knows:

```python
store.get("customer/123/profile")
```

It doesn't care whether the data comes from **S3, Azure Blob, or GCS**.

### CWD service mapping

| Capability     | AWS              | Azure                      | GCP                     |
| -------------- | ---------------- | -------------------------- | ----------------------- |
| LLM            | Bedrock          | Azure OpenAI               | Vertex AI               |
| Object storage | S3               | Blob Storage               | Cloud Storage           |
| Queue          | SQS              | Service Bus                | Pub/Sub                 |
| NoSQL/state    | DynamoDB         | Cosmos DB                  | Firestore               |
| Vector search  | OpenSearch/other | Azure AI Search            | Vertex AI Vector Search |
| Secrets        | Secrets Manager  | Key Vault                  | Secret Manager          |
| Container      | EKS/ECS          | AKS/Container Apps         | GKE/Cloud Run           |
| API gateway    | API Gateway      | APIM                       | API Gateway             |
| Monitoring     | CloudWatch       | Azure Monitor/App Insights | Cloud Monitoring        |
| Identity       | IAM              | Entra ID                   | IAM                     |

The **business logic does not change**; only the adapter implementations change.

### What I would *not* abstract

I wouldn't create an abstraction for everything.

For example:

```text
Coordinator
Delegator
Worker
MCP
A2A
LangGraph
Business rules
       ↓
Cloud-neutral
```

But:

```text
Storage
Queue
Secrets
LLM
Vector DB
Identity
Observability
       ↓
Provider adapters
```

This avoids creating a huge abstraction framework that itself becomes difficult to maintain.

### Strong closing answer

> **“My goal wouldn't be 100% cloud independence at every layer. I would make the business and agent layers cloud-neutral and isolate unavoidable cloud-specific capabilities behind well-defined adapters. That gives us portability without sacrificing the native capabilities of AWS, Azure, or GCP.”**

**Key phrase to remember:** **“Portable core, provider-specific adapters.”**
