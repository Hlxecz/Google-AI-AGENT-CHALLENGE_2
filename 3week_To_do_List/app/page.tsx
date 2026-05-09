"use client";

import { useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ToDoList from "@/components/ToDoList";
import FeaturesSection from "@/components/FeaturesSection";
import CodeShowcase from "@/components/CodeShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  const todoInputRef = useRef<HTMLInputElement>(null);

  const scrollToInput = () => {
    todoInputRef.current?.focus();
    todoInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection onInputFocus={scrollToInput} />
        <ToDoList inputRef={todoInputRef} />
        <FeaturesSection />
        <CodeShowcase />
      </main>
      <Footer />
    </>
  );
}
