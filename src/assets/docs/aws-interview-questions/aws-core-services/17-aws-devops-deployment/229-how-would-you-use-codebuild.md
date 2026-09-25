## How would you use CodeBuild?

**CodeBuild performs the actual build and test work inside the CI/CD pipeline.**

```text
CodePipeline
     ↓
CodeBuild
     ├── Install dependencies
     ├── Unit tests
     ├── Integration tests
     ├── Security scan
     ├── LLM evaluation
     ├── Docker build
     └── Push image → ECR
```

### In CWD

1. **Install** → Python dependencies.
2. **Test** → unit and integration tests.
3. **Security** → dependency/container vulnerability scanning.
4. **LLM evaluation** → RAG relevance, groundedness, tool-call accuracy.
5. **Docker build** → create Coordinator/Delegator/Worker images.
6. **ECR push** → tag image with Git commit/version.
7. **Return result** → CodePipeline continues only if all gates pass.

### Interview answer

> “I use CodeBuild as the execution engine inside CodePipeline. It installs dependencies, runs unit and integration tests, performs security checks and LLM evaluations, builds the Docker image, and pushes the versioned image to ECR. If any quality gate fails, the pipeline stops and the image is not promoted.”

**Memory:**
**Install → Test → Scan → Evaluate → Build → ECR**
