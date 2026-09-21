# How would you model Worker dependencies using Step Functions?

## Short answer
Model dependencies as sequential Task states, Choice branches and Parallel or Map fan-out.

## Key points
- Independent Workers in Parallel branches; dynamic lists with Map.
- Data passes through state input and output; large results go to S3 or DynamoDB because of payload limits.

## CWD context
The state machine expresses the dependency graph, not the Worker logic.
