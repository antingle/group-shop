import React, { createContext } from "react";
import { StyleSheet, useColorScheme } from "react-native";

export const SchemeContext = createContext();

export const SchemeProvider = ({ children }) => {
  let theme = useColorScheme();

  const colors =
    theme == "light"
      ? {
          // light mode
          primary: "#32D274",
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
          primary: "#32D274",
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

  const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    containerTop: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      textAlign: "center",
    },
    title: {
      textAlign: "center",
      fontSize: 40,
      fontWeight: "900",
      color: colors.primary,
      marginBottom: 20,
    },
    heading: {
      fontSize: 32,
      fontWeight: "800",
      color: colors.primary,
      marginTop: 100,
    },
    nameInput: {
      fontSize: 24,
      paddingTop: 80,
      paddingBottom: 300,
      color: colors.text,
      textAlign: "center",
    },
    caption: {
      color: colors.caption,
      maxWidth: 340,
      textAlign: "center",
    },
    inputLabel: {
      fontSize: 28,
      fontWeight: "800",
      width: 280,
      marginTop: 40,
      color: colors.primary,
    },
    textInput: {
      fontSize: 24,
      marginTop: 20,
      width: 280,
      color: colors.text,
      textAlign: "left",
    },
    errorText: {
      color: colors.destructive,
      fontSize: 16,
    },
  });

  return (
    <SchemeContext.Provider value={{ colors, globalStyles, theme }}>
      {children}
    </SchemeContext.Provider>
  );
};
