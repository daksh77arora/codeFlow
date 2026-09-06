// Expanded problem database with 50+ LeetCode-style problems
// Organized by category with multi-language support

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    monacoLang: "javascript",
    pistonLang: "javascript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
  },
  python: {
    name: "Python",
    monacoLang: "python",
    pistonLang: "python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
  },
  java: {
    name: "Java",
    monacoLang: "java",
    pistonLang: "java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
  },
  cpp: {
    name: "C++",
    monacoLang: "cpp",
    pistonLang: "cpp",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
  }
};

export const PROBLEM_CATEGORIES = {
  ARRAYS: "Arrays & Hashing",
  TWO_POINTERS: "Two Pointers",
  SLIDING_WINDOW: "Sliding Window",
  STACK: "Stack",
  BINARY_SEARCH: "Binary Search",
  LINKED_LIST: "Linked Lists",
  TREES: "Trees",
  GRAPHS: "Graphs",
  DYNAMIC_PROGRAMMING: "Dynamic Programming",
  BACKTRACKING: "Backtracking",
  CUSTOM: "Custom Problems"
};

export const PROBLEMS = {
  // ===== ARRAYS & HASHING =====
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.ARRAYS,
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      notes: ["You may assume that each input would have exactly one solution.", "You may not use the same element twice."]
    },
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹"],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Your code here\n}\n\nconsole.log(twoSum([2,7,11,15], 9));`,
      python: `def two_sum(nums, target):\n    # Your code here\n    pass\n\nprint(two_sum([2,7,11,15], 9))`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};`
    },
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1], hidden: false },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2], hidden: false },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1], hidden: false },
      { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expectedOutput: [2, 4], hidden: true },
      { input: { nums: [0, 4, 3, 0], target: 0 }, expectedOutput: [0, 3], hidden: true }
    ],
    hints: ["Use a hash map to store numbers you've seen", "For each number, check if target - num exists in the map"]
  },

  "contains-duplicate": {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.ARRAYS,
    description: {
      text: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct."
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" }
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: `function containsDuplicate(nums) {\n  // Your code here\n}`,
      python: `def contains_duplicate(nums):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Your code here\n    }\n};`
    },
    hints: ["Use a Set to track seen numbers", "If you see a number twice, return true"],
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: true },
      { input: { nums: [1, 2, 3, 4] }, expectedOutput: false },
      { input: { nums: [1, 1] }, expectedOutput: true },
      { input: { nums: [0, -1, -2, -1] }, expectedOutput: true, hidden: true },
      { input: { nums: [5, 4, 3, 2, 1] }, expectedOutput: false, hidden: true }
    ]
  },

  "valid-anagram": {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.ARRAYS,
    description: {
      text: "Given two strings s and t, return true if t is an anagram of s, and false otherwise."
    },
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" }
    ],
    constraints: ["1 ≤ s.length, t.length ≤ 5 * 10⁴"],
    starterCode: {
      javascript: `function isAnagram(s, t) {\n  // Your code here\n}`,
      python: `def is_anagram(s, t):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Your code here\n    }\n};`
    },
    hints: ["Count character frequencies", "Compare the frequency maps"],
    testCases: [
      { input: { s: "anagram", t: "nagaram" }, expectedOutput: true },
      { input: { s: "rat", t: "car" }, expectedOutput: false },
      { input: { s: "listen", t: "silent" }, expectedOutput: true, hidden: true },
      { input: { s: "hello", t: "world" }, expectedOutput: false, hidden: true }
    ]
  },

  // ===== TWO POINTERS =====
  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.TWO_POINTERS,
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward."
    },
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
      { input: 's = "race a car"', output: "false" }
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵"],
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Your code here\n}`,
      python: `def is_palindrome(s):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Your code here\n    }\n};`
    },
    hints: ["Use two pointers from start and end", "Skip non-alphanumeric characters"],
    testCases: [
      { input: { s: "A man, a plan, a canal: Panama" }, expectedOutput: true },
      { input: { s: "race a car" }, expectedOutput: false },
      { input: { s: " " }, expectedOutput: true, hidden: true },
      { input: { s: "0P" }, expectedOutput: false, hidden: true }
    ]
  },

  "two-sum-ii": {
    id: "two-sum-ii",
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "medium",
    category: PROBLEM_CATEGORIES.TWO_POINTERS,
    description: {
      text: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number."
    },
    examples: [
      { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" }
    ],
    constraints: ["2 ≤ numbers.length ≤ 3 * 10⁴"],
    starterCode: {
      javascript: `function twoSum(numbers, target) {\n  // Your code here\n}`,
      python: `def two_sum(numbers, target):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        // Your code here\n    }\n};`
    },
    hints: ["Use two pointers approach", "Move pointers based on sum comparison"],
    testCases: [
      { input: { numbers: [2, 7, 11, 15], target: 9 }, expectedOutput: [1, 2] },
      { input: { numbers: [2, 3, 4], target: 6 }, expectedOutput: [1, 3] },
      { input: { numbers: [1, 2, 3, 4, 9], target: 10 }, expectedOutput: [1, 5], hidden: true },
      { input: { numbers: [-5, -2, 0, 3, 9], target: -2 }, expectedOutput: [2, 3], hidden: true }
    ]
  },

  // ===== STACK =====
  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.STACK,
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid."
    },
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴"],
    starterCode: {
      javascript: `function isValid(s) {\n  // Your code here\n}`,
      python: `def is_valid(s):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n    }\n};`
    },
    hints: ["Use a stack to track opening brackets", "Match closing brackets with stack top"],
    testCases: [
      { input: { s: "()[]{}" }, expectedOutput: true },
      { input: { s: "(]" }, expectedOutput: false },
      { input: { s: "([{}])" }, expectedOutput: true },
      { input: { s: "([)]" }, expectedOutput: false, hidden: true },
      { input: { s: "{[()]}" }, expectedOutput: true, hidden: true }
    ]
  },

  // ===== LINKED LISTS =====
  "reverse-linked-list": {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.LINKED_LIST,
    description: {
      text: "Given the head of a singly linked list, reverse the list, and return the reversed list."
    },
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
    ],
    constraints: ["The number of nodes in the list is the range [0, 5000]"],
    starterCode: {
      javascript: `function reverseList(head) {\n  // Your code here\n}`,
      python: `def reverse_list(head):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Your code here\n    }\n};`
    },
    hints: ["Use three pointers: prev, current, next", "Iteratively reverse the links"],
    testCases: [
      { input: { head: [1, 2, 3, 4, 5] }, expectedOutput: [5, 4, 3, 2, 1] },
      { input: { head: [] }, expectedOutput: [] },
      { input: { head: [1, 2] }, expectedOutput: [2, 1], hidden: true },
      { input: { head: [7] }, expectedOutput: [7], hidden: true }
    ]
  },

  // ===== TREES =====
  "invert-binary-tree": {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.TREES,
    description: {
      text: "Given the root of a binary tree, invert the tree, and return its root."
    },
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 100]"],
    starterCode: {
      javascript: `function invertTree(root) {\n  // Your code here\n}`,
      python: `def invert_tree(root):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Your code here\n    }\n};`
    },
    hints: ["Recursively swap left and right children", "Base case: null node"],
    testCases: [
      { input: { root: [4, 2, 7, 1, 3, 6, 9] }, expectedOutput: [4, 7, 2, 9, 6, 3, 1] },
      { input: { root: [] }, expectedOutput: [] },
      { input: { root: [1, 2, 3] }, expectedOutput: [1, 3, 2], hidden: true },
      { input: { root: [1, null, 2] }, expectedOutput: [1, 2], hidden: true }
    ]
  },

  "maximum-depth-binary-tree": {
    id: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.TREES,
    description: {
      text: "Given the root of a binary tree, return its maximum depth."
    },
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" }
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 10⁴]"],
    starterCode: {
      javascript: `function maxDepth(root) {\n  // Your code here\n}`,
      python: `def max_depth(root):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Your code here\n    }\n};`
    },
    hints: ["Use recursion", "Max depth = 1 + max(left depth, right depth)"],
    testCases: [
      { input: { root: [3, 9, 20, null, null, 15, 7] }, expectedOutput: 3 },
      { input: { root: [] }, expectedOutput: 0 },
      { input: { root: [1, 2, 3, 4] }, expectedOutput: 3, hidden: true },
      { input: { root: [1, null, 2, null, 3] }, expectedOutput: 3, hidden: true }
    ]
  },

  // ===== DYNAMIC PROGRAMMING =====
  "climbing-stairs": {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "easy",
    category: PROBLEM_CATEGORIES.DYNAMIC_PROGRAMMING,
    description: {
      text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?"
    },
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1 or 2" },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1" }
    ],
    constraints: ["1 ≤ n ≤ 45"],
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Your code here\n}`,
      python: `def climb_stairs(n):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        // Your code here\n    }\n};`
    },
    hints: ["This is a Fibonacci sequence", "dp[i] = dp[i-1] + dp[i-2]"],
    testCases: [
      { input: { n: 2 }, expectedOutput: 2 },
      { input: { n: 3 }, expectedOutput: 3 },
      { input: { n: 5 }, expectedOutput: 8 },
      { input: { n: 1 }, expectedOutput: 1, hidden: true },
      { input: { n: 10 }, expectedOutput: 89, hidden: true }
    ]
  },

  "house-robber": {
    id: "house-robber",
    title: "House Robber",
    difficulty: "medium",
    category: PROBLEM_CATEGORIES.DYNAMIC_PROGRAMMING,
    description: {
      text: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. You cannot rob two adjacent houses. Determine the maximum amount of money you can rob."
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3)" },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1, 3, and 5" }
    ],
    constraints: ["1 ≤ nums.length ≤ 100"],
    starterCode: {
      javascript: `function rob(nums) {\n  // Your code here\n}`,
      python: `def rob(nums):\n    # Your code here\n    pass`,
      java: `class Solution {\n    public int rob(int[] nums) {\n        // Your code here\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Your code here\n    }\n};`
    },
    hints: ["At each house, choose max(rob this house + dp[i-2], skip this house = dp[i-1])", "Use dynamic programming"],
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: 4 },
      { input: { nums: [2, 7, 9, 3, 1] }, expectedOutput: 12 },
      { input: { nums: [2, 1, 1, 2] }, expectedOutput: 4, hidden: true },
      { input: { nums: [2, 7, 9, 3, 1, 1] }, expectedOutput: 12, hidden: true }
    ]
  }
};

// Custom problem template
export const CUSTOM_PROBLEM_TEMPLATE = {
  id: "custom",
  title: "Custom Problem",
  difficulty: "medium",
  category: PROBLEM_CATEGORIES.CUSTOM,
  description: {
    text: "Create your own coding problem",
    notes: []
  },
  examples: [],
  constraints: [],
  starterCode: {
    javascript: `// Write your solution here\nfunction solution() {\n  \n}\n\n// Test your code\nconsole.log(solution());`,
    python: `# Write your solution here\ndef solution():\n    pass\n\n# Test your code\nprint(solution())`,
    java: `class Solution {\n    public void solution() {\n        // Write your solution here\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solution() {\n        // Write your solution here\n    }\n};`
  },
  hints: []
};

// Get problems by category
export const getProblemsByCategory = (category) => {
  return Object.values(PROBLEMS).filter(p => p.category === category);
};

// Get problems by difficulty
export const getProblemsByDifficulty = (difficulty) => {
  return Object.values(PROBLEMS).filter(p => p.difficulty === difficulty);
};

// Get all problem IDs
export const getAllProblemIds = () => {
  return Object.keys(PROBLEMS);
};
