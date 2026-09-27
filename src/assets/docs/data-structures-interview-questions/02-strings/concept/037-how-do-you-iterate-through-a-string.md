### How do you iterate through a string in Python?

The most common way is using a **`for` loop**.

### 1. Using a `for` loop

```python
s = "Hello"

for char in s:
    print(char)
```

Output:

```text
H
e
l
l
o
```

Each iteration gives you **one character**.

---

### 2. Using index

You can also iterate using the string's indexes:

```python
s = "Hello"

for i in range(len(s)):
    print(s[i])
```

Output:

```text
H
e
l
l
o
```

This approach is useful when you need the **index and character**.

---

### 3. Using `enumerate()`

A cleaner way to get both:

```python
s = "Hello"

for i, char in enumerate(s):
    print(i, char)
```

Output:

```text
0 H
1 e
2 l
3 l
4 o
```

### Time Complexity

If the string has `n` characters:

> **Time: O(n)** — each character is visited once.
> **Space: O(1)** — excluding any output or newly created data.

### Interview answer

> **A string can be iterated character by character using a `for` loop. If both the index and character are needed, `enumerate()` can be used.**
