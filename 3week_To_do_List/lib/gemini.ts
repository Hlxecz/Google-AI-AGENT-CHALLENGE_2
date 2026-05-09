import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Analyze task difficulty using Gemini API.
 * Returns one of: 'Easy', 'Medium', 'Hard'
 */
export async function analyzeTaskDifficulty(
  task: string
): Promise<"Easy" | "Medium" | "Hard"> {
  const prompt = `You are a task difficulty analyzer. Analyze the following task and categorize it as exactly one of: Easy, Medium, or Hard.

Rules:
- "Easy": Simple, routine tasks that take less than 30 minutes (e.g., "물 마시기", "이메일 확인")
- "Medium": Tasks requiring some focus or multiple steps, taking 30 min to 2 hours (e.g., "주간 회의 안건 정리", "장보기")
- "Hard": Complex tasks requiring deep focus, creativity, or extended time (e.g., "Q3 마케팅 성과 분석 리포트 작성", "프레젠테이션 준비")

Respond with ONLY one word: Easy, Medium, or Hard.

Task: "${task}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const text = response.text?.trim() ?? "";
    if (text === "Easy" || text === "Medium" || text === "Hard") {
      return text;
    }

    // Fallback: try to extract from response
    if (text.toLowerCase().includes("easy")) return "Easy";
    if (text.toLowerCase().includes("hard")) return "Hard";
    return "Medium";
  } catch (error) {
    console.error("Gemini API error:", error);
    // Fallback heuristic based on text length
    if (task.length < 10) return "Easy";
    if (task.length < 30) return "Medium";
    return "Hard";
  }
}
