### Array vs Linked List

| Feature                   | Array             | Linked List                         |
| ------------------------- | ----------------- | ----------------------------------- |
| **Memory**                | Contiguous memory | Nodes can be scattered              |
| **Access by index**       | **O(1)**          | **O(n)**                            |
| **Search**                | O(n)              | O(n)                                |
| **Insert at beginning**   | O(n)              | **O(1)**                            |
| **Insert at end**         | O(1) amortized*   | O(n), or O(1) with tail             |
| **Delete from beginning** | O(n)              | **O(1)**                            |
| **Delete from middle**    | O(n)              | **O(1)** if node/reference is known |
| **Extra memory**          | Low               | Higher — stores pointers            |
| **Cache performance**     | Usually better    | Usually worse                       |
| **Random access**         | Yes               | No                                  |
| **Implementation**        | Simpler           | More complex                        |

*For a dynamic array such as Python's `list`.

### Simple example

**Array:**

```text
[10][20][30][40]
 ↑
index 0
```

You can directly access:

```python
arr[2]   # 30
```

This is **O(1)**.

**Linked list:**

```text
10 → 20 → 30 → 40 → None
```

To reach `30`, you generally have to traverse:

```text
10 → 20 → 30
```

So accessing the third element is **O(n)**.

### Interview answer

> **The main difference is that arrays provide fast O(1) random access because elements are stored contiguously, while linked lists provide efficient insertion and deletion when the relevant node/reference is known, but accessing an element requires O(n) traversal. Arrays generally have better cache performance, while linked lists require extra memory for pointers.**

### Important interview point

Don't simply say **"linked lists are better for insertion and deletion."**

The precise answer is:

> **Linked-list insertion/deletion is O(1) when you already have the required node or predecessor reference. Finding the position itself can take O(n).**
