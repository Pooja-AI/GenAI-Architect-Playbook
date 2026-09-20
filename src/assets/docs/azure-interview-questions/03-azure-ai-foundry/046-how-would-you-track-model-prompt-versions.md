# How would you track model/prompt versions?

## Short answer
Version everything that can change behaviour and stamp it on each request.

## Key points
- Model deployment and version, prompt version, agent configuration, dataset and evaluation run ID.
- Add them as custom dimensions on traces.
- Keep registries in Git or Cosmos DB with changelogs.

## CWD context
This lets you say exactly which combination produced a bad answer.
