import CookbookApp from "../../components/CookbookApp";

export const ArraysBasicOps = [
{
    id: "arr-q1",
    category: "Arrays - Basic Operations",
    title: "Find the Largest Element",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Traverse a list once to find its maximum value without using max().",
    concept: `
Logic:
Start by assuming the first element is the largest, then walk through every other element once. Whenever a value is bigger than the current largest, replace it. After the single pass, whatever remains is the maximum.

Pseudocode:
largest = nums[0]
FOR each num in nums:
    IF num > largest:
        largest = num
RETURN largest
`,
    code: `
def find_largest(nums):
    largest = nums[0]
    for num in nums:
        if num > largest:
            largest = num
    return largest
`,
  },
  {
    id: "arr-q2",
    category: "Arrays - Basic Operations",
    title: "Find the Smallest Element",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Traverse a list once to find its minimum value without using min().",
    concept: `
Logic:
Mirror image of the largest-element scan: assume the first element is the minimum, then replace it any time a smaller value is seen.

Pseudocode:
smallest = nums[0]
FOR each num in nums:
    IF num < smallest:
        smallest = num
RETURN smallest
`,
    code: `
def find_smallest(nums):
    smallest = nums[0]
    for num in nums:
        if num < smallest:
            smallest = num
    return smallest
`,
  },
  {
    id: "arr-q3",
    category: "Arrays - Basic Operations",
    title: "Second Largest Element Without Sorting",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Track the top two values in a single pass to avoid an O(n log n) sort.",
    concept: `
Logic:
Keep two running trackers, first (largest so far) and second (second largest so far). If a new number beats first, the old first becomes second before first is updated. If a number is strictly between second and first, it only updates second.

Pseudocode:
first, second = -infinity, -infinity
FOR each num in nums:
    IF num > first:
        second = first
        first = num
    ELSE IF second < num < first:
        second = num
RETURN second
`,
    code: `
def second_largest(nums):
    first = second = float("-inf")
    for num in nums:
        if num > first:
            second = first
            first = num
        elif first > num > second:
            second = num
    return second
`,
  },
  {
    id: "arr-q4",
    category: "Arrays - Basic Operations",
    title: "Second Smallest Element",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Track the bottom two values in a single pass.",
    concept: `
Logic:
Same two-tracker idea as second-largest, but inverted: first holds the smallest seen so far and second holds the runner-up smallest.

Pseudocode:
first, second = +infinity, +infinity
FOR each num in nums:
    IF num < first:
        second = first
        first = num
    ELSE IF second > num > first:
        second = num
RETURN second
`,
    code: `
def second_smallest(nums):
    first = second = float("inf")
    for num in nums:
        if num < first:
            second = first
            first = num
        elif first < num < second:
            second = num
    return second
`,
  },
  {
    id: "arr-q5",
    category: "Arrays - Basic Operations",
    title: "Sum of All Elements",
    difficulty: "Beginner",
    time: "~5 min",
    description: "Accumulate a running total over the list.",
    concept: `
Logic:
Accumulate a running total by adding each element to an initial value of zero as you iterate through the list.

Pseudocode:
total = 0
FOR each num in nums:
    total += num
RETURN total
`,
    code: `
def sum_elements(nums):
    total = 0
    for num in nums:
        total += num
    return total
`,
  },
  {
    id: "arr-q6",
    category: "Arrays - Basic Operations",
    title: "Average of Elements",
    difficulty: "Beginner",
    time: "~5 min",
    description: "Divide the sum of elements by the count of elements.",
    concept: `
Logic:
The average is just the total sum divided by how many elements were summed, so reuse the sum and the count.

Pseudocode:
RETURN sum(nums) / length(nums)
`,
    code: `
def average(nums):
    return sum(nums) / len(nums)
`,
  },
  {
    id: "arr-q7",
    category: "Arrays - Basic Operations",
    title: "Count Even and Odd Elements",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Classify each element by parity and tally the counts.",
    concept: `
Logic:
Classify every element as even or odd using the remainder when divided by 2, and tally each category as you go.

Pseudocode:
even = 0
FOR each num in nums:
    IF num % 2 == 0:
        even += 1
odd = length(nums) - even
RETURN even, odd
`,
    code: `
def count_even_odd(nums):
    even = sum(1 for n in nums if n % 2 == 0)
    odd = len(nums) - even
    return even, odd
`,
  },
  {
    id: "arr-q8",
    category: "Arrays - Basic Operations",
    title: "Count Positive, Negative, and Zero Values",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Classify each element by sign and tally the counts.",
    concept: `
Logic:
Classify each element by its sign — greater than zero, less than zero, or exactly zero — and increment the matching counter.

Pseudocode:
pos = neg = zero = 0
FOR each num in nums:
    IF num > 0: pos += 1
    ELSE IF num < 0: neg += 1
    ELSE: zero += 1
RETURN pos, neg, zero
`,
    code: `
def count_pos_neg_zero(nums):
    pos = sum(1 for n in nums if n > 0)
    neg = sum(1 for n in nums if n < 0)
    zero = sum(1 for n in nums if n == 0)
    return pos, neg, zero
`,
  },
  {
    id: "arr-q9",
    category: "Arrays - Basic Operations",
    title: "Find the Length of a List Without len()",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Count elements manually by iterating through the list.",
    concept: `
Logic:
Without a built-in length function, count elements manually by incrementing a counter once per item visited.

Pseudocode:
count = 0
FOR each item in nums:
    count += 1
RETURN count
`,
    code: `
def list_length(nums):
    count = 0
    for _ in nums:
        count += 1
    return count
`,
  },
  {
    id: "arr-q10",
    category: "Arrays - Basic Operations",
    title: "Check Whether a Given Element Exists",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Perform a linear membership check across the list.",
    concept: `
Logic:
Walk the list comparing each element to the target; return true the moment a match is found, otherwise false after the full scan.

Pseudocode:
FOR each num in nums:
    IF num == target:
        RETURN True
RETURN False
`,
    code: `
def contains_element(nums, target):
    for num in nums:
        if num == target:
            return True
    return False
`,
  },
{
    id: "arr-q11",
    category: "Arrays - Reverse & Rearrange",
    title: "Reverse a List Without reverse() or Slicing",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Build a new list by walking the input from the back to the front.",
    concept: `
Logic:
Build a brand-new list by reading the original array from its last index down to its first, appending each value as you go.

Pseudocode:
result = []
FOR i FROM length(nums)-1 DOWNTO 0:
    result.append(nums[i])
RETURN result
`,
    code: `
def reverse_list(nums):
    result = []
    for i in range(len(nums) - 1, -1, -1):
        result.append(nums[i])
    return result
`,
  },
  {
    id: "arr-q12",
    category: "Arrays - Reverse & Rearrange",
    title: "Reverse a List In-Place",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Use two pointers swapping from both ends toward the middle.",
    concept: `
Logic:
Use two pointers, one starting at the front and one at the back. Swap the elements they point to, then move both pointers toward the center until they meet, reversing the array without extra storage.

Pseudocode:
left, right = 0, length(nums)-1
WHILE left < right:
    SWAP nums[left], nums[right]
    left += 1
    right -= 1
RETURN nums
`,
    code: `
def reverse_in_place(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
    return nums
`,
  },
  {
    id: "arr-q13",
    category: "Arrays - Reverse & Rearrange",
    title: "Move All Zeros to the End",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Use a write pointer to compact non-zero values, then fill the rest with zeros.",
    concept: `
Logic:
Use a 'write pointer' that only advances when a non-zero value is copied into place, compacting all non-zero elements to the front. Afterward, fill every remaining slot with zero.

Pseudocode:
insert = 0
FOR each num in nums:
    IF num != 0:
        nums[insert] = num
        insert += 1
FOR i FROM insert TO end:
    nums[i] = 0
RETURN nums
`,
    code: `
def move_zeros(nums):
    insert_pos = 0
    for num in nums:
        if num != 0:
            nums[insert_pos] = num
            insert_pos += 1
    for i in range(insert_pos, len(nums)):
        nums[i] = 0
    return nums
`,
  },
  {
    id: "arr-q14",
    category: "Arrays - Reverse & Rearrange",
    title: "Move All Negative Numbers to One Side",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Use a partition-style two-pointer scan similar to quicksort's partition step.",
    concept: `
Logic:
Apply the same partitioning idea used in quicksort's partition step: a left pointer marks the boundary of the negative region, and any negative number found is swapped into that boundary as the scan proceeds.

Pseudocode:
left = 0
FOR right FROM 0 TO end:
    IF nums[right] < 0:
        SWAP nums[left], nums[right]
        left += 1
RETURN nums
`,
    code: `
def move_negatives(nums):
    left = 0
    for right in range(len(nums)):
        if nums[right] < 0:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
    return nums
`,
  },
  {
    id: "arr-q15",
    category: "Arrays - Reverse & Rearrange",
    title: "Separate Even and Odd Numbers",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Split into two lists by parity, then concatenate evens before odds.",
    concept: `
Logic:
Filter the array twice — once keeping only even numbers, once keeping only odd numbers — then place the even list before the odd list.

Pseudocode:
evens = [n for n in nums if n % 2 == 0]
odds  = [n for n in nums if n % 2 != 0]
RETURN evens + odds
`,
    code: `
def separate_even_odd(nums):
    evens = [n for n in nums if n % 2 == 0]
    odds = [n for n in nums if n % 2 != 0]
    return evens + odds
`,
  },
  {
    id: "arr-q16",
    category: "Arrays - Reverse & Rearrange",
    title: "Rearrange Array So Positive/Negative Numbers Alternate",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Split by sign, then interleave the two lists, appending any leftovers.",
    concept: `
Logic:
Split the array into a list of non-negative numbers and a list of negative numbers, then weave them together one from each side until one list runs out, appending whatever is left over from the other.

Pseudocode:
pos = [n for n in nums if n >= 0]
neg = [n for n in nums if n < 0]
result = []
i = j = 0
WHILE i < len(pos) AND j < len(neg):
    result.append(pos[i]); result.append(neg[j])
    i += 1; j += 1
result += pos[i:]
result += neg[j:]
RETURN result
`,
    code: `
def rearrange_alternate(nums):
    pos = [n for n in nums if n >= 0]
    neg = [n for n in nums if n < 0]
    result = []
    i = j = 0
    while i < len(pos) and j < len(neg):
        result.append(pos[i])
        result.append(neg[j])
        i += 1
        j += 1
    result.extend(pos[i:])
    result.extend(neg[j:])
    return result
`,
  },
  {
    id: "arr-q17",
    category: "Arrays - Reverse & Rearrange",
    title: "Rotate an Array Left by One Position",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Shift every element one index left and wrap the first element to the end.",
    concept: `
Logic:
Save the first element off to the side, shift every other element one position to the left, then place the saved value at the very end.

Pseudocode:
first = nums[0]
FOR i FROM 0 TO length-2:
    nums[i] = nums[i+1]
nums[last] = first
RETURN nums
`,
    code: `
def rotate_left_one(nums):
    if not nums:
        return nums
    first = nums[0]
    for i in range(len(nums) - 1):
        nums[i] = nums[i + 1]
    nums[-1] = first
    return nums
`,
  },
  {
    id: "arr-q18",
    category: "Arrays - Reverse & Rearrange",
    title: "Rotate an Array Right by One Position",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Shift every element one index right and wrap the last element to the front.",
    concept: `
Logic:
Save the last element off to the side, shift every other element one position to the right, then place the saved value at the front.

Pseudocode:
last = nums[length-1]
FOR i FROM length-1 DOWNTO 1:
    nums[i] = nums[i-1]
nums[0] = last
RETURN nums
`,
    code: `
def rotate_right_one(nums):
    if not nums:
        return nums
    last = nums[-1]
    for i in range(len(nums) - 1, 0, -1):
        nums[i] = nums[i - 1]
    nums[0] = last
    return nums
`,
  },
  {
    id: "arr-q19",
    category: "Arrays - Reverse & Rearrange",
    title: "Rotate an Array Left/Right by K Positions",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Generalize single-step rotation using slicing and modulo arithmetic for K.",
    concept: `
Logic:
Generalize the single-step rotation: reduce K modulo the array length to avoid redundant full rotations, then slice the array into two parts and swap their order.

Pseudocode:
k = k % length(nums)
IF direction == left:
    RETURN nums[k:] + nums[:k]
ELSE:
    RETURN nums[-k:] + nums[:-k]
`,
    code: `
def rotate_array(nums, k, direction="left"):
    n = len(nums)
    k = k % n
    if direction == "left":
        return nums[k:] + nums[:k]
    return nums[-k:] + nums[:-k] if k else nums
`,
  },
{
    id: "arr-q20",
    category: "Arrays - Duplicates & Unique Elements",
    title: "Remove Duplicates From a List",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Use a set to collapse duplicate values (order not preserved).",
    concept: `
Logic:
A set only ever stores unique values, so converting the list into a set and back into a list collapses all duplicates automatically. Note the original order is not preserved.

Pseudocode:
RETURN list(set(nums))
`,
    code: `
def remove_duplicates(nums):
    return list(set(nums))
`,
  },
  {
    id: "arr-q21",
    category: "Arrays - Duplicates & Unique Elements",
    title: "Remove Duplicates Without Using set()",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Manually check membership in the result list before appending.",
    concept: `
Logic:
Without using a set, build the result manually: before appending a number, check whether it is already present in the result list (an O(n) membership check per element).

Pseudocode:
result = []
FOR each num in nums:
    IF num NOT IN result:
        result.append(num)
RETURN result
`,
    code: `
def remove_duplicates_no_set(nums):
    result = []
    for num in nums:
        if num not in result:
            result.append(num)
    return result
`,
  },
  {
    id: "arr-q22",
    category: "Arrays - Duplicates & Unique Elements",
    title: "Remove Duplicates While Preserving Order",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Use a seen-set alongside a result list to preserve first-occurrence order.",
    concept: `
Logic:
Combine a fast 'seen' set for O(1) membership checks with a separate result list, so duplicates are skipped while the first-occurrence order of the array is preserved.

Pseudocode:
seen = {}
result = []
FOR each num in nums:
    IF num NOT IN seen:
        seen.add(num)
        result.append(num)
RETURN result
`,
    code: `
def remove_duplicates_ordered(nums):
    seen = set()
    result = []
    for num in nums:
        if num not in seen:
            seen.add(num)
            result.append(num)
    return result
`,
  },
  {
    id: "arr-q23",
    category: "Arrays - Duplicates & Unique Elements",
    title: "Find All Duplicate Elements",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Track seen values in a set and collect any repeats into another set.",
    concept: `
Logic:
Track everything already seen in one set. Any value encountered that is already in that set gets added to a second, 'duplicates' set.

Pseudocode:
seen = {}
duplicates = {}
FOR each num in nums:
    IF num IN seen:
        duplicates.add(num)
    ELSE:
        seen.add(num)
RETURN list(duplicates)
`,
    code: `
def find_duplicates(nums):
    seen = set()
    duplicates = set()
    for num in nums:
        if num in seen:
            duplicates.add(num)
        else:
            seen.add(num)
    return list(duplicates)
`,
  },
  {
    id: "arr-q24",
    category: "Arrays - Duplicates & Unique Elements",
    title: "Find the First Duplicate",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Return as soon as a previously seen value reappears.",
    concept: `
Logic:
Scan once, remembering everything seen so far. The moment a number that's already in the seen set reappears, return it immediately without scanning further.

Pseudocode:
seen = {}
FOR each num in nums:
    IF num IN seen:
        RETURN num
    seen.add(num)
RETURN None
`,
    code: `
def first_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return num
        seen.add(num)
    return None
`,
  },
  {
    id: "arr-q25",
    category: "Arrays - Duplicates & Unique Elements",
    title: "Find the First Non-Repeating Element",
    difficulty: "Intermediate",
    time: "~20 min",
    description: "Count frequencies first, then scan again for the first count of 1.",
    concept: `
Logic:
First pass builds a frequency map counting how many times each value occurs. Second pass walks the array in original order and returns the first value whose count is exactly one.

Pseudocode:
counts = {}
FOR each num in nums:
    counts[num] += 1
FOR each num in nums:
    IF counts[num] == 1:
        RETURN num
RETURN None
`,
    code: `
def first_non_repeating(nums):
    counts = {}
    for num in nums:
        counts[num] = counts.get(num, 0) + 1
    for num in nums:
        if counts[num] == 1:
            return num
    return None
`,
  },
  {
    id: "arr-q26",
    category: "Arrays - Duplicates & Unique Elements",
    title: "Find Elements That Appear Only Once",
    difficulty: "Intermediate",
    time: "~20 min",
    description: "Build a frequency map and filter for values with a count of exactly one.",
    concept: `
Logic:
Build a frequency map of every value, then filter that map down to keys whose count is exactly one.

Pseudocode:
counts = {}
FOR each num in nums:
    counts[num] += 1
RETURN [num for num, c in counts if c == 1]
`,
    code: `
def elements_appear_once(nums):
    counts = {}
    for num in nums:
        counts[num] = counts.get(num, 0) + 1
    return [num for num, c in counts.items() if c == 1]
`,
  },
  {
    id: "arr-q27",
    category: "Arrays - Duplicates & Unique Elements",
    title: "Find the Element That Appears More Than N/2 Times",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Use the Boyer-Moore voting algorithm for O(n) time and O(1) space.",
    concept: `
Logic:
Boyer-Moore voting: keep a running candidate and a vote counter. A matching element increments the counter, a non-matching element decrements it; when the counter hits zero, adopt a new candidate. Because the majority element occurs more than n/2 times, it always survives as the final candidate.

Pseudocode:
count = 0
candidate = None
FOR each num in nums:
    IF count == 0:
        candidate = num
    count += (1 IF num == candidate ELSE -1)
RETURN candidate
`,
    code: `
def majority_element(nums):
    count = 0
    candidate = None
    for num in nums:
        if count == 0:
            candidate = num
        count += 1 if num == candidate else -1
    return candidate
`,
  },
{
    id: "arr-q28",
    category: "Arrays - Missing & Repeating Elements",
    title: "Find the Missing Number From 1...N",
    difficulty: "Intermediate",
    time: "~20 min",
    description: "Compare the expected arithmetic-series sum to the actual sum.",
    concept: `
Logic:
The sum of 1..N has a known closed-form formula (N*(N+1)/2). Subtracting the array's actual sum from that expected sum isolates the single missing number.

Pseudocode:
expected = n * (n + 1) / 2
RETURN expected - sum(nums)
`,
    code: `
def missing_number(nums, n):
    expected_sum = n * (n + 1) // 2
    return expected_sum - sum(nums)
`,
  },
  {
    id: "arr-q29",
    category: "Arrays - Missing & Repeating Elements",
    title: "Find the Missing Number Using XOR",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "XOR all numbers 1..N with all array elements; pairs cancel, leaving the missing value.",
    concept: `
Logic:
XOR is its own inverse: XOR-ing every number from 1..N together with every element of the array cancels out every value that appears in both, leaving only the missing number.

Pseudocode:
xor_all = 0
FOR i FROM 1 TO n:
    xor_all ^= i
FOR each num in nums:
    xor_all ^= num
RETURN xor_all
`,
    code: `
def missing_number_xor(nums, n):
    xor_all = 0
    for i in range(1, n + 1):
        xor_all ^= i
    for num in nums:
        xor_all ^= num
    return xor_all
`,
  },
  {
    id: "arr-q30",
    category: "Arrays - Missing & Repeating Elements",
    title: "Find a Number That Appears Twice (Others Appear Once)",
    difficulty: "Intermediate",
    time: "~20 min",
    description: "XOR every element together; single-occurrence values cancel out in pairs.",
    concept: `
Logic:
If every value except one appears exactly twice, XOR-ing the whole array cancels all paired values (x^x = 0) and leaves only the unpaired value.

Pseudocode:
result = 0
FOR each num in nums:
    result ^= num
RETURN result
`,
    code: `
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result
`,
  },
  {
    id: "arr-q31",
    category: "Arrays - Missing & Repeating Elements",
    title: "Find Missing and Duplicate Numbers",
    difficulty: "Advanced",
    time: "~30 min",
    description: "Use a set to catch the duplicate, then use the sum formula to derive the missing value.",
    concept: `
Logic:
Use a set to detect the duplicate (a value seen twice while building the set). Then compute the expected sum for 1..N and subtract the sum of the distinct values actually present to recover the missing number.

Pseudocode:
seen = {}
duplicate = -1
FOR each num in nums:
    IF num IN seen:
        duplicate = num
    seen.add(num)
missing = expectedSum(n) - sum(seen)
RETURN missing, duplicate
`,
    code: `
def find_missing_and_duplicate(nums):
    n = len(nums)
    num_set = set()
    duplicate = -1
    for num in nums:
        if num in num_set:
            duplicate = num
        num_set.add(num)
    actual_sum = sum(num_set)
    expected_sum = n * (n + 1) // 2
    missing = expected_sum - actual_sum
    return missing, duplicate
`,
  },
  {
    id: "arr-q32",
    category: "Arrays - Missing & Repeating Elements",
    title: "Find All Missing Numbers From 1...N",
    difficulty: "Intermediate",
    time: "~20 min",
    description: "Use set difference between the full expected range and the input values.",
    concept: `
Logic:
Build the full expected set of numbers from 1 to N, then subtract the set of numbers actually present — whatever remains is every missing number.

Pseudocode:
full = set(1..n)
RETURN sorted(full - set(nums))
`,
    code: `
def all_missing_numbers(nums, n):
    full_set = set(range(1, n + 1))
    return sorted(full_set - set(nums))
`,
  },
{
    id: "arr-q33",
    category: "Arrays - Searching",
    title: "Implement Linear Search",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Scan the list sequentially until the target is found.",
    concept: `
Logic:
Check each element one at a time from the start of the list, returning the index the moment the target is matched.

Pseudocode:
FOR i FROM 0 TO length-1:
    IF nums[i] == target:
        RETURN i
RETURN -1
`,
    code: `
def linear_search(nums, target):
    for i, num in enumerate(nums):
        if num == target:
            return i
    return -1
`,
  },
  {
    id: "arr-q34",
    category: "Arrays - Searching",
    title: "Implement Binary Search",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Search a sorted array by repeatedly halving the search space.",
    concept: `
Logic:
On a sorted array, compare the target to the middle element. If it matches, done. If the target is bigger, discard the left half; if smaller, discard the right half. Repeat on the remaining half until found or the range is empty.

Pseudocode:
left, right = 0, length-1
WHILE left <= right:
    mid = (left + right) / 2
    IF nums[mid] == target: RETURN mid
    ELSE IF nums[mid] < target: left = mid + 1
    ELSE: right = mid - 1
RETURN -1
`,
    code: `
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
`,
  },
  {
    id: "arr-q35",
    category: "Arrays - Searching",
    title: "Find the First Occurrence of an Element",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Modify binary search to keep moving left after a match to find the earliest index.",
    concept: `
Logic:
Run binary search, but instead of stopping at the first match, remember it and keep searching the left half for an earlier occurrence.

Pseudocode:
left, right = 0, length-1
result = -1
WHILE left <= right:
    mid = (left+right)/2
    IF nums[mid] == target:
        result = mid
        right = mid - 1
    ELSE IF nums[mid] < target: left = mid + 1
    ELSE: right = mid - 1
RETURN result
`,
    code: `
def first_occurrence(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            result = mid
            right = mid - 1
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result
`,
  },
  {
    id: "arr-q36",
    category: "Arrays - Searching",
    title: "Find the Last Occurrence",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Modify binary search to keep moving right after a match to find the latest index.",
    concept: `
Logic:
Same binary search, but after a match keep searching the right half to push the found index as far right as possible.

Pseudocode:
left, right = 0, length-1
result = -1
WHILE left <= right:
    mid = (left+right)/2
    IF nums[mid] == target:
        result = mid
        left = mid + 1
    ELSE IF nums[mid] < target: left = mid + 1
    ELSE: right = mid - 1
RETURN result
`,
    code: `
def last_occurrence(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            result = mid
            left = mid + 1
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result
`,
  },
  {
    id: "arr-q37",
    category: "Arrays - Searching",
    title: "Count Occurrences of an Element",
    difficulty: "Intermediate",
    time: "~20 min",
    description: "Combine first and last occurrence binary searches to compute the count in O(log n).",
    concept: `
Logic:
Once you know the first and last index of the target (both found in O(log n) via binary search), the count of occurrences is simply last - first + 1.

Pseudocode:
first = firstOccurrence(nums, target)
IF first == -1: RETURN 0
last = lastOccurrence(nums, target)
RETURN last - first + 1
`,
    code: `
def count_occurrences(nums, target):
    first = first_occurrence(nums, target)
    if first == -1:
        return 0
    last = last_occurrence(nums, target)
    return last - first + 1
`,
  },
  {
    id: "arr-q38",
    category: "Arrays - Searching",
    title: "Find the Index of a Target",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Safely find an element's index without raising on a missing value.",
    concept: `
Logic:
Use the list's built-in index lookup, but guard it with error handling so a missing value returns -1 instead of raising an exception.

Pseudocode:
TRY:
    RETURN nums.indexOf(target)
CATCH NotFound:
    RETURN -1
`,
    code: `
def index_of(nums, target):
    try:
        return nums.index(target)
    except ValueError:
        return -1
`,
  },
  {
    id: "arr-q39",
    category: "Arrays - Searching",
    title: "Search in a Rotated Sorted Array",
    difficulty: "Advanced",
    time: "~35 min",
    description: "Determine which half of the rotated array is sorted, then binary search that half.",
    concept: `
Logic:
A rotated sorted array still has one half that is properly sorted at any given midpoint. Determine which half is sorted, check if the target falls inside that sorted half's range, and recurse into the correct half accordingly.

Pseudocode:
left, right = 0, length-1
WHILE left <= right:
    mid = (left+right)/2
    IF nums[mid] == target: RETURN mid
    IF nums[left] <= nums[mid]:      # left half sorted
        IF nums[left] <= target < nums[mid]: right = mid - 1
        ELSE: left = mid + 1
    ELSE:                             # right half sorted
        IF nums[mid] < target <= nums[right]: left = mid + 1
        ELSE: right = mid - 1
RETURN -1
`,
    code: `
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1
`,
  },
  {
    id: "arr-q40",
    category: "Arrays - Searching",
    title: "Find the Peak Element",
    difficulty: "Advanced",
    time: "~30 min",
    description: "Use binary search, moving toward the side with the larger neighbor.",
    concept: `
Logic:
A peak is any element greater than its neighbors. Using binary search, always step toward the side with the larger neighbor, since a peak is guaranteed to exist in that direction.

Pseudocode:
left, right = 0, length-1
WHILE left < right:
    mid = (left+right)/2
    IF nums[mid] > nums[mid+1]: right = mid
    ELSE: left = mid + 1
RETURN left
`,
    code: `
def find_peak_element(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[mid + 1]:
            right = mid
        else:
            left = mid + 1
    return left
`,
  },
{
    id: "arr-q41",
    category: "Arrays - Two Sum & Pair Problems",
    title: "Find Two Numbers Whose Sum Equals a Target (Brute Force)",
    difficulty: "Beginner",
    time: "~15 min",
    description: "Check every pair with nested loops — O(n^2) baseline before optimizing.",
    concept: `
Logic:
Check every possible pair of indices with nested loops, testing whether their values sum to the target. This is the simple O(n^2) baseline before optimizing with a hash map.

Pseudocode:
FOR i FROM 0 TO n-1:
    FOR j FROM i+1 TO n-1:
        IF nums[i] + nums[j] == target:
            RETURN [i, j]
RETURN []
`,
    code: `
def two_sum_brute_force(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
`,
  },
  {
    id: "arr-q42",
    category: "Arrays - Two Sum & Pair Problems",
    title: "Two Sum Using a Dictionary",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Track complements seen so far in a hash map to solve in O(n).",
    concept: `
Logic:
For each number, compute the complement needed to reach the target. Check a hash map of previously seen numbers for that complement; if found, a pair exists. Otherwise, record the current number and keep scanning — this achieves O(n) time.

Pseudocode:
seen = {}
FOR i, num in nums:
    complement = target - num
    IF complement IN seen:
        RETURN [seen[complement], i]
    seen[num] = i
RETURN []
`,
    code: `
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`,
  },
  {
    id: "arr-q43",
    category: "Arrays - Two Sum & Pair Problems",
    title: "Two Sum in a Sorted Array Using Two Pointers",
    difficulty: "Intermediate",
    time: "~20 min",
    description: "Exploit sorted order by moving pointers inward based on the current sum.",
    concept: `
Logic:
On a sorted array, start pointers at both ends. If the sum is too small, move the left pointer right to increase it; if too large, move the right pointer left to decrease it; stop when the sum matches.

Pseudocode:
left, right = 0, length-1
WHILE left < right:
    total = nums[left] + nums[right]
    IF total == target: RETURN [left, right]
    ELSE IF total < target: left += 1
    ELSE: right -= 1
RETURN []
`,
    code: `
def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1
    return []
`,
  },
  {
    id: "arr-q44",
    category: "Arrays - Two Sum & Pair Problems",
    title: "Find All Pairs With a Given Sum",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Extend the hash-map approach to collect every matching pair, not just the first.",
    concept: `
Logic:
Extend the hash-map two-sum approach to keep going after the first match, collecting every complementary pair found as the scan proceeds.

Pseudocode:
seen = {}
pairs = []
FOR each num in nums:
    complement = target - num
    IF complement IN seen:
        pairs.append((complement, num))
    seen.add(num)
RETURN pairs
`,
    code: `
def all_pairs_with_sum(nums, target):
    seen = set()
    pairs = []
    for num in nums:
        complement = target - num
        if complement in seen:
            pairs.append((complement, num))
        seen.add(num)
    return pairs
`,
  },
  {
    id: "arr-q45",
    category: "Arrays - Two Sum & Pair Problems",
    title: "Find the Pair With the Closest Sum to Target",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Sort the array, then use two pointers while tracking the smallest difference seen.",
    concept: `
Logic:
Sort the array, then use two pointers moving inward from both ends. At each step compare the current sum's distance to the target against the best distance found so far, and move the pointer that helps close the gap.

Pseudocode:
nums = sort(nums)
left, right = 0, length-1
best = infinity
WHILE left < right:
    total = nums[left] + nums[right]
    IF |total - target| < best:
        best = |total - target|; bestPair = (nums[left], nums[right])
    IF total < target: left += 1
    ELSE: right -= 1
RETURN bestPair
`,
    code: `
def closest_pair_sum(nums, target):
    nums = sorted(nums)
    left, right = 0, len(nums) - 1
    best_pair = (nums[left], nums[right])
    best_diff = float("inf")
    while left < right:
        current_sum = nums[left] + nums[right]
        diff = abs(current_sum - target)
        if diff < best_diff:
            best_diff = diff
            best_pair = (nums[left], nums[right])
        if current_sum < target:
            left += 1
        else:
            right -= 1
    return best_pair
`,
  },
  {
    id: "arr-q46",
    category: "Arrays - Two Sum & Pair Problems",
    title: "3Sum — Find Three Numbers Whose Sum Equals a Target",
    difficulty: "Intermediate",
    time: "~40 min",
    description: "Sort the array, fix one element, then use two pointers for the remaining pair while skipping duplicates.",
    concept: `
Logic:
Sort the array first. Fix one element at a time, then use the two-pointer technique on the remaining subarray to find pairs that combine with the fixed element to reach the target. Skip over repeated values to avoid duplicate triplets in the result.

Pseudocode:
sort(nums)
FOR i FROM 0 TO n-3:
    IF nums[i] == nums[i-1]: CONTINUE  # skip dup
    left, right = i+1, n-1
    WHILE left < right:
        total = nums[i]+nums[left]+nums[right]
        IF total == target:
            record [nums[i], nums[left], nums[right]]
            left += 1; right -= 1
            skip duplicate values at left and right
        ELSE IF total < target: left += 1
        ELSE: right -= 1
RETURN result
`,
    code: `
def three_sum(nums, target=0):
    nums.sort()
    result = []
    n = len(nums)
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == target:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif total < target:
                left += 1
            else:
                right -= 1
    return result
`,
  },
  {
    id: "arr-q47",
    category: "Arrays - Two Sum & Pair Problems",
    title: "Find All Unique Triplets",
    difficulty: "Intermediate",
    time: "~30 min",
    description: "Reuse the 3Sum pattern (target = 0) with duplicate-skipping already built in.",
    concept: `
Logic:
This is just the 3Sum pattern called with a target of zero — the duplicate-skipping logic from 3Sum already guarantees uniqueness.

Pseudocode:
RETURN threeSum(nums, target = 0)
`,
    code: `
def unique_triplets(nums):
    return three_sum(nums, target=0)
`,
  },
{
    id: "arr-q48",
    category: "Arrays - Subarray Problems",
    title: "Find the Maximum Subarray Sum (Kadane's Algorithm)",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Track the best sum ending at each index, resetting when the running sum turns negative.",
    concept: `
Logic:
Kadane's algorithm: at each position decide whether to extend the previous subarray or start a fresh one there, keeping whichever gives a larger sum. Track the best sum seen across the whole scan.

Pseudocode:
maxSum = currentSum = nums[0]
FOR each num in nums[1:]:
    currentSum = max(num, currentSum + num)
    maxSum = max(maxSum, currentSum)
RETURN maxSum
`,
    code: `
def max_subarray_sum(nums):
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum
`,
  },
  {
    id: "arr-q49",
    category: "Arrays - Subarray Problems",
    title: "Find the Minimum Subarray Sum",
    difficulty: "Intermediate",
    time: "~20 min",
    description: "Mirror Kadane's algorithm, minimizing instead of maximizing the running sum.",
    concept: `
Logic:
Mirror of Kadane's algorithm: at each step decide whether extending the previous run or restarting gives a smaller sum, and track the minimum across the scan.

Pseudocode:
minSum = currentSum = nums[0]
FOR each num in nums[1:]:
    currentSum = min(num, currentSum + num)
    minSum = min(minSum, currentSum)
RETURN minSum
`,
    code: `
def min_subarray_sum(nums):
    min_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = min(num, current_sum + num)
        min_sum = min(min_sum, current_sum)
    return min_sum
`,
  },
  {
    id: "arr-q50",
    category: "Arrays - Subarray Problems",
    title: "Find a Subarray With a Given Sum",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Use a sliding window (valid for non-negative numbers) to grow and shrink the window toward the target sum.",
    concept: `
Logic:
For non-negative numbers, grow a window from the right by adding elements, and shrink it from the left whenever the running sum exceeds the target. Whenever the sum exactly matches, the current window is the answer.

Pseudocode:
left = 0; currentSum = 0
FOR right FROM 0 TO n-1:
    currentSum += nums[right]
    WHILE currentSum > target:
        currentSum -= nums[left]; left += 1
    IF currentSum == target:
        RETURN nums[left..right]
RETURN []
`,
    code: `
def subarray_with_sum(nums, target):
    left = 0
    current_sum = 0
    for right in range(len(nums)):
        current_sum += nums[right]
        while current_sum > target and left <= right:
            current_sum -= nums[left]
            left += 1
        if current_sum == target:
            return nums[left:right + 1]
    return []
`,
  },
  {
    id: "arr-q51",
    category: "Arrays - Subarray Problems",
    title: "Find the Longest Subarray With Sum K",
    difficulty: "Advanced",
    time: "~30 min",
    description: "Use prefix sums with a hash map storing the earliest index of each prefix sum, which also works with negative numbers.",
    concept: `
Logic:
Track a running prefix sum and, in a hash map, the earliest index at which each prefix sum value was seen. If prefix_sum - k has occurred before, the subarray between that earlier index and now sums to k; update the longest length found. This works even with negative numbers, unlike a plain sliding window.

Pseudocode:
prefixSum = 0
firstIndex = {0: -1}
longest = 0
FOR i, num in nums:
    prefixSum += num
    IF (prefixSum - k) IN firstIndex:
        longest = max(longest, i - firstIndex[prefixSum - k])
    IF prefixSum NOT IN firstIndex:
        firstIndex[prefixSum] = i
RETURN longest
`,
    code: `
def longest_subarray_sum_k(nums, k):
    prefix_sum = 0
    first_index = {0: -1}
    longest = 0
    for i, num in enumerate(nums):
        prefix_sum += num
        if prefix_sum - k in first_index:
            longest = max(longest, i - first_index[prefix_sum - k])
        if prefix_sum not in first_index:
            first_index[prefix_sum] = i
    return longest
`,
  },
  {
    id: "arr-q52",
    category: "Arrays - Subarray Problems",
    title: "Count Subarrays Whose Sum Equals K",
    difficulty: "Advanced",
    time: "~30 min",
    description: "Use prefix sums with a frequency map to count, rather than locate, matching subarrays.",
    concept: `
Logic:
Similar prefix-sum idea, but instead of storing indices, store how many times each prefix sum has occurred. Every prior occurrence of prefix_sum - k represents one more subarray ending here that sums to k.

Pseudocode:
prefixCount = {0: 1}
prefixSum = 0
count = 0
FOR each num in nums:
    prefixSum += num
    count += prefixCount.get(prefixSum - k, 0)
    prefixCount[prefixSum] += 1
RETURN count
`,
    code: `
def count_subarrays_sum_k(nums, k):
    prefix_count = {0: 1}
    prefix_sum = 0
    count = 0
    for num in nums:
        prefix_sum += num
        count += prefix_count.get(prefix_sum - k, 0)
        prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
    return count
`,
  },
  {
    id: "arr-q53",
    category: "Arrays - Subarray Problems",
    title: "Find the Maximum Sum of a Subarray of Size K",
    difficulty: "Beginner",
    time: "~25 min",
    description: "Use a fixed-size sliding window, adding the new element and removing the outgoing one.",
    concept: `
Logic:
Compute the sum of the first window of size K directly. Then slide the window one step at a time: add the newly included element and subtract the element that just fell out, tracking the best sum seen.

Pseudocode:
windowSum = sum(nums[0:k])
best = windowSum
FOR i FROM k TO n-1:
    windowSum += nums[i] - nums[i-k]
    best = max(best, windowSum)
RETURN best
`,
    code: `
def max_sum_subarray_k(nums, k):
    window_sum = sum(nums[:k])
    best = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        best = max(best, window_sum)
    return best
`,
  },
{
    id: "arr-q54",
    category: "Arrays - Intersection & Combination",
    title: "Find Intersection of Two Arrays",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Use set intersection to find common elements.",
    concept: `
Logic:
Converting both arrays to sets and taking their intersection directly gives the elements common to both.

Pseudocode:
RETURN list(set(nums1) & set(nums2))
`,
    code: `
def intersection(nums1, nums2):
    return list(set(nums1) & set(nums2))
`,
  },
  {
    id: "arr-q55",
    category: "Arrays - Intersection & Combination",
    title: "Find Union of Two Arrays",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Use set union to combine all unique elements from both arrays.",
    concept: `
Logic:
Converting both arrays to sets and taking their union combines every unique element from either array.

Pseudocode:
RETURN list(set(nums1) | set(nums2))
`,
    code: `
def union(nums1, nums2):
    return list(set(nums1) | set(nums2))
`,
  },
  {
    id: "arr-q56",
    category: "Arrays - Intersection & Combination",
    title: "Find Common Elements in Three Sorted Arrays",
    difficulty: "Intermediate",
    time: "~30 min",
    description: "Use three pointers, advancing the one pointing at the smallest value.",
    concept: `
Logic:
With three sorted arrays, keep one pointer per array. Advance whichever pointer currently points at the smallest value; when all three pointers agree on the same value, record it and advance all three.

Pseudocode:
i = j = k = 0
result = []
WHILE i<len(a) AND j<len(b) AND k<len(c):
    IF a[i]==b[j]==c[k]:
        result.append(a[i]); i+=1; j+=1; k+=1
    ELSE IF a[i] < b[j]: i += 1
    ELSE IF b[j] < c[k]: j += 1
    ELSE: k += 1
RETURN result
`,
    code: `
def common_in_three(a, b, c):
    i = j = k = 0
    result = []
    while i < len(a) and j < len(b) and k < len(c):
        if a[i] == b[j] == c[k]:
            result.append(a[i])
            i += 1
            j += 1
            k += 1
        elif a[i] < b[j]:
            i += 1
        elif b[j] < c[k]:
            j += 1
        else:
            k += 1
    return result
`,
  },
  {
    id: "arr-q57",
    category: "Arrays - Intersection & Combination",
    title: "Merge Two Sorted Arrays",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Use two pointers to merge in linear time, similar to the merge step of merge sort.",
    concept: `
Logic:
The classic merge step from merge sort: walk both sorted arrays with a pointer each, always taking the smaller of the two current elements, then appending whatever is left in either array once one is exhausted.

Pseudocode:
i = j = 0
result = []
WHILE i<len(a) AND j<len(b):
    IF a[i] <= b[j]: result.append(a[i]); i+=1
    ELSE: result.append(b[j]); j+=1
result += a[i:]
result += b[j:]
RETURN result
`,
    code: `
def merge_sorted_arrays(a, b):
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result
`,
  },
  {
    id: "arr-q58",
    category: "Arrays - Intersection & Combination",
    title: "Merge Two Arrays Without Extra Space",
    difficulty: "Advanced",
    time: "~40 min",
    description: "Use the gap method (Shell-sort-style comparisons) to merge in place across both arrays.",
    concept: `
Logic:
Treat the two arrays as one logical sequence and use the 'gap method' (inspired by Shellsort): start with a large gap, compare and swap elements that many positions apart across both arrays, then shrink the gap and repeat until the gap is zero, achieving an in-place merge without extra storage.

Pseudocode:
gap = ceil((n+m)/2)
WHILE gap > 0:
    i, j = 0, gap
    WHILE j < n+m:
        IF element(i) > element(j): SWAP element(i), element(j)
        i += 1; j += 1
    gap = (gap==1) ? 0 : ceil(gap/2)
RETURN a, b
`,
    code: `
def merge_without_extra_space(a, b):
    n, m = len(a), len(b)

    def get(idx):
        return a[idx] if idx < n else b[idx - n]

    def set_val(idx, val):
        if idx < n:
            a[idx] = val
        else:
            b[idx - n] = val

    gap = (n + m + 1) // 2
    while gap > 0:
        i, j = 0, gap
        while j < n + m:
            if get(i) > get(j):
                temp = get(i)
                set_val(i, get(j))
                set_val(j, temp)
            i += 1
            j += 1
        gap = 0 if gap == 1 else (gap + 1) // 2
    return a, b
`,
  },
  {
    id: "arr-q59",
    category: "Arrays - Intersection & Combination",
    title: "Find Elements Present in One Array but Not Another",
    difficulty: "Beginner",
    time: "~10 min",
    description: "Use set difference to find elements unique to the first array.",
    concept: `
Logic:
Converting both arrays to sets and subtracting the second from the first yields elements that exist only in the first array.

Pseudocode:
RETURN list(set(nums1) - set(nums2))
`,
    code: `
def difference(nums1, nums2):
    return list(set(nums1) - set(nums2))
`,
  },
{
    id: "arr-q60",
    category: "Arrays - Sorting-Based Problems",
    title: "Sort an Array Without Using sort()",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Implement a basic selection-style sort manually as a sort() replacement.",
    concept: `
Logic:
Implement sorting manually with a selection-sort pattern: repeatedly find the minimum of the unsorted remainder and swap it into its correct position at the front.

Pseudocode:
FOR i FROM 0 TO n-1:
    minIdx = i
    FOR j FROM i+1 TO n-1:
        IF nums[j] < nums[minIdx]: minIdx = j
    SWAP nums[i], nums[minIdx]
RETURN nums
`,
    code: `
def sort_without_builtin(nums):
    nums = nums[:]
    for i in range(len(nums)):
        min_idx = i
        for j in range(i + 1, len(nums)):
            if nums[j] < nums[min_idx]:
                min_idx = j
        nums[i], nums[min_idx] = nums[min_idx], nums[i]
    return nums
`,
  },
  {
    id: "arr-q61",
    category: "Arrays - Sorting-Based Problems",
    title: "Implement Bubble Sort",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Repeatedly swap adjacent out-of-order elements, with early exit if no swaps occur.",
    concept: `
Logic:
Repeatedly sweep through the array, swapping any adjacent pair that is out of order. Each full pass pushes the next-largest element to its correct position; stop early if a pass makes no swaps.

Pseudocode:
FOR i FROM 0 TO n-1:
    swapped = False
    FOR j FROM 0 TO n-i-2:
        IF nums[j] > nums[j+1]:
            SWAP nums[j], nums[j+1]
            swapped = True
    IF NOT swapped: BREAK
RETURN nums
`,
    code: `
def bubble_sort(nums):
    n = len(nums)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
                swapped = True
        if not swapped:
            break
    return nums
`,
  },
  {
    id: "arr-q62",
    category: "Arrays - Sorting-Based Problems",
    title: "Implement Selection Sort",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Repeatedly select the minimum remaining element and move it into place.",
    concept: `
Logic:
Repeatedly scan the unsorted remainder of the array for its minimum element and swap it into the next open position at the front.

Pseudocode:
FOR i FROM 0 TO n-1:
    minIdx = i
    FOR j FROM i+1 TO n-1:
        IF nums[j] < nums[minIdx]: minIdx = j
    SWAP nums[i], nums[minIdx]
RETURN nums
`,
    code: `
def selection_sort(nums):
    for i in range(len(nums)):
        min_idx = i
        for j in range(i + 1, len(nums)):
            if nums[j] < nums[min_idx]:
                min_idx = j
        nums[i], nums[min_idx] = nums[min_idx], nums[i]
    return nums
`,
  },
  {
    id: "arr-q63",
    category: "Arrays - Sorting-Based Problems",
    title: "Implement Insertion Sort",
    difficulty: "Beginner",
    time: "~20 min",
    description: "Insert each element into its correct position within the already-sorted prefix.",
    concept: `
Logic:
Grow a sorted prefix one element at a time: take the next element and shift larger elements in the sorted prefix rightward until the correct insertion point is found.

Pseudocode:
FOR i FROM 1 TO n-1:
    key = nums[i]
    j = i - 1
    WHILE j >= 0 AND nums[j] > key:
        nums[j+1] = nums[j]
        j -= 1
    nums[j+1] = key
RETURN nums
`,
    code: `
def insertion_sort(nums):
    for i in range(1, len(nums)):
        key = nums[i]
        j = i - 1
        while j >= 0 and nums[j] > key:
            nums[j + 1] = nums[j]
            j -= 1
        nums[j + 1] = key
    return nums
`,
  },
  {
    id: "arr-q64",
    category: "Arrays - Sorting-Based Problems",
    title: "Implement Merge Sort",
    difficulty: "Intermediate",
    time: "~35 min",
    description: "Recursively split the array in half, sort each half, then merge the sorted halves.",
    concept: `
Logic:
Divide and conquer: recursively split the array in half until pieces of size 1 remain (already sorted), then merge sorted halves back together pairwise using a linear merge step.

Pseudocode:
FUNCTION mergeSort(nums):
    IF length(nums) <= 1: RETURN nums
    mid = length(nums) / 2
    left = mergeSort(nums[:mid])
    right = mergeSort(nums[mid:])
    RETURN merge(left, right)
`,
    code: `
def merge_sort(nums):
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    return merge_sorted_arrays(left, right)
`,
  },
  {
    id: "arr-q65",
    category: "Arrays - Sorting-Based Problems",
    title: "Implement Quick Sort",
    difficulty: "Intermediate",
    time: "~35 min",
    description: "Partition around a pivot into smaller, equal, and larger sublists, then recurse.",
    concept: `
Logic:
Pick a pivot value, then partition the remaining elements into those smaller than the pivot, equal to it, and greater than it. Recursively sort the smaller and greater groups, then concatenate smaller + equal + greater.

Pseudocode:
FUNCTION quickSort(nums):
    IF length(nums) <= 1: RETURN nums
    pivot = nums[middle]
    smaller = [n for n in nums if n < pivot]
    equal   = [n for n in nums if n == pivot]
    larger  = [n for n in nums if n > pivot]
    RETURN quickSort(smaller) + equal + quickSort(larger)
`,
    code: `
def quick_sort(nums):
    if len(nums) <= 1:
        return nums
    pivot = nums[len(nums) // 2]
    left = [n for n in nums if n < pivot]
    mid = [n for n in nums if n == pivot]
    right = [n for n in nums if n > pivot]
    return quick_sort(left) + mid + quick_sort(right)
`,
  },
  {
    id: "arr-q66",
    category: "Arrays - Sorting-Based Problems",
    title: "Sort an Array Containing Only 0, 1, and 2",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Use the Dutch National Flag algorithm to sort in a single pass with three pointers.",
    concept: `
Logic:
The Dutch National Flag algorithm uses three pointers (low, mid, high) to sort an array of only 0s, 1s, and 2s in a single pass: 0s are swapped toward the front, 2s toward the back, and 1s are left in the middle.

Pseudocode:
low, mid, high = 0, 0, n-1
WHILE mid <= high:
    IF nums[mid]==0: SWAP nums[low],nums[mid]; low+=1; mid+=1
    ELSE IF nums[mid]==1: mid += 1
    ELSE: SWAP nums[mid],nums[high]; high -= 1
RETURN nums
`,
    code: `
def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    return nums
`,
  },
  {
    id: "arr-q67",
    category: "Arrays - Sorting-Based Problems",
    title: "Find the Kth Largest Element",
    difficulty: "Intermediate",
    time: "~30 min",
    description: "Maintain a min-heap of size K so its root is always the Kth largest value.",
    concept: `
Logic:
Maintain a min-heap of size K as you scan the array. Any time the heap grows beyond K elements, pop the smallest. After processing everything, the heap's root (its smallest member) is exactly the Kth largest overall value.

Pseudocode:
heap = empty min-heap
FOR each num in nums:
    push num onto heap
    IF size(heap) > k: pop smallest from heap
RETURN heap.top()
`,
    code: `
import heapq

def kth_largest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]
`,
  },
  {
    id: "arr-q68",
    category: "Arrays - Sorting-Based Problems",
    title: "Find the Kth Smallest Element",
    difficulty: "Intermediate",
    time: "~30 min",
    description: "Maintain a max-heap (via negation) of size K so its root is always the Kth smallest value.",
    concept: `
Logic:
Maintain a max-heap of size K (simulated with negated values in a min-heap) as you scan the array, replacing the current maximum whenever a smaller value arrives. After the scan, the heap's top is the Kth smallest value.

Pseudocode:
heap = max-heap of first k elements
FOR each remaining num:
    IF num < heap.top():
        replace heap.top() with num
RETURN heap.top()
`,
    code: `
import heapq

def kth_smallest(nums, k):
    heap = [-num for num in nums[:k]]
    heapq.heapify(heap)
    for num in nums[k:]:
        if -num > heap[0]:
            heapq.heapreplace(heap, -num)
    return -heap[0]
`,
  },
{
    id: "arr-q69",
    category: "Arrays - Advanced Patterns",
    title: "Find Maximum Profit From Stock Prices",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Track the minimum price seen so far and the best profit achievable at each step.",
    concept: `
Logic:
Track the lowest price encountered so far while scanning left to right. At each day, compute the profit from buying at that minimum and selling today, keeping the best profit found.

Pseudocode:
minPrice = infinity
profit = 0
FOR each price in prices:
    minPrice = min(minPrice, price)
    profit = max(profit, price - minPrice)
RETURN profit
`,
    code: `
def max_profit(prices):
    min_price = float("inf")
    profit = 0
    for price in prices:
        min_price = min(min_price, price)
        profit = max(profit, price - min_price)
    return profit
`,
  },
  {
    id: "arr-q70",
    category: "Arrays - Advanced Patterns",
    title: "Find Maximum Product Subarray",
    difficulty: "Advanced",
    time: "~35 min",
    description: "Track both running max and min products, since a negative number can flip the sign.",
    concept: `
Logic:
Because multiplying by a negative number can flip a very negative running product into the new maximum, track both a running maximum and a running minimum product at each step, updating both based on the current number and the previous max/min.

Pseudocode:
maxProd = minProd = result = nums[0]
FOR each num in nums[1:]:
    candidates = (num, maxProd*num, minProd*num)
    maxProd = max(candidates)
    minProd = min(candidates)
    result = max(result, maxProd)
RETURN result
`,
    code: `
def max_product_subarray(nums):
    max_prod = min_prod = result = nums[0]
    for num in nums[1:]:
        candidates = (num, max_prod * num, min_prod * num)
        max_prod = max(candidates)
        min_prod = min(candidates)
        result = max(result, max_prod)
    return result
`,
  },
  {
    id: "arr-q71",
    category: "Arrays - Advanced Patterns",
    title: "Find Product of Array Except Self",
    difficulty: "Advanced",
    time: "~35 min",
    description: "Compute prefix and suffix products in two passes, without using division.",
    concept: `
Logic:
Without using division, compute the product of all elements to the left of each index in one left-to-right pass, then multiply in the product of all elements to the right of each index in a second right-to-left pass.

Pseudocode:
result = array of 1s, size n
leftProduct = 1
FOR i FROM 0 TO n-1:
    result[i] = leftProduct
    leftProduct *= nums[i]
rightProduct = 1
FOR i FROM n-1 DOWNTO 0:
    result[i] *= rightProduct
    rightProduct *= nums[i]
RETURN result
`,
    code: `
def product_except_self(nums):
    n = len(nums)
    result = [1] * n

    left_product = 1
    for i in range(n):
        result[i] = left_product
        left_product *= nums[i]

    right_product = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right_product
        right_product *= nums[i]

    return result
`,
  },
  {
    id: "arr-q72",
    category: "Arrays - Advanced Patterns",
    title: "Find Leaders in an Array",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Scan from the right, keeping any element greater than everything seen so far.",
    concept: `
Logic:
An element is a 'leader' if it's greater than everything to its right. Scan from right to left, keeping the running maximum seen so far; any element that beats that running maximum is a leader.

Pseudocode:
leaders = []
maxFromRight = -infinity
FOR each num in reverse(nums):
    IF num > maxFromRight:
        leaders.append(num)
        maxFromRight = num
RETURN reverse(leaders)
`,
    code: `
def find_leaders(nums):
    leaders = []
    max_from_right = float("-inf")
    for num in reversed(nums):
        if num > max_from_right:
            leaders.append(num)
            max_from_right = num
    return leaders[::-1]
`,
  },
  {
    id: "arr-q73",
    category: "Arrays - Advanced Patterns",
    title: "Find the Equilibrium Index",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Find an index where the sum of elements to the left equals the sum to the right.",
    concept: `
Logic:
An equilibrium index has an equal sum of elements on its left and right. Start with the total sum on the right side and subtract elements as you scan, comparing the accumulated left sum to the shrinking right sum at each index.

Pseudocode:
total = sum(nums)
leftSum = 0
FOR i, num in nums:
    total -= num
    IF leftSum == total: RETURN i
    leftSum += num
RETURN -1
`,
    code: `
def equilibrium_index(nums):
    total = sum(nums)
    left_sum = 0
    for i, num in enumerate(nums):
        total -= num
        if left_sum == total:
            return i
        left_sum += num
    return -1
`,
  },
  {
    id: "arr-q74",
    category: "Arrays - Advanced Patterns",
    title: "Find the Majority Element (With Verification)",
    difficulty: "Intermediate",
    time: "~25 min",
    description: "Apply Boyer-Moore voting, then verify the candidate actually appears more than n/2 times.",
    concept: `
Logic:
Run Boyer-Moore voting to get a candidate, then double-check by counting how many times that candidate actually appears; only return it if it truly occurs more than n/2 times (since Boyer-Moore alone assumes a majority exists).

Pseudocode:
candidate = boyerMooreVote(nums)
IF count(nums, candidate) > n/2:
    RETURN candidate
RETURN None
`,
    code: `
def majority_element_verified(nums):
    count = 0
    candidate = None
    for num in nums:
        if count == 0:
            candidate = num
        count += 1 if num == candidate else -1
    if nums.count(candidate) > len(nums) // 2:
        return candidate
    return None
`,
  },
  {
    id: "arr-q75",
    category: "Arrays - Advanced Patterns",
    title: "Find the Longest Consecutive Sequence",
    difficulty: "Advanced",
    time: "~35 min",
    description: "Use a set for O(1) lookups, only starting a sequence count from numbers with no predecessor.",
    concept: `
Logic:
Put every number in a set for O(1) lookups. Only start counting a sequence from numbers that have no predecessor (num-1 is not in the set) — that guarantees each run is only counted once — then keep extending forward while the next number exists.

Pseudocode:
numSet = set(nums)
longest = 0
FOR each num in numSet:
    IF (num - 1) NOT IN numSet:
        length = 1
        WHILE (num + length) IN numSet:
            length += 1
        longest = max(longest, length)
RETURN longest
`,
    code: `
def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    for num in num_set:
        if num - 1 not in num_set:
            length = 1
            while num + length in num_set:
                length += 1
            longest = max(longest, length)
    return longest
`,
  },
  {
    id: "arr-q76",
    category: "Arrays - Advanced Patterns",
    title: "Find the Maximum Area/Container",
    difficulty: "Intermediate",
    time: "~30 min",
    description: "Use two pointers from both ends, always moving the pointer at the shorter wall inward.",
    concept: `
Logic:
Start pointers at both ends of the array (the widest possible container). The area is width times the shorter wall's height. Since moving the taller wall can only shrink the width without helping, always move the shorter wall's pointer inward.

Pseudocode:
left, right = 0, n-1
best = 0
WHILE left < right:
    width = right - left
    best = max(best, width * min(heights[left], heights[right]))
    IF heights[left] < heights[right]: left += 1
    ELSE: right -= 1
RETURN best
`,
    code: `
def max_area(heights):
    left, right = 0, len(heights) - 1
    best = 0
    while left < right:
        width = right - left
        best = max(best, width * min(heights[left], heights[right]))
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1
    return best
`,
  },
  {
    id: "arr-q77",
    category: "Arrays - Advanced Patterns",
    title: "Find Trapped Rainwater",
    difficulty: "Advanced",
    time: "~40 min",
    description: "Use two pointers tracking left-max and right-max heights to compute trapped water in one pass.",
    concept: `
Logic:
Track the maximum height seen so far from both the left and right using two pointers. Water trapped above any position is bounded by the smaller of its left-max and right-max; move the pointer on the side with the smaller max inward, accumulating trapped water.

Pseudocode:
left, right = 0, n-1
leftMax, rightMax = heights[left], heights[right]
water = 0
WHILE left < right:
    IF leftMax < rightMax:
        left += 1; leftMax = max(leftMax, heights[left])
        water += leftMax - heights[left]
    ELSE:
        right -= 1; rightMax = max(rightMax, heights[right])
        water += rightMax - heights[right]
RETURN water
`,
    code: `
def trap_rainwater(heights):
    if not heights:
        return 0
    left, right = 0, len(heights) - 1
    left_max, right_max = heights[left], heights[right]
    water = 0
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, heights[left])
            water += left_max - heights[left]
        else:
            right -= 1
            right_max = max(right_max, heights[right])
            water += right_max - heights[right]
    return water
`,
  },
  {
    id: "arr-q78",
    category: "Arrays - Advanced Patterns",
    title: "Find the Next Greater Element",
    difficulty: "Intermediate",
    time: "~30 min",
    description: "Use a monotonic decreasing stack of indices to resolve each element's next greater value.",
    concept: `
Logic:
Maintain a stack of indices whose next-greater value is still unknown. For each new number, pop and resolve any stacked indices whose value is smaller than the current number (their next greater element is the current number), then push the current index.

Pseudocode:
result = array of -1, size n
stack = []
FOR i, num in nums:
    WHILE stack NOT EMPTY AND nums[stack.top] < num:
        idx = stack.pop()
        result[idx] = num
    stack.push(i)
RETURN result
`,
    code: `
def next_greater_element(nums):
    result = [-1] * len(nums)
    stack = []
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            result[stack.pop()] = num
        stack.append(i)
    return result
`,
  },
  {
    id: "arr-q79",
    category: "Arrays - Advanced Patterns",
    title: "Find the Maximum in Every Sliding Window",
    difficulty: "Advanced",
    time: "~35 min",
    description: "Use a monotonic decreasing deque of indices to track the current window's maximum.",
    concept: `
Logic:
Maintain a deque of indices whose values are in decreasing order. Before adding a new index, remove indices from the back whose values are smaller (they can never be the max again). Remove indices from the front that have fallen outside the current window. The front of the deque is always the current window's maximum.

Pseudocode:
dq = empty deque
result = []
FOR i, num in nums:
    WHILE dq NOT EMPTY AND nums[dq.back] < num:
        dq.popBack()
    dq.pushBack(i)
    IF dq.front <= i - k:
        dq.popFront()
    IF i >= k-1:
        result.append(nums[dq.front])
RETURN result
`,
    code: `
from collections import deque

def max_sliding_window(nums, k):
    dq = deque()
    result = []
    for i, num in enumerate(nums):
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result
`,
  },
  {
    id: "arr-q80",
    category: "Arrays - Advanced Patterns",
    title: "Find the Subarray With Maximum XOR",
    difficulty: "Advanced",
    time: "~35 min",
    description: "Check every subarray's running XOR value, tracking the maximum seen (O(n^2) baseline).",
    concept: `
Logic:
Brute-force baseline: for every starting index, extend the subarray one element at a time, updating a running XOR value and tracking the maximum XOR seen across all subarrays checked.

Pseudocode:
maxXor = 0
FOR i FROM 0 TO n-1:
    currentXor = 0
    FOR j FROM i TO n-1:
        currentXor ^= nums[j]
        maxXor = max(maxXor, currentXor)
RETURN maxXor
`,
    code: `
def max_subarray_xor(nums):
    max_xor = 0
    n = len(nums)
    for i in range(n):
        current_xor = 0
        for j in range(i, n):
            current_xor ^= nums[j]
            max_xor = max(max_xor, current_xor)
    return max_xor
`,
  }
];

export default function ObservabilityPage() {
  return (
    <CookbookApp
      data={ArraysBasicOps}
      title="ArraysBasicOps Cookbook"
      subtitle="Tracing, logging, metrics, AI telemetry, dashboards and alerting"
      icon="📈"
      patternLabel="Topics"
    />
  );
}
