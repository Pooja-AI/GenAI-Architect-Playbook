## How would you deploy Lambda versions?

Use **immutable versions + aliases**.

```text
Code
 ↓
CodeBuild
 ↓
Deploy Lambda
 ↓
Publish Version
 ↓
prod alias
 ↓
Canary → Monitor → 100%
             ↓
          Rollback
```

### Example

Current production:

```text
prod → Lambda v10
```

Deploy new code:

```text
new code → Lambda v11
prod → v10
```

Test/canary:

```text
90% → v10
10% → v11
```

If healthy:

```text
prod → v11
```

If unhealthy:

```text
prod → v10
```

### Interview answer

> “I publish every Lambda deployment as a new immutable version and use an alias such as `prod` to control which version receives traffic. I can gradually shift traffic using canary deployment, monitor errors, duration and throttling, and roll back simply by moving the alias to the previous version.”

**Memory:** **Version → Alias → Canary → Monitor → Rollback**
