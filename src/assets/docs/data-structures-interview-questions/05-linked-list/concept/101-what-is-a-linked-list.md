A **linked list** is a linear data structure where elements are stored in **nodes**, and each node contains:

1. **Data** – the actual value.
2. **Pointer/reference** – points to the next node.

Example:

```text
10 → 20 → 30 → 40 → None
```

Each node looks conceptually like:

```text
[Data | Next]
```

### Example in Python

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
```

Creating a linked list:

```python
first = Node(10)
second = Node(20)
third = Node(30)

first.next = second
second.next = third
```

Result:

```text
first
  ↓
[10 | •] → [20 | •] → [30 | None]
```

### Key difference from an array/list

| Feature                    | Array/List         | Linked List            |
| -------------------------- | ------------------ | ---------------------- |
| Memory                     | Usually contiguous | Nodes can be anywhere  |
| Access by index            | **O(1)**           | **O(n)**               |
| Insert at beginning        | O(n) / depends     | **O(1)**               |
| Delete with node reference | O(n) / depends     | **O(1)**               |
| Extra memory               | Low                | Higher due to pointers |

### Interview answer

> **A linked list is a linear data structure made up of nodes, where each node stores data and a reference to the next node. Unlike arrays, linked-list nodes don't need contiguous memory, making insertion and deletion efficient when the node position/reference is known, but random access is O(n).**

**Next interview question:** *What is the difference between a singly linked list and a doubly linked list?*
