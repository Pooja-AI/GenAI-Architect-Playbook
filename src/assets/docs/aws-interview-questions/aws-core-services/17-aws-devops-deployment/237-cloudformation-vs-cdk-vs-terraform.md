## CloudFormation vs CDK vs Terraform

The simplest way to remember:

| Tool               | What it is                                                                 | Best fit                                 |
| ------------------ | -------------------------------------------------------------------------- | ---------------------------------------- |
| **CloudFormation** | AWS-native IaC using YAML/JSON                                             | AWS-only environments                    |
| **CDK**            | Write infrastructure using programming languages; generates CloudFormation | Developers who prefer code               |
| **Terraform**      | Multi-cloud IaC using HCL                                                  | Multi-cloud / cloud-neutral environments |

### 1. CloudFormation

```text
YAML/JSON
   ↓
CloudFormation
   ↓
AWS Resources
```

**Pros:** AWS-native, strong AWS integration, no separate state-management model like Terraform.
**Cons:** More verbose; AWS-focused.

### 2. CDK

```text
Python / TypeScript
        ↓
       CDK
        ↓
CloudFormation
        ↓
      AWS
```

You can define reusable constructs using programming languages.

**Pros:** Less verbose, reusable components, familiar programming constructs.
**Cons:** Still fundamentally AWS/CloudFormation-oriented.

### 3. Terraform

```text
HCL
 ↓
Terraform
 ↓
AWS / Azure / GCP
```

**Pros:** Multi-cloud, reusable modules, mature ecosystem.
**Cons:** Requires managing Terraform state and introduces another tool layer.

### For CWD

Since our CWD architecture is primarily **AWS**, I could use **CDK or CloudFormation**.

If the organization wants **cloud portability across AWS + Azure + GCP**, I would consider **Terraform**.

### Interview answer

> “CloudFormation is AWS-native and works well when the organization is fully invested in AWS. CDK gives developers a programming-language approach while synthesizing to CloudFormation. Terraform is more cloud-neutral and is useful when managing AWS, Azure and GCP together. For an AWS-only CWD deployment, I would consider CDK or CloudFormation; for a multi-cloud strategy, I would consider Terraform.”

**Memory:**
**CloudFormation = AWS templates**
**CDK = Code → CloudFormation**
**Terraform = Multi-cloud IaC**
