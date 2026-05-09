"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles, Trash2, Clock, CheckCircle2, Loader2,
  ChevronLeft, ChevronRight, CalendarDays, AlertCircle,
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";

interface TodoItem {
  id: string;
  task: string;
  difficulty: Difficulty;
  is_completed: boolean;
  task_date: string;
  created_at: string;
}

// Minimal shape returned by GET /api/todos (no date param)
interface TodoSummary {
  id: string;
  task_date: string;
  is_completed: boolean;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; className: string; icon: string; time: string }> = {
  Easy:   { label: "쉬움",   className: "tag-easy",   icon: "✓",  time: "Est. 15min" },
  Medium: { label: "보통",   className: "tag-medium", icon: "⚡", time: "Est. 45min" },
  Hard:   { label: "어려움", className: "tag-hard",   icon: "🔥", time: "Est. 2h 30m" },
};

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function todayKey(): string { return dateKey(new Date()); }

const WEEKDAYS = ["일","월","화","수","목","금","토"];
const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

interface ToDoListProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ToDoList({ inputRef }: ToDoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [allSummaries, setAllSummaries] = useState<TodoSummary[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedKey = dateKey(selectedDate);
  const pendingCount = todos.filter((t) => !t.is_completed).length;

  // Fetch todos for selected date
  const fetchTodosForDate = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/todos?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTodos(data.todos ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "데이터를 불러오지 못했습니다");
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all summaries for calendar dots
  const fetchSummaries = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) return;
      const data = await res.json();
      setAllSummaries(data.todos ?? []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchTodosForDate(selectedKey); }, [selectedKey, fetchTodosForDate]);
  useEffect(() => { fetchSummaries(); }, [fetchSummaries]);

  // Build a map from summaries for calendar
  const summaryMap: Record<string, { total: number; completed: number }> = {};
  allSummaries.forEach((s) => {
    if (!summaryMap[s.task_date]) summaryMap[s.task_date] = { total: 0, completed: 0 };
    summaryMap[s.task_date].total++;
    if (s.is_completed) summaryMap[s.task_date].completed++;
  });

  const addTodo = async () => {
    const task = inputValue.trim();
    if (!task) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, task_date: selectedKey }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = await res.json();
      setTodos((prev) => [data.todo, ...prev]);
      setAllSummaries((prev) => [...prev, { id: data.todo.id, task_date: selectedKey, is_completed: false }]);
      setInputValue("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "할 일 추가에 실패했습니다");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleTodo = async (id: string, currentState: boolean) => {
    // Optimistic update
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, is_completed: !currentState } : t));
    setAllSummaries((prev) => prev.map((s) => s.id === id ? { ...s, is_completed: !currentState } : s));
    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_completed: !currentState }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert
      setTodos((prev) => prev.map((t) => t.id === id ? { ...t, is_completed: currentState } : t));
      setAllSummaries((prev) => prev.map((s) => s.id === id ? { ...s, is_completed: currentState } : s));
    }
  };

  const deleteTodo = async (id: string) => {
    const prev = todos;
    setTodos((p) => p.filter((t) => t.id !== id));
    setAllSummaries((p) => p.filter((s) => s.id !== id));
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setTodos(prev); // revert
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAnalyzing) addTodo();
  };

  const isToday = selectedKey === todayKey();
  const dateLabel = isToday ? "오늘의 작업" : `${selectedDate.getMonth()+1}월 ${selectedDate.getDate()}일의 작업`;

  return (
    <section id="tasks" className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <CalendarPanel
              selectedDate={selectedDate} calendarMonth={calendarMonth}
              setCalendarMonth={setCalendarMonth} onSelectDate={setSelectedDate}
              summaryMap={summaryMap}
            />
          </div>

          {/* Todo List */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} style={{ color: "var(--accent-indigo)" }} />
                <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{dateLabel}</h2>
              </div>
              <span className="px-3 py-1 text-xs font-medium rounded-full"
                style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-secondary)" }}>
                {pendingCount} Tasks Pending
              </span>
            </div>

            {/* Input */}
            <div className="glass rounded-xl p-3 mb-4 flex items-center gap-3" style={{ borderColor: "rgba(108,92,231,0.2)" }}>
              <Sparkles size={18} style={{ color: "var(--accent-indigo)", flexShrink: 0 }} />
              <input ref={inputRef} type="text" value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="새로운 할 일을 입력하세요..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: "var(--text-primary)", caretColor: "var(--accent-indigo)" }}
                disabled={isAnalyzing} />
              <button onClick={addTodo} disabled={isAnalyzing || !inputValue.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: "var(--gradient-button)", color: "white" }}>
                {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isAnalyzing ? "분석 중..." : "AI 추가"}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="glass rounded-xl p-4 mb-4 flex items-center gap-3" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                <AlertCircle size={18} style={{ color: "#ef4444" }} />
                <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>
              </div>
            )}

            {/* List */}
            <div className="space-y-3 stagger-children">
              {isLoading ? (
                <div className="glass rounded-xl p-8 text-center">
                  <Loader2 size={28} className="mx-auto mb-3 animate-spin" style={{ color: "var(--accent-indigo)" }} />
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>불러오는 중...</p>
                </div>
              ) : todos.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center" style={{ borderStyle: "dashed" }}>
                  <CalendarDays size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>이 날의 할 일이 없습니다</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>위 입력창에서 새로운 할 일을 추가해보세요</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <TodoItemCard key={todo.id} todo={todo}
                    onToggle={() => toggleTodo(todo.id, todo.is_completed)}
                    onDelete={() => deleteTodo(todo.id)} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <ProgressPanel todos={todos} />
            <FeatureCards />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== CALENDAR ========== */

function CalendarPanel({ selectedDate, calendarMonth, setCalendarMonth, onSelectDate, summaryMap }: {
  selectedDate: Date; calendarMonth: Date;
  setCalendarMonth: (d: Date) => void; onSelectDate: (d: Date) => void;
  summaryMap: Record<string, { total: number; completed: number }>;
}) {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; inMonth: boolean; date: Date }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push({ day: d, inMonth: false, date: new Date(year, month - 1, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, date: new Date(year, month, d) });
  }
  const rem = 7 - (cells.length % 7);
  if (rem < 7) for (let d = 1; d <= rem; d++) {
    cells.push({ day: d, inMonth: false, date: new Date(year, month + 1, d) });
  }

  const todayStr = todayKey();
  const selectedStr = dateKey(selectedDate);

  return (
    <div className="glass rounded-xl p-4 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" aria-label="Previous month">
          <ChevronLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{year}년 {MONTH_NAMES[month]}</h3>
        <button onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer" aria-label="Next month">
          <ChevronRight size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0 mb-1">
        {WEEKDAYS.map((wd, i) => (
          <div key={wd} className="text-center text-xs py-1 font-medium"
            style={{ color: i === 0 ? "#ef4444" : i === 6 ? "#6c5ce7" : "var(--text-muted)" }}>{wd}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {cells.map((cell, idx) => {
          const key = dateKey(cell.date);
          const isSelected = key === selectedStr;
          const isToday = key === todayStr;
          const info = summaryMap[key];
          const hasTodos = info && info.total > 0;
          const allDone = hasTodos && info.completed === info.total;

          return (
            <button key={idx} onClick={() => {
              onSelectDate(cell.date);
              if (cell.date.getMonth() !== month) setCalendarMonth(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
            }}
              className="relative w-full aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200 cursor-pointer group"
              style={{
                background: isSelected ? "var(--gradient-button)" : isToday ? "rgba(108,92,231,0.15)" : "transparent",
                color: !cell.inMonth ? "var(--text-muted)" : isSelected ? "white" : "var(--text-primary)",
                fontWeight: isToday || isSelected ? 700 : 400, fontSize: "13px",
              }}>
              <span>{cell.day}</span>
              {hasTodos && (
                <span className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: allDone ? "#34d399" : "#fbbf24" }} />
              )}
              {!isSelected && <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(255,255,255,0.05)" }} />}
            </button>
          );
        })}
      </div>

      <button onClick={() => { const now = new Date(); onSelectDate(now); setCalendarMonth(now); }}
        className="w-full mt-3 py-2 text-xs font-medium rounded-lg cursor-pointer"
        style={{ background: "rgba(108,92,231,0.1)", color: "var(--accent-indigo)", border: "1px solid rgba(108,92,231,0.2)" }}>
        오늘로 이동
      </button>
      <div className="flex items-center gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} />
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>완료</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} />
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>진행 중</span>
        </div>
      </div>
    </div>
  );
}

/* ========== TODO ITEM CARD ========== */

function TodoItemCard({ todo, onToggle, onDelete }: { todo: TodoItem; onToggle: () => void; onDelete: () => void }) {
  const config = DIFFICULTY_CONFIG[todo.difficulty];
  return (
    <div className="glass rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] group animate-fade-in-up"
      style={{
        opacity: todo.is_completed ? 0.6 : 1,
        borderLeft: todo.is_completed ? "3px solid rgba(52,211,153,0.4)"
          : `3px solid ${todo.difficulty === "Hard" ? "rgba(239,68,68,0.4)" : todo.difficulty === "Medium" ? "rgba(251,191,36,0.4)" : "rgba(52,211,153,0.4)"}`,
      }}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={todo.is_completed} onChange={onToggle} className="custom-checkbox mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium transition-all duration-200"
            style={{ color: todo.is_completed ? "var(--text-muted)" : "var(--text-primary)", textDecoration: todo.is_completed ? "line-through" : "none" }}>
            {todo.task}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`${config.className} px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1`}>
              {config.icon} {config.label}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Clock size={12} />{config.time}
            </span>
          </div>
        </div>
        <button onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer">
          <Trash2 size={16} style={{ color: "#ef4444" }} />
        </button>
      </div>
    </div>
  );
}

/* ========== PROGRESS PANEL ========== */

function ProgressPanel({ todos }: { todos: TodoItem[] }) {
  const total = todos.length;
  const completed = todos.filter((t) => t.is_completed).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circ = 2 * Math.PI * 54;
  const offset = circ - (pct / 100) * circ;
  const [anim, setAnim] = useState(circ);
  useEffect(() => { const t = setTimeout(() => setAnim(offset), 100); return () => clearTimeout(t); }, [offset]);

  return (
    <div className="glass rounded-xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">📊</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Progress Insights</h3>
      </div>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" strokeWidth="10" className="progress-ring-bg" />
            <circle cx="70" cy="70" r="54" fill="none" strokeWidth="10" strokeLinecap="round" className="progress-ring-fill"
              style={{ stroke: "url(#progressGradient)", strokeDasharray: circ, strokeDashoffset: anim }} />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-indigo)" />
                <stop offset="50%" stopColor="var(--accent-purple)" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{pct}%</span>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Completed</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Productivity Score</span>
        <span className="text-xs font-semibold" style={{ color: "#fb923c" }}>
          {pct >= 80 ? "Excellent" : pct >= 50 ? "Good" : total === 0 ? "No Tasks" : "Keep Going"}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--accent-indigo), var(--accent-purple), #fb923c)" }} />
      </div>
    </div>
  );
}

/* ========== FEATURE CARDS ========== */

function FeatureCards() {
  const features = [
    { icon: "🧠", title: "Smart Analysis", desc: "Gemini AI가 할 일의 복잡도를 즉시 파악합니다.", gradient: "rgba(108,92,231,0.1)" },
    { icon: "☁️", title: "Cloud Sync", desc: "Supabase를 통해 모든 기기에서 실시간 동기화 됩니다.", gradient: "rgba(168,85,247,0.1)" },
  ];
  return (
    <div className="space-y-3">
      {features.map((f) => (
        <div key={f.title} className="glass rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-default">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: f.gradient }}>{f.icon}</span>
            <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{f.title}</h4>
          </div>
          <p className="text-xs leading-relaxed ml-11" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
