## How would you use CodePipeline?

**CodePipeline is the orchestrator of the CI/CD workflow.** It connects source, build, test, and deployment stages.

```text
GitHub
  ↓
CodePipeline
  ↓
CodeBuild
  ↓
Tests + Security + LLM Evaluation
  ↓
ECR
  ↓
ECS/Fargate
  ↓
CloudWatch
```

### CWD pipeline

1. **Source** → developer pushes code to GitHub.
2. **Build** → CodeBuild builds the Docker image.
3. **Test** → unit + integration + security tests.
4. **AI Quality Gate** → RAG/LLM evaluation.
5. **ECR** → push versioned container image.
6. **Deploy Dev/Staging** → ECS/Fargate.
7. **Approval** → manual approval if required.
8. **Production** → blue-green/canary deployment.
9. **Monitor** → CloudWatch/Langfuse.
10. **Rollback** → return to previous ECS task definition/image if quality or infrastructure metrics fail.

### Interview answer

> “I use CodePipeline as the CI/CD orchestrator. It takes code from GitHub, triggers CodeBuild for testing and Docker image creation, pushes the image to ECR, and deploys it to ECS/Fargate across Dev, Staging, and Production. For CWD, I also include LLM evaluation as a quality gate and use blue-green or canary deployment with monitoring and rollback.”

**Memory:**
**Source → Build → Test → ECR → Deploy → Monitor → Rollback**
