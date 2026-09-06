import Submission from "../models/Submission.js";
import UserStats from "../models/UserStats.js";
import { executeTestCases } from "./executionController.js";

// Points based on difficulty
const POINTS = {
    easy: 10,
    medium: 20,
    hard: 30,
};

export async function submitCode(req, res) {
    try {
        const { problemId, code, language, difficulty, testCases } = req.body;
        const userId = req.user._id;

        if (!problemId || !code || !language) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!testCases || testCases.length === 0) {
            return res.status(400).json({ message: "No test cases provided" });
        }

        // Run test cases
        const execution = await executeTestCases(language, code, testCases);
        if (!execution.success) {
            return res.status(400).json({ message: execution.error || "Code execution failed", output: execution.output || "" });
        }

        const testResults = {
            passedTests: execution.passedCount,
            totalTests: execution.totalCount,
            avgExecutionTime: 0,
            results: execution.testResults,
        };

        const allPassed = testResults.passedTests === testResults.totalTests;
        const status = allPassed ? "accepted" : "wrong_answer";

        // Calculate points
        let points = 0;
        if (allPassed) {
            points = POINTS[difficulty] || 10;

            // Bonus for first submission
            const previousSubmissions = await Submission.countDocuments({
                userId,
                problemId,
            });
            if (previousSubmissions === 0) {
                points += 5; // First submission bonus
            }
        }

        // Create submission record
        const submission = await Submission.create({
            userId,
            problemId,
            sessionId: req.body.sessionId,
            code,
            language,
            status,
            testCasesPassed: testResults.passedTests,
            testCasesTotal: testResults.totalTests,
            executionTime: testResults.avgExecutionTime,
            points,
        });

        // Update user stats
        await updateUserStats(userId, problemId, allPassed, points, difficulty);

        res.status(201).json({
            submission,
            testResults,
            message: allPassed ? "All test cases passed!" : "Some test cases failed",
        });
    } catch (error) {
        console.error("Error in submitCode:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function runTestCases(code, language, testCases) {
    let passedTests = 0;
    let totalTests = testCases.length;
    let totalTime = 0;
    const results = [];

    for (const testCase of testCases) {
        try {
            // Execute code with test input
            const input = typeof testCase.input === "string"
                ? testCase.input
                : JSON.stringify(testCase.input);
            const result = await executeCode(language, code, input);

            // Compare output
            const passed = result.stderr
                ? false
                : outputsMatch(result.output, testCase.expectedOutput);

            if (passed) passedTests++;
            totalTime += result.executionTime || 0;

            results.push({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: result.output,
                error: result.stderr || undefined,
                passed,
                hidden: testCase.hidden,
            });
        } catch (error) {
            results.push({
                input: testCase.input,
                error: error.message,
                passed: false,
            });
        }
    }

    return {
        passedTests,
        totalTests,
        avgExecutionTime: totalTests > 0 ? totalTime / totalTests : 0,
        results,
    };
}

function outputsMatch(actualOutput, expectedOutput) {
    const actual = String(actualOutput ?? "").trim();
    const expected = String(
        typeof expectedOutput === "string" ? expectedOutput : JSON.stringify(expectedOutput)
    ).trim();

    try {
        return JSON.stringify(JSON.parse(actual)) === JSON.stringify(JSON.parse(expected));
    } catch {
        return actual.replace(/\s+/g, " ") === expected.replace(/\s+/g, " ");
    }
}

async function updateUserStats(userId, problemId, solved, points, difficulty) {
    let stats = await UserStats.findOne({ userId });

    if (!stats) {
        stats = await UserStats.create({ userId });
    }

    stats.totalSubmissions += 1;

    if (solved) {
        stats.acceptedSubmissions += 1;
        stats.totalPoints += points;

        // Check if problem is newly solved
        if (!stats.solvedProblems.includes(problemId)) {
            stats.problemsSolved += 1;
            stats.solvedProblems.push(problemId);

            // Update difficulty counts
            if (difficulty === "easy") stats.easyProblems += 1;
            else if (difficulty === "medium") stats.mediumProblems += 1;
            else if (difficulty === "hard") stats.hardProblems += 1;
        }

        // Update streak
        const today = new Date().setHours(0, 0, 0, 0);
        const lastSubmission = stats.lastSubmissionDate
            ? new Date(stats.lastSubmissionDate).setHours(0, 0, 0, 0)
            : null;

        if (!lastSubmission || today - lastSubmission === 86400000) {
            // 1 day difference
            stats.streak += 1;
        } else if (today - lastSubmission > 86400000) {
            stats.streak = 1; // Reset streak
        }
    }

    stats.lastSubmissionDate = new Date();
    await stats.save();

    // Update global ranks
    await updateRanks();

    return stats;
}

async function updateRanks() {
    const allStats = await UserStats.find().sort({ totalPoints: -1, problemsSolved: -1 });

    for (let i = 0; i < allStats.length; i++) {
        allStats[i].rank = i + 1;
        await allStats[i].save();
    }
}

export async function getUserSubmissions(req, res) {
    try {
        const userId = req.user._id;

        const submissions = await Submission.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ submissions });
    } catch (error) {
        console.error("Error in getUserSubmissions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getUserStats(req, res) {
    try {
        const userId = req.user._id;

        let stats = await UserStats.findOne({ userId });

        if (!stats) {
            stats = await UserStats.create({ userId });
        }

        res.status(200).json({ stats });
    } catch (error) {
        console.error("Error in getUserStats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
