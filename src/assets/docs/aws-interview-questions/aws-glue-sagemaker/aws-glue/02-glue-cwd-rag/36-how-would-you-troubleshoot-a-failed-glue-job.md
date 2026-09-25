## How would you troubleshoot a failed Glue job?

I would troubleshoot it **from the Glue job run → logs → root cause → fix → rerun**.

```text
Glue Job Failed
      ↓
Check Job Run / Error
      ↓
CloudWatch Logs
      ↓
Identify Root Cause
      ↓
Fix
      ↓
Rerun / Validate
```

### Main things I check

1. **Glue job status & error message**

   * Check failed stage and exact exception.

2. **CloudWatch logs**

   * Look for Python/Spark errors, connection failures, memory issues, timeouts.

3. **Source connectivity**

   * Salesforce/Oracle/S3 connection
   * IAM permissions
   * Network/VPC configuration

4. **Data/schema issues**

   * Missing columns
   * Data type mismatch
   * Schema changes
   * Corrupt records

5. **Performance issues**

   * Out-of-memory
   * Data skew
   * Too many small files
   * Insufficient Glue workers

6. **Downstream failure**

   * Check whether S3/OpenSearch write failed.

### Interview answer

> “First, I check the Glue job run and CloudWatch logs to identify the exact failed stage and exception. Then I check source connectivity, IAM permissions, schema or data-quality issues, and Spark performance such as memory or data skew. After fixing the root cause, I rerun the job and validate the output before triggering downstream processing.”

**Memory:**
**Run → Logs → Source → Schema → Spark → Fix → Rerun**
