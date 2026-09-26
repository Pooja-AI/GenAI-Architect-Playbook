The main difference is **whether the size can change after the array is created**.

## Static vs Dynamic Arrays

| Feature               | Static Array        | Dynamic Array                       |
| --------------------- | ------------------- | ----------------------------------- |
| **Size**              | Fixed               | Can grow/shrink                     |
| **Resizing**          | Not automatic       | Automatic                           |
| **Memory**            | Allocated once      | May allocate new memory when needed |
| **Insertion at end**  | Limited by capacity | Usually **O(1) amortized**          |
| **Memory efficiency** | Predictable         | May have extra unused capacity      |
| **Flexibility**       | Less flexible       | More flexible                       |
| **Example**           | C `int arr[5]`      | Python `list`                       |

### 1. Static array

When you create:

```c
int arr[5];
```

you have space for exactly **5 elements**.

```text
[10][20][30][40][50]
```

You cannot simply add a 6th element.

If you need more space, you generally need to create a new larger array.

---

### 2. Dynamic array

A dynamic array can grow when it runs out of capacity.

Python's list behaves this way:

```python
arr = [10, 20, 30]

arr.append(40)
arr.append(50)
arr.append(60)
```

The list automatically manages additional storage.

Conceptually:

```text
Initial capacity:
[10][20][30][ ][ ]

After adding:
[10][20][30][40][50]
```

When capacity is exhausted, the implementation allocates a larger memory area and copies/moves the references.

### Why does resizing matter?

Suppose:

```text
Capacity = 4
Size     = 4

[10][20][30][40]
```

You add `50`.

The array may need to:

```text
1. Allocate larger memory
2. Copy existing elements
3. Add 50
```

That particular resize can take **O(n)**.

But resizing happens only occasionally, so appending to a dynamic array is generally:

> **O(1) amortized**

### Interview answer

> **A static array has a fixed size determined when it is created, while a dynamic array can automatically resize as elements are added or removed. Dynamic arrays provide more flexibility but may occasionally require O(n) resizing.**

### Easy way to remember

**Static → fixed size**

**Dynamic → grows/shrinks automatically**

And importantly, **Python `list` is a dynamic array**, which is why `list.append()` is typically **O(1) amortized**.
