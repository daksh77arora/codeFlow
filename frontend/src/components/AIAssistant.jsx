import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, XIcon, MessageCircleIcon, BugIcon, BookOpenIcon, LightbulbIcon, SendIcon } from 'lucide-react';
import { getAIHint, debugCode, explainCode } from '../lib/ai';

function AIAssistant({ problemTitle, userCode, isOpen, onClose }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hintLevel, setHintLevel] = useState(1);

    const handleGetHint = async () => {
        setIsLoading(true);
        setMessages(prev => [...prev, { type: 'user', text: `Get Hint (Level ${hintLevel})` }]);

        const hint = await getAIHint(problemTitle, userCode, hintLevel);
        setMessages(prev => [...prev, { type: 'ai', text: hint }]);
        setHintLevel(prev => Math.min(prev + 1, 3));
        setIsLoading(false);
    };

    const handleDebug = async () => {
        setIsLoading(true);
        setMessages(prev => [...prev, { type: 'user', text: 'Debug my code' }]);

        const debug = await debugCode(problemTitle, userCode);
        setMessages(prev => [...prev, { type: 'ai', text: debug }]);
        setIsLoading(false);
    };

    const handleExplain = async () => {
        setIsLoading(true);
        setMessages(prev => [...prev, { type: 'user', text: 'Explain my code' }]);

        const explanation = await explainCode(userCode);
        setMessages(prev => [...prev, { type: 'ai', text: explanation }]);
        setIsLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Motion.div
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                    className="fixed right-4 bottom-4 w-96 h-[600px] glass rounded-2xl shadow-2xl flex flex-col z-50"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-base-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-lg">AI Assistant</h3>
                        </div>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="text-center text-base-content/60 py-8">
                                <SparklesIcon className="w-12 h-12 mx-auto mb-3 text-primary/50" />
                                <p className="text-sm">Ask me for help!</p>
                                <p className="text-xs mt-1">Hints, debugging, or code explanations</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <Motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${msg.type === 'user'
                                            ? 'bg-primary text-primary-content'
                                            : 'bg-base-200'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </Motion.div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-base-200 p-3 rounded-lg">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="p-4 border-t border-base-300 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={handleGetHint}
                                disabled={isLoading || !userCode}
                                className="btn btn-sm btn-outline gap-1"
                            >
                                <LightbulbIcon className="w-4 h-4" />
                                Hint
                            </button>
                            <button
                                onClick={handleDebug}
                                disabled={isLoading || !userCode}
                                className="btn btn-sm btn-outline gap-1"
                            >
                                <BugIcon className="w-4 h-4" />
                                Debug
                            </button>
                            <button
                                onClick={handleExplain}
                                disabled={isLoading || !userCode}
                                className="btn btn-sm btn-outline gap-1"
                            >
                                <BookOpenIcon className="w-4 h-4" />
                                Explain
                            </button>
                        </div>
                        {!userCode && (
                            <p className="text-xs text-center text-base-content/60">
                                Write some code first to get AI help
                            </p>
                        )}
                    </div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
}

export default AIAssistant;
