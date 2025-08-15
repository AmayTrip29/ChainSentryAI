import { GoogleGenAI, Type } from "@google/genai";
import { Blockchain, AuditFinding } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const auditFindingSchema = {
    type: Type.OBJECT,
    properties: {
        vulnerability: { type: Type.STRING, description: "A short, descriptive title of the vulnerability (e.g., 'Reentrancy', 'Integer Overflow')." },
        severity: { type: Type.STRING, description: "Severity level: 'Critical', 'High', 'Medium', 'Low', or 'Informational'." },
        description: { type: Type.STRING, description: "A clear, concise explanation of the vulnerability." },
        impact: { type: Type.STRING, description: "The potential impact if this vulnerability is exploited." },
        recommendation: { type: Type.STRING, description: "A detailed recommendation on how to fix the issue." },
        codeFix: { type: Type.STRING, description: "A code snippet showing the suggested fix. Use markdown for code." },
        location: {
            type: Type.OBJECT,
            properties: {
                lines: { type: Type.STRING, description: "The line range of the vulnerability, e.g., '15-20' or 'N/A'." },
            },
            required: ['lines']
        },
    },
    required: ['vulnerability', 'severity', 'description', 'impact', 'recommendation', 'codeFix', 'location']
};

const auditResponseSchema = {
    type: Type.ARRAY,
    items: auditFindingSchema
};

export const auditContract = async (code: string, blockchain: Blockchain): Promise<AuditFinding[]> => {
    const prompt = `
      You are an expert smart contract security auditor with deep knowledge of both ${blockchain} vulnerabilities. 
      Your task is to identify all potential security risks, from critical flaws to best-practice violations.
      Analyze the following smart contract code with the thoroughness of tools like Slither, Mythril, and advanced AI-driven semantic analysis.

      Your response MUST be a valid JSON array of finding objects. 
      If no vulnerabilities are found, return an empty array [].
      Do not include any text, explanations, or markdown formatting outside of the JSON array.
      
      Contract Code:
      ---
      ${code}
      ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: auditResponseSchema,
                temperature: 0.1, // Lower temperature for more deterministic, factual analysis
            },
        });

        const jsonText = response.text.trim();
        // The API should return valid JSON due to responseSchema, but we parse defensively.
        return JSON.parse(jsonText) as AuditFinding[];
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error("The provided API key is invalid. Please check your configuration.");
        }
        throw new Error("Failed to get a valid response from the auditor. The service may be overloaded or the contract is too complex.");
    }
};