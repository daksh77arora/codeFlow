import { executeCode } from "../lib/piston.js";

export async function runCode(req, res) {
  try {
    const { language, code, input = "", testCases = [] } = req.body;

    if (!language || !code) {
      return res.status(400).json({ message: "Language and code are required" });
    }

    if (Array.isArray(testCases) && testCases.length > 0) {
      const result = await executeTestCases(language, code, testCases);
      return res.status(200).json(result);
    }

    const result = await executeCode(language, code, input);
    res.status(200).json(toExecutionResponse(result));
  } catch (error) {
    console.error("Error in runCode:", error);
    res.status(500).json({ message: error.message || "Code execution failed" });
  }
}

export async function executeTestCases(language, code, testCases) {
  const harness = createHarness(language, code, testCases);
  const result = await executeCode(language, harness);

  if (result.stderr || result.code) {
    return { success: false, error: result.stderr || `Process exited with code ${result.code}`, output: result.output || "" };
  }

  const lines = result.output.split(/\r?\n/).filter((line) => line.startsWith("RESULT:"));
  const results = testCases.map((testCase, index) => {
    const actualText = lines[index]?.slice(7) ?? null;
    let actualOutput = null;
    try { actualOutput = actualText === null ? null : JSON.parse(actualText); } catch { actualOutput = actualText; }
    return {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput,
      passed: JSON.stringify(actualOutput) === JSON.stringify(testCase.expectedOutput),
      error: actualText === null ? "No result was produced" : null,
    };
  });

  return {
    success: true,
    output: result.output,
    testResults: results,
    allPassed: results.every((test) => test.passed),
    passedCount: results.filter((test) => test.passed).length,
    totalCount: results.length,
  };
}

function toExecutionResponse(result) {
  return result.stderr || result.code
    ? { success: false, output: result.output || "", error: result.stderr || `Process exited with code ${result.code}` }
    : { success: true, output: result.output || "No output" };
}

function getFunctionName(code, language) {
  const patterns = {
    javascript: /function\s+(\w+)\s*\(/,
    python: /def\s+(\w+)\s*\(/,
    java: /\b(?:public\s+)?[\w\[\]]+\s+(\w+)\s*\(/,
    cpp: /\b(?:public:\s*)?[\w:<>*]+\s+(\w+)\s*\(/,
  };
  return code.match(patterns[language])?.[1] || "solve";
}

function createHarness(language, code, testCases) {
  const functionName = getFunctionName(code, language);
  const inputArgs = (input) => {
    if ((input.nums !== undefined || input.numbers !== undefined) && input.target !== undefined) {
      return [input.nums ?? input.numbers, input.target];
    }
    return Object.values(input);
  };
  if (language === "javascript") {
    if (functionName === "reverseList") {
      return `function __list(a) { let h = null, t = null; for (const v of a) { const n = { val: v, next: null }; if (!h) h = n; else t.next = n; t = n; } return h; }\nfunction __listOut(h) { const a = []; while (h) { a.push(h.val); h = h.next; } return a; }\n${code}\nfor (const test of ${JSON.stringify(testCases)}) { console.log("RESULT:" + JSON.stringify(__listOut(reverseList(__list(test.input.head))))); }`;
    }
    if (functionName === "invertTree" || functionName === "maxDepth") {
      return `function __tree(a) { if (!a.length) return null; const n = a.map((v) => v == null ? null : { val: v, left: null, right: null }); for (let i = 0; i < n.length; i++) if (n[i]) { n[i].left = n[2*i+1] || null; n[i].right = n[2*i+2] || null; } return n[0]; }\nfunction __treeOut(root) { if (!root) return []; const out = [], q = [root]; while (q.length) { const n = q.shift(); out.push(n ? n.val : null); if (n) { q.push(n.left); q.push(n.right); } } while (out.at(-1) == null) out.pop(); return out; }\n${code}\nfor (const test of ${JSON.stringify(testCases)}) { const root = __tree(test.input.root); const value = ${functionName}(root); console.log("RESULT:" + JSON.stringify(${functionName === "invertTree" ? "__treeOut(value)" : "value"})); }`;
    }
    return `${code}\nfor (const test of ${JSON.stringify(testCases)}) {\n  const args = test.input.nums !== undefined ? [test.input.nums, test.input.target] : Object.values(test.input);\n  const value = ${functionName}(...args);\n  console.log("RESULT:" + JSON.stringify(value));\n}`;
  }
  if (language === "python") {
    if (functionName === "reverse_list") {
      const cases = JSON.stringify(testCases);
      return `import json\nclass ListNode:\n    def __init__(self, val=0, next=None): self.val, self.next = val, next\ndef __list(a):\n    head = tail = None\n    for v in a:\n        node = ListNode(v)\n        if head is None: head = node\n        else: tail.next = node\n        tail = node\n    return head\ndef __list_out(head):\n    out = []\n    while head: out.append(head.val); head = head.next\n    return out\n${code}\nfor test in ${cases}: print("RESULT:" + json.dumps(__list_out(reverse_list(__list(test["input"]["head"])))) )`;
    }
    if (functionName === "invert_tree" || functionName === "max_depth") {
      const cases = JSON.stringify(testCases);
      return `import json\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None): self.val, self.left, self.right = val, left, right\ndef __tree(a):\n    if not a: return None\n    nodes = [None if v is None else TreeNode(v) for v in a]\n    for i, node in enumerate(nodes):\n        if node: node.left = nodes[2*i+1] if 2*i+1 < len(nodes) else None; node.right = nodes[2*i+2] if 2*i+2 < len(nodes) else None\n    return nodes[0]\ndef __tree_out(root):\n    if not root: return []\n    out, queue = [], [root]\n    while queue:\n        node = queue.pop(0); out.append(node.val if node else None)\n        if node: queue += [node.left, node.right]\n    while out and out[-1] is None: out.pop()\n    return out\n${code}\nfor test in ${cases}:\n    root = __tree(test["input"]["root"]); value = ${functionName}(root); print("RESULT:" + json.dumps(${functionName === "invert_tree" ? "__tree_out(value)" : "value"}))`;
    }
    const calls = testCases.map((test) => `${functionName}(${inputArgs(test.input).map((value) => JSON.stringify(value)).join(", ")})`);
    return `${code}\nimport json\nfor value in [${calls.join(", ")}]:\n    print("RESULT:" + json.dumps(value))\n`;
  }
  if (language === "cpp") {
    if (functionName === "reverseList") {
      const calls = testCases.map((test, index) => `ListNode* input${index} = makeList({${test.input.head.join(",")}}); auto value${index} = Solution().reverseList(input${index}); cout << "RESULT:" << listJson(value${index}) << "\\n";`).join("\n  ");
      return `#include <bits/stdc++.h>\nusing namespace std;\nstruct ListNode { int val; ListNode* next; ListNode(int v): val(v), next(nullptr) {} };\nListNode* makeList(initializer_list<int> a) { ListNode* h=nullptr; ListNode* t=nullptr; for (int v:a) { auto* n=new ListNode(v); if(!h)h=n;else t->next=n;t=n; } return h; }\nstring listJson(ListNode* h) { string s="["; bool first=true; while(h){ if(!first)s+=","; s+=to_string(h->val); first=false; h=h->next; } return s+"]"; }\n${code}\nint main(){\n  ${calls}\n}`;
    }
    if (functionName === "invertTree" || functionName === "maxDepth") {
      const calls = testCases.map((test, index) => {
        const values = test.input.root.map((value) => value === null ? "INT_MIN" : value).join(",");
        const output = functionName === "invertTree" ? `treeJson(value${index})` : `to_string(value${index})`;
        return `TreeNode* input${index} = makeTree({${values}}); auto value${index} = Solution().${functionName}(input${index}); cout << "RESULT:" << ${output} << "\\n";`;
      }).join("\n  ");
      return `#include <bits/stdc++.h>\nusing namespace std;\nstruct TreeNode { int val; TreeNode* left; TreeNode* right; TreeNode(int v): val(v), left(nullptr), right(nullptr) {} };\nTreeNode* makeTree(vector<int> a) { if(a.empty() || a[0]==INT_MIN)return nullptr; vector<TreeNode*> n; for(int v:a)n.push_back(v==INT_MIN?nullptr:new TreeNode(v)); for(size_t i=0;i<n.size();i++)if(n[i]){if(2*i+1<n.size())n[i]->left=n[2*i+1];if(2*i+2<n.size())n[i]->right=n[2*i+2];} return n[0]; }\nstring treeJson(TreeNode* r) { if(!r)return "[]"; vector<TreeNode*> q{r}; vector<string> out; for(size_t i=0;i<q.size();i++){auto*n=q[i];if(!n){out.push_back("null");continue;}out.push_back(to_string(n->val));q.push_back(n->left);q.push_back(n->right);}while(!out.empty()&&out.back()=="null")out.pop_back();string s="[";for(size_t i=0;i<out.size();i++){if(i)s+=",";s+=out[i];}return s+"]";}\n${code}\nint main(){\n  ${calls}\n}`;
    }
    const calls = testCases.map((testCase, index) => {
      const values = inputArgs(testCase.input);
      const input = testCase.input;
      const isArray = input.nums !== undefined || input.numbers !== undefined;
      const isStringPair = input.s !== undefined && input.t !== undefined;
      const isString = input.s !== undefined && !isStringPair;
      const args = isArray
        ? `input${index}${values[1] !== undefined ? `, ${values[1]}` : ""}`
        : values.map((value) => JSON.stringify(value)).join(", ");
      const output = isArray && functionName !== "rob" && functionName !== "containsDuplicate"
        ? "vector"
        : isStringPair || isString || functionName === "containsDuplicate"
          ? "bool"
          : "int";
      const print = output === "vector"
        ? `cout << "["; for (size_t i = 0; i < value${index}.size(); i++) cout << (i ? "," : "") << value${index}[i]; cout << "]";`
        : output === "bool" ? `cout << (value${index} ? "true" : "false");` : `cout << value${index};`;
      const declaration = isArray ? `vector<int> input${index} = {${values[0].join(",")}}; ` : "";
      return `${declaration}auto value${index} = Solution().${functionName}(${args}); cout << "RESULT:"; ${print} cout << "\\n";`;
    }).join("\n  ");
    return `#include <bits/stdc++.h>\nusing namespace std;\n${code}\nint main() {\n  ${calls}\n}`;
  }
  if (language === "java") {
    if (functionName === "reverseList") {
      const calls = testCases.map((test) => `runList(new int[]{${test.input.head.join(",")}})`).join("; ");
      return `class ListNode { int val; ListNode next; ListNode(int v) { val=v; } }\n${code}\nclass Main { static ListNode makeList(int[] a) { ListNode h=null,t=null; for(int v:a){ListNode n=new ListNode(v);if(h==null)h=n;else t.next=n;t=n;}return h;} static String out(ListNode h){StringBuilder s=new StringBuilder("[");boolean f=true;while(h!=null){if(!f)s.append(",");s.append(h.val);f=false;h=h.next;}return s.append("]").toString();} static void runList(int[] a){System.out.println("RESULT:"+out(new Solution().reverseList(makeList(a))));} public static void main(String[] args){${calls};}}`;
    }
    if (functionName === "invertTree" || functionName === "maxDepth") {
      const calls = testCases.map((test) => `runTree(new Integer[]{${test.input.root.map((value) => value === null ? "null" : value).join(",")}})`).join("; ");
      return `class TreeNode { int val; TreeNode left,right; TreeNode(int v){val=v;} }\n${code}\nclass Main { static TreeNode makeTree(Integer[] a){if(a.length==0||a[0]==null)return null;TreeNode[] n=new TreeNode[a.length];for(int i=0;i<a.length;i++)if(a[i]!=null)n[i]=new TreeNode(a[i]);for(int i=0;i<a.length;i++)if(n[i]!=null){if(2*i+1<a.length)n[i].left=n[2*i+1];if(2*i+2<a.length)n[i].right=n[2*i+2];}return n[0];} static String out(TreeNode r){if(r==null)return "[]";ArrayList<TreeNode>q=new ArrayList<>();q.add(r);ArrayList<String>o=new ArrayList<>();for(int i=0;i<q.size();i++){TreeNode n=q.get(i);if(n==null)o.add("null");else{o.add(""+n.val);q.add(n.left);q.add(n.right);}}while(!o.isEmpty()&&o.get(o.size()-1).equals("null"))o.remove(o.size()-1);return "["+String.join(",",o)+"]";} static void runTree(Integer[] a){TreeNode r=makeTree(a);Object v=new Solution().${functionName}(r);System.out.println("RESULT:"+(${functionName === "invertTree" ? "out((TreeNode)v)" : "v"}));} public static void main(String[] args){${calls};}}`;
    }
    const calls = testCases.map((testCase) => {
      const values = inputArgs(testCase.input);
      const input = testCase.input;
      const isArray = input.nums !== undefined || input.numbers !== undefined;
      const args = isArray
        ? `new int[]{${values[0].join(",")}}${values[1] !== undefined ? `, ${values[1]}` : ""}`
        : values.map((value) => JSON.stringify(value)).join(", ");
      const output = functionName === "containsDuplicate" || input.s !== undefined ? "boolean" : input.n !== undefined ? "int" : functionName === "rob" ? "int" : "array";
      return `run(() -> new Solution().${functionName}(${args}), "${output}")`;
    }).join("; ");
    return `${code}\nclass Main { interface Call { Object get(); } static void run(Call call, String type) { Object value = call.get(); System.out.print("RESULT:"); if ("array".equals(type)) { int[] a = (int[]) value; System.out.print("["); for (int i = 0; i < a.length; i++) System.out.print((i > 0 ? "," : "") + a[i]); System.out.print("]"); } else System.out.print(value); System.out.println(); } public static void main(String[] args) { ${calls}; } }`;
  }
  throw new Error(`Unsupported language: ${language}`);
}