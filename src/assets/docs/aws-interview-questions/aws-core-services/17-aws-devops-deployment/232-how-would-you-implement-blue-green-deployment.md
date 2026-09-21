# How would you implement blue-green deployment?

## Short answer
Blue-green runs old and new side by side and switches traffic once the new one is proven.

## Key points
- ECS with CodeDeploy: green task set behind a test listener, run tests, then shift traffic all at once, in a canary or linearly.
- Keep blue for the rollback window; alarms trigger automatic rollback.
- Keep database changes backward compatible; use AppConfig flags for prompts and models.

## CWD context
Prove the green stack before any user reaches it.
