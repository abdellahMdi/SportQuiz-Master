import { useState } from "react";

export default function ThemeToggle({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className={theme}>
      <button onClick={toggleTheme} className="btn btn-secondary mb-3">
        Toggle Theme
      </button>

      {children}
    </div>
  );
}