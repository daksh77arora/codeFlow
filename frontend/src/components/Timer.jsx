import { ClockIcon, PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';
import { useTimer } from '../hooks/useTimer';

function Timer({ mode: initialMode = 'stopwatch' }) {
    const [mode, setMode] = useState(initialMode);
    const [countdownMinutes, setCountdownMinutes] = useState(30);

    const { time, isRunning, start, pause, reset, setTimerTime, formatTime } = useTimer(
        mode === 'countdown' ? countdownMinutes * 60 : 0,
        mode
    );

    const handleModeChange = (newMode) => {
        reset();
        setMode(newMode);
        if (newMode === 'countdown') {
            setTimerTime(countdownMinutes * 60);
        } else {
            setTimerTime(0);
        }
    };

    const handleCountdownChange = (minutes) => {
        setCountdownMinutes(minutes);
        if (mode === 'countdown' && !isRunning) {
            setTimerTime(minutes * 60);
        }
    };

    return (
        <div className="glass rounded-2xl p-6 shadow-lg animate-slide-down">
            <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Timer</h3>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleModeChange('stopwatch')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${mode === 'stopwatch'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-base-200 hover:bg-base-300'
                        }`}
                >
                    Stopwatch
                </button>
                <button
                    onClick={() => handleModeChange('countdown')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${mode === 'countdown'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-base-200 hover:bg-base-300'
                        }`}
                >
                    Countdown
                </button>
            </div>

            {/* Countdown Time Selector */}
            {mode === 'countdown' && !isRunning && (
                <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Set Time (minutes)</label>
                    <div className="flex gap-2">
                        {[5, 15, 30, 45, 60].map((minutes) => (
                            <button
                                key={minutes}
                                onClick={() => handleCountdownChange(minutes)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${countdownMinutes === minutes
                                    ? 'bg-secondary text-white'
                                    : 'bg-base-200 hover:bg-base-300'
                                    }`}
                            >
                                {minutes}m
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Time Display */}
            <div className="text-center mb-6">
                <div className="text-5xl font-bold font-mono gradient-text-animated">
                    {formatTime()}
                </div>
                <div className="text-sm text-base-content/60 mt-2">
                    {mode === 'countdown' ? 'Time Remaining' : 'Elapsed Time'}
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
                {!isRunning ? (
                    <button
                        onClick={start}
                        className="btn btn-primary btn-circle btn-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        aria-label="Start timer"
                    >
                        <PlayIcon className="w-6 h-6" />
                    </button>
                ) : (
                    <button
                        onClick={pause}
                        className="btn btn-warning btn-circle btn-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        aria-label="Pause timer"
                    >
                        <PauseIcon className="w-6 h-6" />
                    </button>
                )}
                <button
                    onClick={reset}
                    className="btn btn-outline btn-circle btn-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    aria-label="Reset timer"
                >
                    <RotateCcwIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Progress Bar for Countdown */}
            {mode === 'countdown' && (
                <div className="mt-4">
                    <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                            style={{
                                width: `${((countdownMinutes * 60 - time) / (countdownMinutes * 60)) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Timer;
