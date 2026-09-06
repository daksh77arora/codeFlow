import { useEffect, useRef, useState } from 'react';

export const useTimer = (initialTime = 0, mode = 'stopwatch') => {
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        // Create audio element for alerts
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eafTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Ik2CBlou+3mn00QDFCn4/C2YxwGOJLX8sx5LAUkd8fw3ZBAC');

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => {
                    if (mode === 'countdown') {
                        if (prevTime <= 1) {
                            setIsRunning(false);
                            playAlert();
                            return 0;
                        }
                        return prevTime - 1;
                    } else {
                        return prevTime + 1;
                    }
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, mode]);

    const playAlert = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                // Ignore errors if audio can't play
            });
        }
    };

    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    const reset = () => {
        setIsRunning(false);
        setTime(initialTime);
    };

    const setTimerTime = (newTime) => {
        setTime(newTime);
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        time,
        isRunning,
        start,
        pause,
        reset,
        setTimerTime,
        formatTime: () => formatTime(time),
    };
};
