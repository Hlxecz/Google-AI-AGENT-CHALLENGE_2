import {
  fetchTodosByDate,
  fetchAllTodos,
  createTodo,
  toggleTodoById,
  deleteTodoById,
} from "@/lib/supabase";
import { analyzeTaskDifficulty } from "@/lib/gemini";
import { type NextRequest } from "next/server";

/**
 * GET /api/todos?date=YYYY-MM-DD
 * If no date param, returns all todos (minimal fields for calendar).
 */
export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date");

    if (date) {
      const todos = await fetchTodosByDate(date);
      return Response.json({ todos });
    } else {
      const todos = await fetchAllTodos();
      return Response.json({ todos });
    }
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return Response.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/todos
 * Body: { task: string, task_date: string }
 * Automatically analyzes difficulty via Gemini API.
 */
export async function POST(request: Request) {
  try {
    const { task, task_date } = await request.json();

    if (!task || typeof task !== "string") {
      return Response.json({ error: "Task is required" }, { status: 400 });
    }
    if (!task_date || typeof task_date !== "string") {
      return Response.json(
        { error: "task_date is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    // Analyze difficulty with Gemini
    const difficulty = await analyzeTaskDifficulty(task);

    // Insert into Supabase
    const todo = await createTodo(task, difficulty, task_date);

    return Response.json({ todo }, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return Response.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/todos
 * Body: { id: string, is_completed: boolean }
 */
export async function PATCH(request: Request) {
  try {
    const { id, is_completed } = await request.json();

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    await toggleTodoById(id, is_completed);
    return Response.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/todos error:", error);
    return Response.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/todos
 * Body: { id: string }
 */
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    await deleteTodoById(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/todos error:", error);
    return Response.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
