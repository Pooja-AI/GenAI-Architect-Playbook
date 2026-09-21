# How would you decide whether a model belongs in Bedrock or SageMaker?

## Short answer
Decide by task type, data, cost and control needs, and confirm with a comparison.

## Key points
- General language or generative task an existing model handles well → Bedrock.
- Narrow prediction with labelled data, strict latency or cost, model ownership, or a model not on Bedrock → SageMaker.
- Compare cost at expected volume and evaluate both on the golden dataset.

## CWD context
Revisit the decision when volume or model options change.
