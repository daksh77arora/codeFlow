/**
 * Code execution via Judge0 CE public API (https://ce.judge0.com).
 * Free, no API key required, supports JS / Python / C++ / Java.
 * Docs: https://ce.judge0.com/
 */

const JUDGE0_API = "https://ce.judge0.com";
const TIMEOUT_MS = 20000;

/**
 * Judge0 CE language IDs
 * Full list: GET /languages on the API
 */
const LANGUAGE_IDS = {
  javascript: 93,  // Node.js 18.15.0
  python: 92,      // Python 3.11.2
  cpp: 76,         // C++ (Clang 7.0.1)
  java: 91,        // Java (OpenJDK 17.0.6)
};

/**
 * Execute arbitrary source code via Judge0.
 *
 * @param {string} language  - One of: javascript | python | cpp | java
 * @param {string} code      - Source code to execute
 * @param {string} [input]   - Optional stdin input
 * @returns {{ output: string, stderr: string, code: number }}
 */
export const executeCode = async (language, code, input = "") => {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  // Step 1: Submit the code
  const submitRes = await fetchWithTimeout(
    `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
        stdin: typeof input === "string" ? input : JSON.stringify(input),
        cpu_time_limit: 5,
        wall_time_limit: 10,
      }),
    }
  );

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`Judge0 submit error ${submitRes.status}: ${text}`);
  }

  const result = await submitRes.json();
  return parseResult(result);
};

function parseResult(result) {
  const statusId = result.status?.id;
  const stdout = result.stdout || "";
  const stderr =
    result.stderr ||
    result.compile_output ||
    "";

  // Status IDs: 3 = Accepted, 6 = Compilation Error, 5 = TLE, 7-12 = Runtime errors
  if (statusId === 3) {
    // Accepted / success
    return { output: stdout, stderr: "", code: 0 };
  }

  if (statusId === 5) {
    return { output: stdout, stderr: "Execution timed out (5s CPU limit)", code: 1 };
  }

  if (statusId === 6) {
    return {
      output: stdout,
      stderr: result.compile_output || "Compilation error",
      code: 1,
    };
  }

  // Runtime error or anything else
  return {
    output: stdout,
    stderr: stderr || result.status?.description || `Execution failed (status ${statusId})`,
    code: statusId !== 3 ? 1 : 0,
  };
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Judge0 request timed out after 20 seconds");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
