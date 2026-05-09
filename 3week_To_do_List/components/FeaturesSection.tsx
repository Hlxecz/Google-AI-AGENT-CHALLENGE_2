import { Brain, Cloud, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Analysis",
    description: "Gemini AI가 할 일의 복잡도를 즉시 파악합니다.",
    gradient: "linear-gradient(135deg, #6c5ce7, #7c3aed)",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Supabase를 통해 모든 기기에서 실시간으로 동기화됩니다.",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
  },
  {
    icon: BarChart3,
    title: "Progress Insights",
    description: "당신의 생산성 데이터를 시각화된 차트로 확인하세요.",
    gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Powered by{" "}
            <span className="gradient-text">Modern Tech Stack</span>
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            최신 기술로 구동되는 스마트한 할 일 관리 시스템
          </p>
        </div>

        {/* 3x1 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass rounded-2xl p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-lg group"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: feature.gradient }}
                >
                  <Icon size={24} color="white" />
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
