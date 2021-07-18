import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();

export const colors =
  colorScheme == "light"
    ? {
        // light mode
        primary: "#32C36E",
        primaryShade: "#5effa2",
        secondary: "#435058",
        background: "#EDF7F6",
        foreground: "#fff",
        text: "#435058",
        caption: "#636366",
        caption2: "#ababab",
        destructive: "#ff3b30",
        lightButton: "#e1e6eb",
        theme: "#EDF7F6",
        light: "#EDF7F6",
        dark: "#2c2c2e",
      }
    : {
        // dark mode
        primary: "#32C36E",
        primaryShade: "#5effa2",
        secondary: "#839189",
        background: "#1c1c1e",
        foreground: "#2c2c2e",
        text: "#EDF7F6",
        caption: "#ababab",
        caption2: "#636366",
        destructive: "#ff3b30",
        lightButton: "#3a3a3c",
        theme: "#2c2c2e",
        light: "#EDF7F6",
        dark: "#2c2c2e",
      };

// other red: #990A32
