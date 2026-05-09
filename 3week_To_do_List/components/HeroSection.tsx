"use client";

import { Sparkles } from "lucide-react";

interface HeroSectionProps {
  onInputFocus: () => void;
}

export default function HeroSection({ onInputFocus }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="hero-bg relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Main Heading */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up"
          style={{ color: "var(--text-primary)" }}
        >
          당신의 하루를{" "}
          <span className="gradient-text">AI로 설계</span>하세요
        </h1>

        {/* Subheading */}
        <p
          className="text-base sm:text-lg leading-relaxed mb-12 max-w-xl mx-auto animate-fade-in-up"
          style={{ color: "var(--text-secondary)", animationDelay: "150ms" }}
        >
          단순한 할 일 목록을 넘어, AI가 작업의 난이도를 분석하고 효율적인
          일정을 제안합니다.
        </p>

        {/* Hero Input */}
        <div
          className="glass-strong rounded-2xl p-2 max-w-2xl mx-auto flex items-center gap-2 animate-fade-in-up animate-pulse-glow"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex-1 flex items-center gap-3 px-4">
            <Sparkles
              size={20}
              style={{ color: "var(--accent-indigo)", flexShrink: 0 }}
            />
            <input
              type="text"
              placeholder="새로운 할 일을 입력하세요... (예: 분기별 마케팅 보고서 작성)"
              className="w-full bg-transparent border-none outline-none text-sm sm:text-base py-3"
              style={{
                color: "var(--text-primary)",
                caretColor: "var(--accent-indigo)",
              }}
              onFocus={onInputFocus}
              readOnly
            />
          </div>
          <button
            onClick={onInputFocus}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-pointer flex-shrink-0"
            style={{
              background: "var(--gradient-button)",
              color: "white",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Sparkles size={16} />
            AI 분석 추가
          </button>
        </div>
      </div>

      {/* Decorative gradient circles */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full animate-float"
        style={{
          background:
            "radial-gradient(circle, rgba(108,92,231,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full animate-float"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "3s",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
