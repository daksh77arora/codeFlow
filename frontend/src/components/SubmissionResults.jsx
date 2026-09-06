import { motion as Motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon, TrophyIcon, TrendingUpIcon, XIcon } from 'lucide-react';

function SubmissionResults({ isOpen, onClose, results }) {
    if (!results) return null;

    const { submission, testResults, message } = results;
    const allPassed = submission.status === 'accepted';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className={`p-6 border-b border-base-300 ${allPassed ? 'bg-success/10' : 'bg-error/10'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {allPassed ? (
                                        <CheckCircleIcon className="w-10 h-10 text-success" />
                                    ) : (
                                        <XCircleIcon className="w-10 h-10 text-error" />
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {allPassed ? 'Accepted!' : 'Wrong Answer'}
                                        </h2>
                                        <p className="text-sm text-base-content/60">{message}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">
                                    {submission.testCasesPassed}/{submission.testCasesTotal}
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">Test Cases</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-secondary">
                                    {submission.executionTime || 0}ms
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">Runtime</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-accent">
                                    +{submission.points}
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">Points</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-success">
                                    {submission.language.toUpperCase()}
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">Language</div>
                            </div>
                        </div>

                        {/* Test Results */}
                        <div className="p-6 border-t border-base-300 max-h-96 overflow-y-auto">
                            <h3 className="font-bold text-lg mb-4">Test Results</h3>
                            <div className="space-y-3">
                                {testResults.results.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-lg border ${result.passed
                                                ? 'bg-success/5 border-success/20'
                                                : 'bg-error/5 border-error/20'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold">
                                                Test Case {idx + 1} {result.hidden && '(Hidden)'}
                                            </span>
                                            {result.passed ? (
                                                <CheckCircleIcon className="w-5 h-5 text-success" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-error" />
                                            )}
                                        </div>
                                        {!result.hidden && (
                                            <div className="text-sm space-y-1">
                                                <div>
                                                    <span className="text-base-content/60">Input: </span>
                                                    <code className="text-primary">{JSON.stringify(result.input)}</code>
                                                </div>
                                                <div>
                                                    <span className="text-base-content/60">Expected: </span>
                                                    <code className="text-success">{JSON.stringify(result.expectedOutput)}</code>
                                                </div>
                                                {!result.passed && (
                                                    <div>
                                                        <span className="text-base-content/60">Got: </span>
                                                        <code className="text-error">{JSON.stringify(result.actualOutput)}</code>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-base-300 flex justify-end gap-3">
                            <button onClick={onClose} className="btn btn-primary">
                                Close
                            </button>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default SubmissionResults;
