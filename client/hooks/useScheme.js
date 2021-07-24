import { useContext } from "react";
import { SchemeContext } from "../contexts/SchemeContext";

export default function useScheme() {
  const context = useContext(SchemeContext);

  if (!context) {
    throw new Error("useTheme must be used within the ThemeProvider");
  }

  return context;
}
