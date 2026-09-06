import axios from "axios";
import { PROBLEMS } from "../data/problems";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const submitCode = async (problemId, code, language, sessionId) => {
    const problem = PROBLEMS[problemId];

    const response = await axios.post(
        `${API_URL}/submissions/submit`,
        {
            problemId,
            code,
            language,
            sessionId,
            difficulty: problem.difficulty,
            testCases: problem.testCases || []
        },
        { withCredentials: true }
    );
    return response.data;
};

export const getUserSubmissions = async () => {
    const response = await axios.get(`${API_URL}/submissions/user`, {
        withCredentials: true,
    });
    return response.data.submissions;
};

export const getUserStats = async () => {
    const response = await axios.get(`${API_URL}/submissions/stats`, {
        withCredentials: true,
    });
    return response.data.stats;
};

export const getLeaderboard = async (timeframe = "all") => {
    const response = await axios.get(`${API_URL}/leaderboard?timeframe=${timeframe}`, {
        withCredentials: true,
    });
    return response.data.leaderboard;
};
