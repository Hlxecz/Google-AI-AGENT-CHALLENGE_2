import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hlxecz To-Do | AI로 설계하는 당신의 하루",
  description:
    "단순한 할 일 목록을 넘어, AI가 작업의 난이도를 분석하고 효율적인 일정을 제안합니다. Gemini AI와 Supabase로 구동됩니다.",
  keywords: ["to-do", "AI", "Gemini", "productivity", "할일관리", "생산성"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
