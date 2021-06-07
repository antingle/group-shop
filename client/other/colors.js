import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();

export const colors =
  colorScheme == "light"
    ? {
        // light mode
        primary: "#32C36E",
        secondary: "#435058",
        background: "#EDF7F6",
        foreground: "#fff",
        text: "#435058",
        caption: "#636366",
        caption2: "#ababab",
        destructive: "#ff3b30",
      }
    : {
        // dark mode
        primary: "#32C36E",
        secondary: "#839189",
        background: "#1c1c1e",
        foreground: "#2c2c2e",
        text: "#EDF7F6",
        caption: "#ababab",
        caption2: "#636366",
        destructive: "#ff3b30",
      };

// other red: #990A32
