## How would you decide: Bedrock or SageMaker?

I look at the **model requirement and level of control**.

```text
              Model Requirement
                     ↓
        ┌────────────┴────────────┐
   Foundation LLM            Custom ML Model
        ↓                          ↓
     Bedrock                  SageMaker
```

### Choose **Bedrock** when:

* Need a **foundation model/LLM**
* Generation, summarization, RAG, chat
* Want managed inference
* Don't want to manage model infrastructure

### Choose **SageMaker** when:

* Need a **custom/specialized ML model**
* Need custom training or deeper control
* Need custom ML algorithms/frameworks
* Need a dedicated model endpoint and ML lifecycle management

### Interview answer

> “I decide based on the model and the level of control required. If I need a managed foundation model for GenAI tasks, I use Bedrock. If I need to train, customize, or deploy a specialized ML model with more control over the lifecycle and infrastructure, I use SageMaker.”

**Memory:**
**Bedrock → Use Foundation Models**
**SageMaker → Build/Train/Control Custom Models**
