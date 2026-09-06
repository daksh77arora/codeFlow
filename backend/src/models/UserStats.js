import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        totalSubmissions: {
            type: Number,
            default: 0,
        },
        acceptedSubmissions: {
            type: Number,
            default: 0,
        },
        totalPoints: {
            type: Number,
            default: 0,
        },
        problemsSolved: {
            type: Number,
            default: 0,
        },
        solvedProblems: {
            type: [String], // Array of problem IDs
            default: [],
        },
        easyProblems: {
            type: Number,
            default: 0,
        },
        mediumProblems: {
            type: Number,
            default: 0,
        },
        hardProblems: {
            type: Number,
            default: 0,
        },
        averageTime: {
            type: Number, // in seconds
            default: 0,
        },
        rank: {
            type: Number,
            default: 0,
        },
        streak: {
            type: Number,
            default: 0,
        },
        lastSubmissionDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

const UserStats = mongoose.model("UserStats", userStatsSchema);

export default UserStats;
