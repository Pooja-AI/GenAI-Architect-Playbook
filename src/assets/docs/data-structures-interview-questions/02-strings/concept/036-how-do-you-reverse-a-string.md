### How do you reverse a string in Python?

There are several ways.

#### 1. Using slicing — most common

```python
s = "Hello"
reversed_s = s[::-1]

print(reversed_s)
```

Output:

```text
olleH
```

**Time:** `O(n)`
**Space:** `O(n)`

---

#### 2. Using `reversed()`

```python
s = "Hello"
reversed_s = "".join(reversed(s))

print(reversed_s)
```

Output:

```text
olleH
```

---

#### 3. Using a loop

```python
s = "Hello"
result = ""

for char in s:
    result = char + result

print(result)
```

Output:

```text
olleH
```

### Interview answer

> **In Python, the simplest way to reverse a string is using slicing: `s[::-1]`. It takes O(n) time and O(n) space because a new string is created.**
