function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className="text-base-content/50 text-sm">Click "Run Code" to see the output here...</p>
        ) : output.testResults ? (
          <div>
            <p className={`font-bold mb-3 ${output.allPassed ? "text-success" : "text-error"}`}>
              {output.testScope ? `${output.testScope}: ` : ""}
              {output.allPassed ? "passed" : "failed"} ({output.passedCount}/{output.totalCount})
            </p>
            {output.testResults.map((test, index) => (
              <div key={index} className="mb-3 border-b border-base-300 pb-3 text-sm">
                <p className={test.passed ? "text-success" : "text-error"}>
                  Test {index + 1}: {test.passed ? "passed" : "failed"}
                </p>
                <p>Expected: {JSON.stringify(test.expectedOutput)}</p>
                <p>Actual: {JSON.stringify(test.actualOutput)}</p>
                {test.error && <p className="text-error">{test.error}</p>}
              </div>
            ))}
          </div>
        ) : output.success ? (
          <pre className="text-sm font-mono text-success whitespace-pre-wrap">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-error whitespace-pre-wrap">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
