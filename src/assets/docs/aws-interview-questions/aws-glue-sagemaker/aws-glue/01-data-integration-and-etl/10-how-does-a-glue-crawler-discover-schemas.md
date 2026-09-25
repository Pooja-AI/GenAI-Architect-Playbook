## How does a Glue Crawler discover schemas?

The crawler **samples/reads the source data**, analyzes its structure, and infers the schema.

```text
S3 / Salesforce / Database
          ↓
    Glue Crawler
          ↓
 Read / Sample Data
          ↓
 Infer Schema
          ↓
 Glue Data Catalog
```

### Example

Suppose S3 contains:

```text
customer_id,name,region
101,ABC Corp,US
102,XYZ Inc,India
```

The crawler can infer:

```text
customer_id → integer
name        → string
region      → string
```

Then it creates/updates the table in **Glue Data Catalog**.

### What does it look at?

* Column names
* Data types
* File formats
* Partitions
* Data locations
* Table structure

### Interview answer

> “A Glue Crawler connects to the configured data source, samples or reads the data, infers its structure such as columns, data types and partitions, and then creates or updates the corresponding metadata in the Glue Data Catalog.”

**Memory:**
**Read → Infer → Catalog**
