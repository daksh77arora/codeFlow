import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { submitCode } from "../lib/submissions";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { CheckIcon, CopyIcon, Loader2Icon, LogOutIcon, PhoneOffIcon, SparklesIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import AIAssistant from "../components/AIAssistant";
import SubmissionResults from "../components/SubmissionResults";
import toast from "react-hot-toast";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

import Whiteboard from "../components/Whiteboard"; // [NEW]

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [submissionResults, setSubmissionResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("code"); // [NEW]
  const [linkCopied, setLinkCopied] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const { mutate: joinSession } = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSession(id, { onSuccess: refetch });

    // remove the joinSessionMutation, refetch from dependencies to avoid infinite loop
  }, [session, user, loadingSession, isHost, isParticipant, id, joinSession, refetch]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const visibleTestCases = (problemData?.testCases || []).filter((testCase) => !testCase.hidden);
    const result = await executeCode(selectedLanguage, code, visibleTestCases);
    setIsRunning(false);
    if (!result.success) {
      setOutput(result);
      toast.error(result.error || "Code execution failed!");
      return;
    }

    const expectedOutput = problemData?.testCases?.[0]?.expectedOutput;
    const isCompileOnly = result.output?.startsWith("Compiled successfully.");
    let testMessage = "Tests not run: no expected output is configured.";
    let testsPassed = null;

    if (isCompileOnly) {
      testMessage = "Tests not run: add a main() function to execute this class template.";
    } else if (expectedOutput !== undefined) {
      const actual = String(result.output || "").trim().replace(/\s+/g, " ");
      const expected = String(
        typeof expectedOutput === "string" ? expectedOutput : JSON.stringify(expectedOutput)
      ).trim().replace(/\s+/g, " ");
      testsPassed = actual === expected;
      testMessage = testsPassed ? "Test result: passed" : `Test result: failed\nExpected: ${expected}`;
    }

    setOutput({ ...result, output: `${result.output}\n\n${testMessage}` });
    if (testsPassed === true) toast.success("All tests passed!");
    if (testsPassed === false) toast.error("Tests failed. Check the output panel.");
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/session/${id}`);
    setLinkCopied(true);
    toast.success("Session link copied");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const problemId = session?.problem ? Object.keys(PROBLEMS).find(
        key => PROBLEMS[key].title === session.problem
      ) : null;

      if (!problemId) {
        toast.error("Problem not found");
        return;
      }

      const results = await submitCode(problemId, code, selectedLanguage, id);
      setSubmissionResults(results);
      setShowResults(true);

      if (results.submission.status === "accepted") {
        toast.success(`Accepted! +${results.submission.points} points`);
      } else {
        toast.error(`${results.submission.testCasesPassed}/${results.submission.testCasesTotal} test cases passed`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  {/* HEADER SECTION */}
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base-content/60 mt-1">{problemData.category}</p>
                        )}
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                        <button className="btn btn-outline btn-sm mt-3 gap-2" onClick={handleCopyLink}>
                          {linkCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                          {linkCopied ? "Copied" : "Copy invite link"}
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`badge badge-lg ${getDifficultyBadgeClass(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty.slice(0, 1).toUpperCase() +
                            session?.difficulty.slice(1) || "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="badge badge-ghost badge-lg">Completed</span>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="p-6 space-y-6">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                        <div className="space-y-3 text-base leading-relaxed">
                          <p className="text-base-content/90">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-base-content/90">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

                        <div className="space-y-4">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-sm">{idx + 1}</span>
                                <p className="font-semibold text-base-content">Example {idx + 1}</p>
                              </div>
                              <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-primary font-bold min-w-[70px]">
                                    Input:
                                  </span>
                                  <span>{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-secondary font-bold min-w-[70px]">
                                    Output:
                                  </span>
                                  <span>{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-2">
                                    <span className="text-base-content/60 font-sans text-xs">
                                      <span className="font-semibold">Explanation:</span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                        <ul className="space-y-2 text-base-content/90">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <code className="text-sm">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <div className="flex flex-col h-full">
                      {/* TABS */}
                      <div className="flex border-b border-base-300 bg-base-100">
                        <button
                          className={`px-6 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "code"
                            ? "border-primary text-primary"
                            : "border-transparent text-base-content/60 hover:text-base-content"
                            }`}
                          onClick={() => setActiveTab("code")}
                        >
                          Code Editor
                        </button>
                        <button
                          className={`px-6 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "whiteboard"
                            ? "border-primary text-primary"
                            : "border-transparent text-base-content/60 hover:text-base-content"
                            }`}
                          onClick={() => setActiveTab("whiteboard")}
                        >
                          Whiteboard
                        </button>
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 relative overflow-hidden">
                        {activeTab === "code" ? (
                          <CodeEditorPanel
                            selectedLanguage={selectedLanguage}
                            code={code}
                            isRunning={isRunning}
                            isSubmitting={isSubmitting}
                            onLanguageChange={handleLanguageChange}
                            onCodeChange={(value) => setCode(value)}
                            onRunCode={handleRunCode}
                            onSubmit={handleSubmit}
                            output={output}
                          />
                        ) : (
                          <Whiteboard roomId={id} />
                        )}
                      </div>
                    </div>
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  {/* Output Panel - Only show when code tab is active */}
                  <Panel defaultSize={30} minSize={15} className={activeTab === 'whiteboard' ? 'hidden' : ''}>
                    <OutputPanel output={output} />
                    {/* When whiteboard is active, we still render this panel but hide it to maintain PanelGroup structure or we could conditionally render the Panel itself, but react-resizable-panels might prefer stable structure.
                        Better approach: if activeTab is whiteboard, we can either hide this panel or let it be.
                        Actually, let's keep it visible so user can see output while drawing? No, usually whiteboard takes space.
                        Let's just hide the content or collapse it.
                        For now, let's just conditionally render the content or keep it as is.
                        Let's try to keeping the Panel structure but empty/hidden content if in whiteboard mode to maximize space?
                        Actually proper way with resizable panels:
                        If we want full height whiteboard, we should probably change the layout.
                    */}
                    {/*
                      Re-thinking: The CodeEditorPanel was inside a vertical group with OutputPanel.
                      If I put tabs *outside* this vertical group, then I can swap the whole vertical group (Code+Output) with Whiteboard.

                      The structure in the file is:
                      Panel (Bottom-Left)
                        PanelGroup (Vertical)
                          Panel (Code Editor)
                          Handle
                          Panel (Output)

                      If I want tabs to switch between "Code Environment" (Editor + Output) and "Whiteboard", the tabs should be at the top of the "Bottom-Left" Panel.
                     */}
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* AI Assistant Floating Button */}
      <button
        onClick={() => setShowAIAssistant(!showAIAssistant)}
        className="fixed bottom-6 right-6 btn btn-primary btn-circle btn-lg shadow-2xl z-40"
        title="AI Assistant"
      >
        <SparklesIcon className="w-6 h-6" />
      </button>

      {/* AI Assistant Component */}
      <AIAssistant
        problemTitle={session?.problem || ""}
        userCode={code}
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />

      {/* Submission Results Modal */}
      <SubmissionResults
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={submissionResults}
      />
    </div>
  );
}

export default SessionPage;
