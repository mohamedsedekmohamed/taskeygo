import { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  mainColor: string;
  setMainColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  mainColor: "#5A8DEE", // اللون الافتراضي
  setMainColor: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  const [mainColor, setMainColorState] = useState<string>(
    localStorage.getItem("mainColor") || "#5A8DEE"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--color-maincolor", mainColor);
    localStorage.setItem("mainColor", mainColor);
  }, [mainColor]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const setMainColor = (color: string) => setMainColorState(color);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mainColor, setMainColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
