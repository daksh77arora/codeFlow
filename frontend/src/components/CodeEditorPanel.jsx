import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, SendIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  isSubmitting,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onSubmit,
  output,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select className="select select-sm" value={selectedLanguage} onChange={onLanguageChange}>
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {output?.testResults && (
            <span className={`badge ${output.allPassed ? "badge-success" : "badge-error"} self-center`}>
              {output.allPassed ? "Passed" : "Failed"} {output.passedCount}/{output.totalCount}
            </span>
          )}
          <button className="btn btn-ghost btn-sm gap-2" disabled={isRunning} onClick={onRunCode}>
            {isRunning ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Run Visible Tests
              </>
            )}
          </button>

          <button className="btn btn-success btn-sm gap-2" disabled={isSubmitting || isRunning} onClick={onSubmit}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <SendIcon className="size-4" />
                Submit All Tests
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
