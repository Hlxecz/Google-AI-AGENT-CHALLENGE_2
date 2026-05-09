import { analyzeTaskDifficulty } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { task } = await request.json();

    if (!task || typeof task !== "string") {
      return Response.json(
        { error: "Task text is required" },
        { status: 400 }
      );
    }

    const difficulty = await analyzeTaskDifficulty(task);
    return Response.json({ difficulty });
  } catch (error) {
    console.error("Analyze API error:", error);
    return Response.json(
      { error: "Failed to analyze task difficulty" },
      { status: 500 }
    );
  }
}
