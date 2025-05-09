import { create } from "zustand";

// Define the theme state interface
interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the Zustand store
export const useThemeStore = create<ThemeState>((set) => {
  // Safely access localStorage
  let storedTheme: string | null = null;
  try {
    storedTheme = localStorage.getItem("theme");
  } catch (e) {
    console.warn("localStorage not available:", e);
  }

  // Initialize based on stored theme or system preference
  const initialMode =
    storedTheme === "dark" ||
    (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Apply initial theme to <html>
  document.documentElement.classList.toggle("dark", initialMode);

  return {
    darkMode: initialMode,
    toggleDarkMode: () => {
      set((state) => {
        const newMode = !state.darkMode;
        // Save theme to localStorage
        try {
          localStorage.setItem("theme", newMode ? "dark" : "light");
        } catch (e) {
          console.warn("Failed to save theme to localStorage:", e);
        }

        // Toggle dark class on <html>
        document.documentElement.classList.toggle("dark", newMode);
        return { darkMode: newMode };
      });
    },
  };
});