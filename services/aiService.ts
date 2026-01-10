
import { GoogleGenAI } from "@google/genai";
import { PerformanceLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTeacherRemarks = async (subject: string, score: number, level: PerformanceLevel) => {
  try {
    const prompt = `You are a teacher in a Kenyan Primary/Junior Secondary school following the CBC curriculum. 
    The learner has achieved a score of ${score}% in ${subject}, which translates to "${level}".
    Write a constructive, professional 1-sentence teacher remark for the report card. 
    Mention a specific strength or area for improvement based on the score. 
    Keep it in Kenyan educational context. Do not include quotes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Consistently demonstrates commitment to learning.";
  } catch (error) {
    console.error("AI Remarks Error:", error);
    return "The learner is making steady progress in this area.";
  }
};
