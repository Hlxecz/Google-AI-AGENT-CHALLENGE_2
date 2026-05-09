export default function Footer() {
  const links = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Feedback", href: "#" },
  ];

  return (
    <footer
      className="mt-auto border-t"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Hlxecz{" "}
            </span>
            <span className="text-sm font-bold gradient-text">To-Do</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs transition-colors duration-200 hover:text-white"
                style={{ color: "var(--text-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 Hlxecz To-Do.{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              Engineered for focus.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
