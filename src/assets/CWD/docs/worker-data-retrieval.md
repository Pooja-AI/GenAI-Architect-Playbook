# Worker Agent: Governed Enterprise Information Retrieval

In CWD, a Worker retrieves enterprise information only for the task assigned by the Delegator. It selects an approved retrieval method, enforces user and agent entitlements, applies data-access policies, validates the returned information, and sends a structured result back to the Delegator.

> The Worker does not simply "search the enterprise." It performs an authorized information-retrieval operation within a defined business scope.

### Core formula

```text
Worker Information Retrieval
=
Understand Task
+ Identify Data Requirement
+ Check Entitlements
+ Select Authorized Source
+ Apply Retrieval Controls
+ Retrieve Data
+ Validate Results
+ Preserve Provenance
+ Return Structured Result
```

## 1. Where Information Retrieval Fits in CWD

The Worker is the execution layer between the Delegator and enterprise knowledge or data sources.

```text
User Request
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
Retrieval Policy + Entitlement Checks
    ↓
Approved Retrieval Method
    ├── RAG / Azure AI Search
    ├── Database Adapter
    ├── Enterprise API
    ├── MCP Tool
    └── Other Governed Data Source
    ↓
Enterprise Information
    ↓
Worker Validation and Normalization
    ↓
Structured Result
    ↓
Delegator
```

The retrieval method depends on the type of information required.

| Information requirement | Preferred retrieval method |
| --- | --- |
| Search across enterprise documents | RAG and enterprise search |
| Retrieve structured business records | Database adapter |
| Access operational application data | Enterprise API |
| Invoke a governed enterprise capability | MCP tool |
| Retrieve short-lived operational information | Authorized service or API |
| Combine multiple sources | Multiple controlled retrieval operations |

## 2. Understand the Data Requirement

Before retrieving information, the Worker identifies what data is actually needed.

For example:

> "Retrieve the customer's latest revenue and open opportunities."

The Delegator may decompose this into:

```text
Revenue Worker
    └── Retrieve latest customer revenue

Opportunity Worker
    └── Retrieve open customer opportunities
```

The Revenue Worker should not retrieve customer emails, contracts, or unrelated financial records simply because they might be useful.

### Data requirement includes

* Business entity
* Required attributes
* Time period
* Required source
* Data freshness
* Access scope
* Expected result format
* Whether the task requires exact records or semantic search

## 3. Respect User Entitlements

User entitlement enforcement is a central responsibility of governed retrieval.

The Worker must determine whether the requesting user is permitted to access the requested information.

Entitlements may depend on:

* User identity
* Group membership
* Role
* Business unit
* Geographic scope
* Data classification
* Record ownership
* Project or application access
* Row-level permissions
* Document-level permissions
* Column-level restrictions

### Example

```text
User requests:
    Customer revenue for CUST-1001

Worker checks:
    Is the user authorized for this customer?
    Is revenue data permitted?
    Is the requested period allowed?
    Is the Worker authorized to retrieve it?

Decision:
    ALLOW / DENY / REDACT / REQUIRE_APPROVAL
```

The Worker must not assume that because a user can access the application, the user can access every underlying data source.

## 4. Select the Appropriate Retrieval Method

The Worker chooses the retrieval method based on the task and the nature of the data.

### Decision flow

```text
What information is required?
        ↓
Unstructured documents?
    └── RAG / Enterprise Search

Structured records?
    └── Database Adapter

Application-owned data?
    └── Enterprise API

Governed enterprise capability?
    └── MCP Tool

Multiple sources?
    └── Multiple authorized retrieval operations
```

### Example

| Task | Worker retrieval approach |
| --- | --- |
| "Find the latest procurement policy" | RAG over approved documents |
| "Get customer revenue for Q4" | Snowflake adapter |
| "Get open Salesforce opportunities" | Salesforce API |
| "Check inventory availability" | Inventory MCP tool |
| "Summarize approved engineering documents" | RAG retrieval followed by controlled summarization |

The Worker should not use RAG when an exact transactional record is required, and it should not use a database query when the answer depends on unstructured document meaning.

## 5. Retrieval Through RAG

RAG is used when the Worker needs information from unstructured or semi-structured enterprise knowledge.

### RAG flow

```text
Worker receives task
    ↓
Validate user and data permissions
    ↓
Create authorized search query
    ↓
Apply metadata and security filters
    ↓
Search Azure AI Search or approved vector store
    ↓
Retrieve relevant document chunks
    ↓
Validate document access
    ↓
Return grounded context
```

### Example

> "What is the approved process for handling a supplier quality issue?"

The Worker may retrieve:

* Supplier quality procedures
* Approved work instructions
* Relevant policy documents
* Version and effective-date information

The Worker should preserve:

* Document ID
* Source title
* Section or page reference, when available
* Document version
* Effective date
* Retrieval timestamp

### Important principle

> RAG retrieval must be security-trimmed.

A document should not appear in search results merely because its embedding is similar to the user's question. The user must also be authorized to access that document.

## 6. Apply Security Trimming in RAG

Security trimming ensures that search results contain only documents the user is allowed to see.

### Example

```text
User asks:
    "Show all documents related to Project X"

Search query
    ↓
Semantic / vector retrieval
    ↓
Apply document ACL filters
    ↓
Remove unauthorized documents
    ↓
Return permitted chunks only
```

Security metadata may include:

* Allowed users
* Allowed groups
* Business unit
* Project membership
* Document classification
* Confidentiality level
* Source-system permissions

### Incorrect approach

```text
Retrieve all matching documents
    ↓
Ask LLM to hide restricted information
```

This is unsafe because unauthorized content has already entered the retrieval and reasoning pipeline.

### Correct approach

```text
Apply authorization before retrieval
    ↓
Retrieve only permitted content
    ↓
Apply additional output controls
```

## 7. Retrieval from Databases

Workers use approved database adapters when exact, structured information is required.

Typical sources include:

* Snowflake
* Oracle
* SQL Server
* PostgreSQL
* Other governed enterprise databases

### Database retrieval flow

```text
Worker
    ↓
Validate parameters
    ↓
Check data-access permissions
    ↓
Select approved database adapter
    ↓
Execute parameterized query
    ↓
Apply row and column restrictions
    ↓
Validate returned records
    ↓
Normalize result
```

### Example

```text
Revenue Worker
    ↓
Customer ID = CUST-1001
    ↓
Approved Snowflake adapter
    ↓
Parameterized revenue query
    ↓
Authorized quarterly revenue
```

### Database controls

* Parameterized queries
* Read-only access where appropriate
* Row-level security
* Column-level security
* Query timeouts
* Result-size limits
* Data masking
* Connection security
* Audit logging

The Worker should not allow an LLM to generate unrestricted SQL and execute it directly against production databases.

## 8. Retrieval from Enterprise APIs

APIs are appropriate when the data is owned and exposed by an enterprise application.

Examples include:

* Salesforce
* Oracle applications
* Microsoft 365
* Internal business services
* Enterprise operational systems

### API retrieval flow

```text
Worker
    ↓
Validate request
    ↓
Check entitlement
    ↓
Select approved API adapter
    ↓
Acquire authorized access token
    ↓
Call enterprise API
    ↓
Validate response
    ↓
Return structured data
```

### Example

```text
Opportunity Worker
    ↓
Salesforce adapter
    ↓
Retrieve open opportunities for authorized customer
    ↓
Normalize opportunity fields
    ↓
Return structured opportunity list
```

The adapter should handle authentication, pagination, rate limits, API versioning, and source-specific errors.

## 9. Retrieval Through MCP

MCP provides a standardized interface for invoking approved enterprise tools.

For example:

```text
Worker
    ↓
MCP Client
    ↓
Revenue MCP Server
    ↓
Approved Revenue Tool
    ↓
Snowflake
```

The Worker may discover a tool such as:

```text
retrieve_customer_revenue
```

But discovery does not automatically grant permission.

The Worker must still verify:

* Tool is approved
* Capability matches the task
* User is authorized
* Worker is authorized
* Input is valid
* Data access is permitted
* Execution policy allows the operation

### MCP principle

> MCP standardizes tool interaction; CWD policy controls whether the tool may be used.

## 10. Retrieval from Multiple Sources

Some tasks require information from more than one enterprise source.

### Example: Customer Briefing

```text
Customer Briefing Delegator
        │
        ├── Revenue Worker
        │     └── Snowflake
        │
        ├── Opportunity Worker
        │     └── Salesforce
        │
        ├── Profile Worker
        │     └── Customer API
        │
        └── Document Worker
              └── Azure AI Search / RAG
```

Each Worker retrieves only the information required for its assigned task.

The Delegator combines the results.

### Important distinction

```text
Worker:
    Retrieves and validates its own source data

Delegator:
    Aggregates results from multiple Workers

Coordinator:
    Coordinates cross-domain execution and final response
```

This prevents one Worker from becoming a central unrestricted data-access component.

## 11. Data Minimization

Workers should retrieve the minimum necessary information to complete the task.

### Example

If the task requires revenue growth, the Worker may need:

```text
Customer ID
Current revenue
Previous revenue
Currency
Period
```

It does not need:

```text
Customer home address
Personal phone number
Unrelated contracts
Internal employee notes
```

Data minimization reduces:

* Privacy risk
* Prompt exposure
* Logging risk
* Processing cost
* Unnecessary data movement
* Compliance risk

## 12. Validate Retrieved Information

Retrieved information must be validated before it is used.

### Validation checks

#### Source validation

* Did the approved source respond?
* Is the source identity correct?
* Is the data current enough?
* Is the response complete?

#### Schema validation

* Are required fields present?
* Are data types correct?
* Does the result match the expected schema?

#### Business validation

* Does the data belong to the requested entity?
* Are dates and currencies consistent?
* Are duplicate records handled?
* Are values within expected ranges?

#### Security validation

* Is the result within the user's entitlement?
* Are restricted fields removed?
* Are unauthorized documents excluded?

### Example

```text
Retrieved revenue records
    ↓
Validate customer ID
    ↓
Validate quarter coverage
    ↓
Validate currency
    ↓
Validate numeric values
    ↓
Check authorization scope
    ↓
Return result
```

## 13. Preserve Provenance and Grounding

The Worker should preserve where the information came from.

For RAG, provenance may include:

* Document title
* Document ID
* Section or page
* Version
* Source URL or reference
* Retrieval timestamp

For databases and APIs:

* Source system
* Query or operation identifier
* Record identifiers
* Retrieval timestamp
* Data version, when available

### Example

```json
{
  "source_system": "Azure AI Search",
  "document_id": "supplier-quality-policy-2026",
  "document_version": "3.2",
  "section": "Incident Escalation",
  "retrieved_at": "2026-09-06T13:00:00Z"
}
```

Provenance allows the Delegator and Coordinator to explain how the result was obtained and helps users verify important information.

## 14. Handle Retrieval Failures

Workers must distinguish between retrieval failure and valid empty results.

| Situation | Meaning | Worker response |
| --- | --- | --- |
| No matching records | Valid empty result | Return `completed` with empty result |
| User lacks access | Authorization failure | Return `denied` |
| Source unavailable | Dependency failure | Retry or return failure |
| Search returns incomplete data | Partial result | Return partial status |
| Query timeout | Execution failure | Retry if safe |
| Invalid response | Data-quality failure | Reject result |
| Stale document | Freshness issue | Return freshness warning or use approved source |

### Example

```json
{
  "task_id": "task-204",
  "status": "partial",
  "result": {
    "customer_id": "CUST-1001",
    "revenue": 1510000
  },
  "warnings": [
    "Opportunity data source was unavailable"
  ],
  "correlation_id": "corr-789"
}
```

The Delegator can decide whether the workflow can continue with partial information.

## 15. Structured Retrieval Result

A Worker should return a structured result containing both the retrieved information and its execution context.

```json
{
  "task_id": "task-204",
  "worker_id": "revenue-worker",
  "status": "completed",
  "result": {
    "customer_id": "CUST-1001",
    "quarterly_revenue": [
      {
        "quarter": "Q4",
        "revenue": 1510000,
        "currency": "USD"
      }
    ]
  },
  "retrieval": {
    "source_type": "database",
    "source_system": "Snowflake",
    "adapter": "revenue-adapter"
  },
  "authorization": {
    "status": "allowed"
  },
  "validation": {
    "schema_valid": true,
    "business_rules_valid": true
  },
  "sources": [
    {
      "system": "Snowflake",
      "reference": "revenue_fact_table"
    }
  ],
  "correlation_id": "corr-789"
}
```

For RAG, the `sources` section should contain document references rather than exposing unnecessary document content.

## 16. End-to-End Example

### Business request

> "What is the approved process for handling a supplier quality issue?"

### Worker execution

```text
1. Delegator assigns task to Document Worker
        ↓
2. Worker identifies requirement:
       Retrieve approved supplier quality procedure
        ↓
3. Worker checks user entitlement
        ↓
4. Worker selects RAG retrieval capability
        ↓
5. Worker creates search query
        ↓
6. Worker applies document ACL filters
        ↓
7. Azure AI Search returns permitted document chunks
        ↓
8. Worker validates document version and relevance
        ↓
9. Worker preserves document references
        ↓
10. Worker returns structured evidence to Delegator
        ↓
11. Delegator uses the result in the domain response
```

The Worker does not retrieve every supplier document or provide unrestricted access to the knowledge base.

## 17. Worker Retrieval vs. Delegator Responsibilities

| Responsibility | Delegator | Worker |
| --- | --- | --- |
| Identify domain-level information need | Yes | No |
| Decompose retrieval into tasks | Yes | No |
| Select the appropriate Worker | Yes | No |
| Select retrieval method for assigned capability | Oversees | Yes |
| Check task-level authorization | Oversees | Yes |
| Retrieve data | No | Yes |
| Apply source-specific filters | Oversees | Yes |
| Validate retrieved information | Aggregates | Yes |
| Preserve provenance | Aggregates | Yes |
| Combine results from multiple Workers | Yes | No |
| Decide whether partial results are sufficient | Yes | No |
| Produce final cross-domain response | No | No |

## 18. What the Worker Must Not Do

The Worker must not:

* Retrieve data outside the assigned task.
* Assume user access to all enterprise systems.
* Bypass source-system permissions.
* Retrieve unauthorized documents and rely on the LLM to hide them.
* Use unrestricted database queries.
* Access arbitrary APIs.
* Expose sensitive data in prompts or logs.
* Ignore document ACLs or row-level security.
* Return unvalidated data.
* Treat an empty result as a system failure without checking.
* Invent information when the source does not contain it.
* Decide cross-domain routing or aggregate the entire enterprise workflow.

## Final Definition

> A Worker retrieves governed enterprise information by identifying the data required for its assigned task, selecting an authorized retrieval method such as RAG, search, databases, APIs, or MCP tools, enforcing user and agent entitlements, applying source-specific security controls, validating the retrieved information, preserving provenance, and returning a structured result to the Delegator.

### Core formula

```text
Governed Information Retrieval
=
Task Scope
+ Data Requirement
+ User Entitlement
+ Source Authorization
+ Retrieval Method
+ Security Filtering
+ Data Minimization
+ Validation
+ Provenance
+ Structured Result
+ Error Handling
```