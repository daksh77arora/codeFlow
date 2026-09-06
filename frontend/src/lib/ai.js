import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_CANDIDATES = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

const formatAIError = (error, fallbackMessage) => {
    const message = error?.message || "";

    if (message.includes("Missing VITE_GOOGLE_AI_API_KEY")) {
        return "AI is not configured. Set VITE_GOOGLE_AI_API_KEY in frontend .env and restart Vite.";
    }

    if (message.toLowerCase().includes("api key") || message.includes("401") || message.includes("403")) {
        return "AI request was rejected. Check Google AI API key validity and restrictions.";
    }

    if (message.toLowerCase().includes("quota") || message.includes("429")) {
        return "AI quota exceeded. Try again later or increase your Google AI quota.";
    }

    return fallbackMessage;
};

const generateText = async (prompt) => {
    if (!apiKey) {
        throw new Error("Missing VITE_GOOGLE_AI_API_KEY");
    }

    let lastError = null;

    for (const modelName of MODEL_CANDIDATES) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (text && text.trim()) {
                return text;
            }
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error("No response from AI model");
};

export const getAIHint = async (problemTitle, userCode, hintLevel = 1) => {
    try {
        const prompt = `You are a coding interview coach. The student is solving: "${problemTitle}"

Current code:
\`\`\`
${userCode || "No code written yet"}
\`\`\`

Provide a progressive hint (Level ${hintLevel}/3).
- Level 1: Vague hint about the approach
- Level 2: More specific about data structures
- Level 3: Almost give away the solution

Keep it concise (2-3 sentences). Don't write code.`;

        return await generateText(prompt);
    } catch (error) {
        console.error("AI Hint Error:", error);
        return formatAIError(error, "Unable to generate hint. Please try again.");
    }
};

export const debugCode = async (problemTitle, userCode, error) => {
    try {
        const prompt = `You are a debugging assistant. The student is solving: "${problemTitle}"

Code:
\`\`\`
${userCode}
\`\`\`

${error ? `Error: ${error}` : "The code isn't working as expected."}

Provide:
1. What's wrong (1 sentence)
2. Why it's wrong (1 sentence)
3. How to fix it (guide, don't write the full solution)

Keep it concise and educational.`;

        return await generateText(prompt);
    } catch (error) {
        console.error("AI Debug Error:", error);
        return formatAIError(error, "Unable to debug code. Please try again.");
    }
};

export const explainCode = async (userCode) => {
    try {
        const prompt = `Explain this code in simple terms:

\`\`\`
${userCode}
\`\`\`

Provide:
1. What it does (2-3 sentences)
2. Time complexity
3. Space complexity
4. One potential improvement

Keep it concise and clear.`;

        return await generateText(prompt);
    } catch (error) {
        console.error("AI Explain Error:", error);
        return formatAIError(error, "Unable to explain code. Please try again.");
    }
};

export const suggestApproach = async (problemTitle, problemDescription) => {
    try {
        const prompt = `Suggest an approach for this problem:

"${problemTitle}"
${problemDescription}

Provide:
1. Recommended algorithm/data structure
2. High-level approach (3-4 steps)
3. Expected time complexity

Don't write code. Keep it educational.`;

        return await generateText(prompt);
    } catch (error) {
        console.error("AI Suggest Error:", error);
        return formatAIError(error, "Unable to suggest approach. Please try again.");
    }
};
