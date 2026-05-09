export default function CodeShowcase() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="code-block">
          {/* Header */}
          <div className="code-block-header">
            <div className="code-dot code-dot-red" />
            <div className="code-dot code-dot-yellow" />
            <div className="code-dot code-dot-green" />
            <span
              className="text-xs ml-2 font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              architecture.ts
            </span>
          </div>

          {/* Code content */}
          <div className="p-6 overflow-x-auto">
            <pre
              className="text-sm leading-7 font-mono"
              style={{ color: "var(--text-secondary)" }}
            >
              <code>
                <span style={{ color: "#c792ea" }}>import</span>
                {" { "}
                <span style={{ color: "#82aaff" }}>createClient</span>
                {" } "}
                <span style={{ color: "#c792ea" }}>from</span>{" "}
                <span style={{ color: "#c3e88d" }}>
                  {`'@supabase/supabase-js'`}
                </span>
                ;{"\n"}
                <span style={{ color: "#c792ea" }}>import</span>
                {" { "}
                <span style={{ color: "#82aaff" }}>GoogleGenerativeAI</span>
                {" } "}
                <span style={{ color: "#c792ea" }}>from</span>{" "}
                <span style={{ color: "#c3e88d" }}>
                  {`'@google/generative-ai'`}
                </span>
                ;{"\n\n"}
                <span style={{ color: "#546e7a" }}>
                  {"// Database Schema (Supabase)"}
                </span>
                {"\n"}
                <span style={{ color: "#c792ea" }}>interface</span>{" "}
                <span style={{ color: "#ffcb6b" }}>Todo</span>
                {" {\n"}
                {"  id: "}
                <span style={{ color: "#82aaff" }}>uuid</span>
                {";\n"}
                {"  user_id: "}
                <span style={{ color: "#82aaff" }}>uuid</span>
                {";\n"}
                {"  task: "}
                <span style={{ color: "#82aaff" }}>text</span>
                {";\n"}
                {"  difficulty: "}
                <span style={{ color: "#c3e88d" }}>{`'Easy'`}</span>
                {" | "}
                <span style={{ color: "#c3e88d" }}>{`'Medium'`}</span>
                {" | "}
                <span style={{ color: "#c3e88d" }}>{`'Hard'`}</span>
                {";\n"}
                {"  is_completed: "}
                <span style={{ color: "#82aaff" }}>boolean</span>
                {";\n"}
                {"}\n\n"}
                <span style={{ color: "#546e7a" }}>
                  {"// Gemini AI Difficulty Analysis"}
                </span>
                {"\n"}
                <span style={{ color: "#c792ea" }}>async function</span>{" "}
                <span style={{ color: "#82aaff" }}>
                  analyzeTaskDifficulty
                </span>
                {"("}
                <span style={{ color: "#f78c6c" }}>task</span>
                {": string) {\n"}
                {"  "}
                <span style={{ color: "#c792ea" }}>const</span>
                {" genAI = "}
                <span style={{ color: "#c792ea" }}>new</span>
                {" "}
                <span style={{ color: "#ffcb6b" }}>GoogleGenerativeAI</span>
                {"(process.env.GEMINI_API_KEY);\n"}
                {"  "}
                <span style={{ color: "#c792ea" }}>const</span>
                {" model = genAI.getGenerativeModel({ model: "}
                <span style={{ color: "#c3e88d" }}>
                  {`"gemini-pro"`}
                </span>
                {" });\n\n"}
                {"  "}
                <span style={{ color: "#c792ea" }}>const</span>
                {" prompt = "}
                <span style={{ color: "#c3e88d" }}>
                  {`\`Analyze the complexity of this task and categorize it as Easy, Medium, or Hard: "\${task}"\``}
                </span>
                {";\n"}
                {"  "}
                <span style={{ color: "#c792ea" }}>const</span>
                {" result = "}
                <span style={{ color: "#c792ea" }}>await</span>
                {" model.generateContent(prompt);\n\n"}
                {"  "}
                <span style={{ color: "#c792ea" }}>return</span>
                {" result.response.text();\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
