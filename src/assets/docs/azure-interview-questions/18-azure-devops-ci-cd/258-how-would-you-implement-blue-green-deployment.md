# How would you implement blue-green deployment?

## Short answer
Blue-green runs old and new side by side and switches traffic once the new one is proven.

## Key points
- Deploy green, run smoke and evaluation tests.
- Switch 100 percent through Container Apps revision weights, APIM or Front Door.
- Keep blue for instant rollback; ensure database compatibility.

## CWD context
For prompts and models, switch through a configuration flag.
