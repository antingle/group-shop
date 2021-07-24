import React, { createContext } from "react";
import {
  Appearance,
  Dimensions,
  StyleSheet,
  useColorScheme,
} from "react-native";

export const SchemeContext = createContext();

export const SchemeProvider = ({ children }) => {
  let theme = useColorScheme();

  const colors =
    theme == "light"
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonsContainer: {
      flex: 1,
      alignItems: "center",
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      textAlign: "center",
      fontSize: 64,
      fontWeight: "900",
      color: colors.theme,
    },
    title: {
      textAlign: "center",
      fontSize: 40,
      fontWeight: "900",
      color: colors.theme,
      marginBottom: 20,
    },
    startButton: {
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: 40,
      height: 60,
      width: 320,
      borderRadius: 48,
      backgroundColor: colors.theme,
    },
    startText: {
      fontSize: 22,
      color: colors.primary,
      fontWeight: "500",
    },
    gradient: {
      height: Dimensions.get("screen").height,
      width: Dimensions.get("screen").width,
      position: "absolute",
    },
    image: {
      height: 240,
      resizeMode: "contain",
      marginVertical: 90,
      marginRight: 20,
    },
  });

  return (
    <SchemeContext.Provider value={{ colors, styles, theme }}>
      {children}
    </SchemeContext.Provider>
  );
};
