import { useEffect, useState } from "react";

export default function ThemeToggle({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className={`${theme === "dark" ? "bg-[#131024] text-white" : "bg-transparent text-slate-900"} min-h-screen transition-colors`}>
      <div className="mx-auto flex w-full max-w-md justify-end px-4 pt-4 sm:max-w-lg sm:px-6">
        <button
          onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          className="rounded-2xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-[#3101B9] shadow-sm"
        >
          {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
      {children}
    </div>
  );
}