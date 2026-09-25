## How would you secure SageMaker endpoints?

I would secure them at **network, identity, and application levels**.

```text id="j2p8k4"
CWD Worker
    ↓
IAM Role
    ↓
Private VPC
    ↓
SageMaker Endpoint
    ↓
Custom Model
```

### Key controls

1. **Private networking**

   * Deploy SageMaker endpoint inside a **VPC**.
   * Avoid public exposure where possible.

2. **IAM**

   * Give the CWD Worker an IAM role with **least-privilege `sagemaker:InvokeEndpoint`** permission.
   * No hardcoded AWS credentials.

3. **Encryption**

   * Encrypt model artifacts in S3 using **KMS**.
   * Encrypt data in transit using TLS.

4. **Access control**

   * Allow only authorized CWD services to invoke the endpoint.
   * Use VPC endpoint/private connectivity where applicable.

5. **Monitoring & auditing**

   * Use **CloudTrail** for API activity.
   * Use **CloudWatch** for endpoint metrics and logs.
   * Avoid logging sensitive customer data.

### Interview answer

> “I would secure SageMaker endpoints using private VPC networking, IAM least-privilege roles, KMS encryption, TLS, and restricted endpoint access. The CWD Worker would use its IAM task role to invoke only the required SageMaker endpoint. I would also use CloudTrail and CloudWatch for auditing and monitoring.”

**Memory:**
**Private → IAM → Encrypt → Restrict → Monitor**
