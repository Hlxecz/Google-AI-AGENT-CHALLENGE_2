"use client";

import { useState } from "react";
import { Plus, User } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "#", active: true },
  { label: "Tasks", href: "#tasks" },
  { label: "Analytics", href: "#insights" },
  { label: "Settings", href: "#" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-1 group">
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Hlxecz{" "}
            </span>
            <span className="text-xl font-bold gradient-text">To-Do</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  color: link.active
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  background: link.active
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                  textDecoration: link.active ? "underline" : "none",
                  textUnderlineOffset: "6px",
                  textDecorationColor: link.active
                    ? "var(--accent-indigo)"
                    : "transparent",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="#tasks"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--gradient-button)",
                color: "white",
              }}
            >
              <Plus size={16} />
              New Task
            </a>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              aria-label="User profile"
            >
              <User size={16} style={{ color: "var(--text-secondary)" }} />
            </button>

            {/* Mobile toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: "var(--text-secondary)" }}
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/5 mt-2 pt-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  color: link.active
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  background: link.active
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
