## What is a Node?

A **node** is a basic building block of a linked list. It contains:

1. **Data** – the value stored in the node.
2. **Reference/Pointer** – the address/reference of another node.

### Singly linked-list node

```text
[ Data | Next ]
```

Example:

```text
[10 | •] → [20 | •] → [30 | None]
```

Here:

* `10`, `20`, `30` are the **data**
* `Next` points to the **next node**
* `None` means there is no next node

### Python example

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
```

Creating a node:

```python
node = Node(10)

print(node.data)   # 10
print(node.next)   # None
```

### Doubly linked-list node

A doubly linked-list node has **three parts**:

```text
[ Prev | Data | Next ]
```

Example:

```text
None ← [10] ⇄ [20] ⇄ [30] → None
```

### Interview answer

> **A node is an individual element of a linked list that stores data and one or more references to other nodes. In a singly linked list it contains data and a next reference; in a doubly linked list it contains data, previous, and next references.**
