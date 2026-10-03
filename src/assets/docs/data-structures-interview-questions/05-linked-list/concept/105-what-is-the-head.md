## What is the Head?

The **head** is a reference/pointer to the **first node** of a linked list.

Example:

```text
head
 ↓
[10 | •] → [20 | •] → [30 | None]
```

Here:

* `head` points to the first node (`10`)
* `10` points to `20`
* `20` points to `30`
* `30.next` is `None`

### Python example

```python
head = Node(10)

head.next = Node(20)
head.next.next = Node(30)
```

The structure is:

```text
head → 10 → 20 → 30 → None
```

### Important points

* **Head = first node/reference**
* If the list is empty: `head = None`
* Traversal normally starts from `head`
* Inserting at the beginning changes the `head`

### Interview answer

> **The head is the reference to the first node in a linked list. It is the starting point for traversing the list. If the linked list is empty, the head is `None`.**
