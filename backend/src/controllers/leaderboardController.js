import UserStats from "../models/UserStats.js";

export async function getLeaderboard(req, res) {
    try {
        const { timeframe = "all" } = req.query;

        let query = {};

        // Filter by timeframe
        if (timeframe === "daily") {
            const dayAgo = new Date();
            dayAgo.setDate(dayAgo.getDate() - 1);
            query.lastSubmissionDate = { $gte: dayAgo };
        } else if (timeframe === "weekly") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query.lastSubmissionDate = { $gte: weekAgo };
        } else if (timeframe === "monthly") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            query.lastSubmissionDate = { $gte: monthAgo };
        }

        const leaderboard = await UserStats.find(query)
            .populate("userId", "name email profileImage clerkId")
            .sort({ totalPoints: -1, problemsSolved: -1 })
            .limit(100);

        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error("Error in getLeaderboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
