import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


async function repairJson(badJson) {
    const repairPrompt = `
You are a JSON repair tool.

Fix the following JSON so that it EXACTLY matches this schema:

- matchScore: number (0–100)
- technicalQuestions: [{ question, intention, answer }]
- behavioralQuestions: [{ question, intention, answer }]
- skillGaps: [{ skill, severity: low | medium | high }]
- preparationPlan: [{ day, focus, tasks[] }]
- title: string

RULES:
- Convert strings into objects where needed
- Parse stringified JSON into real objects
- Add missing fields with valid dummy values
- DO NOT remove required fields
- RETURN ONLY JSON

INPUT:
${JSON.stringify(badJson)}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: repairPrompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
}

export const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ).min(3).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ).min(3).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ).min(2).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()).min(1)
        })
    ).min(3).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),

    title: z.string().describe("The title of the job for which the interview report is generated"),
});

function buildPrompt({ resume, selfDescription, jobDescription }) {
    return `
You are a strict JSON generator.

RETURN ONLY VALID JSON. NO TEXT. NO EXPLANATION.

STRICT RULES:
- Follow schema EXACTLY
- Do NOT add extra fields
- Do NOT rename fields
- Do NOT skip any field
- Arrays MUST NOT be empty
- technicalQuestions: minimum 3
- behavioralQuestions: minimum 3
- skillGaps: minimum 2
- preparationPlan: minimum 3 days
- Each object must contain ALL required keys

If unsure, generate realistic placeholder content.

Extract job title from job description.

INPUT:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: buildPrompt({ resume, selfDescription, jobDescription }),
                config: {
                    responseMimeType: "application/json"
                }
            });

            const rawText = response.text;
            console.log(`=== RAW AI RESULT (Attempt ${attempt}) ===`, rawText);

            let parsed = JSON.parse(rawText);

            try {
                return interviewReportSchema.parse(parsed);

            } catch (err) {
                console.log(" Trying repair...");

                const repaired = await repairJson(parsed);

                console.log("=== REPAIRED JSON ===", repaired);

                return interviewReportSchema.parse(repaired);
            }

        } catch (error) {
            console.error(`Attempt ${attempt} failed`, error.message);

            if (attempt === MAX_RETRIES) {
                throw new Error("AI failed even after repair attempts");
            }
        }
    }
}

export default generateInterviewReport;