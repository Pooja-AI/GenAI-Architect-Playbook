### Time complexity of string concatenation

For two strings:

```python
s1 = "Hello"
s2 = "World"

result = s1 + s2
```

The time complexity is:

> **O(n + m)**

where:

* `n` = length of `s1`
* `m` = length of `s2`

### Why?

Python strings are **immutable**. When you concatenate two strings, Python creates a **new string** and copies the characters from both strings into it.

For example:

```text
"Hello" + "World"

HelloWorld
← 5 → ← 5 →
```

So 5 + 5 = 10 characters must be processed → **O(n + m)**.

### Interview answer

> **String concatenation takes O(n + m) time for strings of lengths n and m because a new string must be created and the characters from both strings are copied into it.**
