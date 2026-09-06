import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";
import { submitCode } from "../lib/submissions";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    const text = typeof output === "string" ? output : JSON.stringify(output);
    return String(text || "")
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const visibleTestCases = (currentProblem.testCases || []).filter((testCase) => !testCase.hidden);
    const result = await executeCode(selectedLanguage, code, visibleTestCases);
    setIsRunning(false);

    // check if code executed successfully and matches expected output

    if (result.success) {
      const expectedOutput = currentProblem.testCases?.[0]?.expectedOutput;
      if (result.testResults) {
        setOutput({ ...result, testScope: "Visible tests" });
        if (result.allPassed) triggerConfetti();
        return;
      }
      const isCompileOnly = result.output?.startsWith("Compiled successfully.");
      const testsPassed = !isCompileOnly && expectedOutput !== undefined
        ? checkIfTestsPassed(result.output, expectedOutput)
        : null;
      const testMessage = isCompileOnly
        ? "Tests not run: add a main() function to execute this class template."
        : testsPassed === null
          ? "Tests not run: no expected output is configured."
          : testsPassed
            ? "Test result: passed"
            : `Test result: failed\nExpected: ${normalizeOutput(expectedOutput)}`;

      setOutput({ ...result, output: `${result.output}\n\n${testMessage}` });

      if (testsPassed === true) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else if (testsPassed === false) {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      setOutput(result);
      toast.error(result.error || "Code execution failed!");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput(null);

    try {
      let result;
      if (isSignedIn) {
        const response = await submitCode(currentProblemId, code, selectedLanguage);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["userStats"] }),
          queryClient.invalidateQueries({ queryKey: ["userSubmissions"] }),
          queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
        ]);
        const testResults = response.testResults?.results || [];
        result = {
          success: true,
          testResults,
          allPassed: response.submission?.status === "accepted",
          passedCount: response.submission?.testCasesPassed || 0,
          totalCount: response.submission?.testCasesTotal || testResults.length,
          output: response.message,
        };
      } else {
        result = await executeCode(selectedLanguage, code, currentProblem.testCases || []);
      }
      setOutput({ ...result, testScope: "All tests" });
      if (result.success && result.allPassed) {
        triggerConfetti();
        toast.success("All tests passed!");
      } else if (result.success) {
        toast.error(`${result.passedCount}/${result.totalCount} tests passed`);
      } else {
        toast.error(result.error || "Submission failed");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Submission failed";
      setOutput({ success: false, error: message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onSubmit={handleSubmit}
                  output={output}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
