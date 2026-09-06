import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        problemId: {
            type: String,
            required: true,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
        },
        code: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["accepted", "wrong_answer", "runtime_error", "time_limit_exceeded"],
            required: true,
        },
        testCasesPassed: {
            type: Number,
            required: true,
        },
        testCasesTotal: {
            type: Number,
            required: true,
        },
        executionTime: {
            type: Number, // in milliseconds
        },
        memoryUsed: {
            type: Number, // in KB
        },
        points: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
