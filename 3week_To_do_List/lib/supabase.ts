import { createClient } from "@supabase/supabase-js";

// --- Supabase Client ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Types ---
export interface Todo {
  id: string;
  task: string;
  difficulty: "Easy" | "Medium" | "Hard";
  is_completed: boolean;
  task_date: string; // YYYY-MM-DD
  created_at: string;
}

// --- CRUD Operations ---

/** Fetch todos for a specific date */
export async function fetchTodosByDate(taskDate: string): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("task_date", taskDate)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Todo[];
}

/** Fetch all todos (for calendar dot indicators) */
export async function fetchAllTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("id, task_date, is_completed")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Todo[];
}

/** Create a new todo */
export async function createTodo(
  task: string,
  difficulty: Todo["difficulty"],
  taskDate: string
): Promise<Todo> {
  const { data, error } = await supabase
    .from("todos")
    .insert([{ task, difficulty, is_completed: false, task_date: taskDate }])
    .select()
    .single();

  if (error) throw error;
  return data as Todo;
}

/** Toggle a todo's completion status */
export async function toggleTodoById(
  id: string,
  is_completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from("todos")
    .update({ is_completed })
    .eq("id", id);

  if (error) throw error;
}

/** Delete a todo */
export async function deleteTodoById(id: string): Promise<void> {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw error;
}

/*
  ============================================================
  Supabase SQL to create the 'todos' table:
  Run this in the Supabase SQL Editor.
  ============================================================

  CREATE TABLE IF NOT EXISTS todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    is_completed BOOLEAN DEFAULT false,
    task_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Allow anonymous access (no auth required for this demo)
  ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow all access" ON todos
    FOR ALL
    USING (true)
    WITH CHECK (true);

  ============================================================
*/
