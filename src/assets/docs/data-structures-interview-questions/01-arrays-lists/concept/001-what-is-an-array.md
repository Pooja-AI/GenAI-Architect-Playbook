An **array** is a data structure used to **store multiple values in a single variable**, usually in an ordered sequence.

### Simple example

```python
numbers = [10, 20, 30, 40, 50]
```

Here:

* `numbers` → array/list
* `10, 20, 30, 40, 50` → elements
* Each element has an **index**
* Index usually starts from **0**

```text
Value:    10    20    30    40    50
Index:     0     1     2     3     4
```

So:

```python
numbers[0]   # 10
numbers[2]   # 30
numbers[4]   # 50
```

### Why do we use arrays?

Instead of creating separate variables:

```python
num1 = 10
num2 = 20
num3 = 30
num4 = 40
```

we can use:

```python
numbers = [10, 20, 30, 40]
```

This makes it much easier to **store, access, search, and process collections of data**.

### Common array operations

| Operation | Example          | Purpose               |
| --------- | ---------------- | --------------------- |
| Access    | `arr[2]`         | Get an element        |
| Update    | `arr[2] = 100`   | Change an element     |
| Traverse  | `for x in arr`   | Visit every element   |
| Search    | `x in arr`       | Check if value exists |
| Insert    | `arr.append(60)` | Add an element        |
| Delete    | `arr.remove(30)` | Remove an element     |
| Length    | `len(arr)`       | Number of elements    |

### Interview definition

> **An array is a linear data structure that stores elements in an ordered sequence and allows elements to be accessed using an index.**

One important distinction for interviews: **Python's `list` is not exactly the same as a traditional fixed-size array in languages like C/Java**. Python lists are dynamic arrays.
