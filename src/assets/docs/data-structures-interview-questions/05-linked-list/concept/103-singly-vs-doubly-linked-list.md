## Singly vs Doubly Linked List

The key difference is the **number of links/pointers stored in each node**.

### Singly Linked List

Each node has:

```text
[Data | Next]
```

Example:

```text
10 → 20 → 30 → 40 → None
```

* Each node points only to the **next** node.
* Can traverse only **forward**.
* Uses less memory.

### Doubly Linked List

Each node has:

```text
[Prev | Data | Next]
```

Example:

```text
None ← 10 ⇄ 20 ⇄ 30 ⇄ 40 → None
```

* Each node points to both **previous** and **next** nodes.
* Can traverse **forward and backward**.
* Uses more memory because of the extra `prev` pointer.

### Interview comparison

| Feature            | Singly                 | Doubly         |
| ------------------ | ---------------------- | -------------- |
| Pointers           | `next`                 | `prev`, `next` |
| Forward traversal  | ✅                      | ✅              |
| Backward traversal | ❌                      | ✅              |
| Memory             | Less                   | More           |
| Implementation     | Simpler                | More complex   |
| Delete known node  | May need previous node | Easier         |
| Reverse traversal  | Not direct             | Direct         |

### Interview answer

> **A singly linked list has one pointer, `next`, that connects each node to the next node, so traversal is only forward. A doubly linked list has both `prev` and `next` pointers, allowing traversal in both directions. Doubly linked lists use more memory but make certain insertions, deletions, and backward traversal easier.**

**Important:** Don't say *"doubly linked-list deletion is always O(1)."* It is **O(1) when the node/reference is already known**; finding the node can still take **O(n)**.
