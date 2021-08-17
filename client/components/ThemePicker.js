import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import useScheme from "../hooks/useScheme";

export default function ThemePicker() {
  const { colors, setThemeSetting, themeSetting } = useScheme();
  const selector = useRef();
  const translateX = useRef(new Animated.Value(0)).current;
  const xValues = useRef({}).current;

  useEffect(() => {
    setTimeout(() => {
      animateToTheme(themeSetting, 100);
    }, 50); // Hacky way of doing it?
  }, []);

  const handlePress = (theme) => {
    animateToTheme(theme);
    setThemeSetting(theme);
  };

  const animateToTheme = (theme, speed = 14) => {
    let value = 0;

    if (theme == "auto") value = xValues.auto;
    else if (theme == "light") value = xValues.light;
    else if (theme == "dark") value = xValues.dark;
    else return;
    Animated.spring(translateX, {
      useNativeDriver: true,
      toValue: value + (xValues.light - xValues.dark) / 2 - 3,
      speed,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.foreground,
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      marginBottom: 12,
      padding: 12,
      borderRadius: 24,
    },
    selection: {
      zIndex: 10,
    },
    selector: {
      backgroundColor: colors.primary,
      width: 85,
      position: "absolute",
      height: 36,
      borderRadius: 24,
    },
    fieldText: {
      fontSize: 20,
      fontWeight: "500",
      color: colors.primary,
      marginLeft: 6,
    },
    items: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "space-around",
      marginHorizontal: 5,
      backgroundColor: colors.background,
      height: 32,
      borderRadius: 24,
    },
    selectText: {
      color: colors.caption,
      fontSize: 18,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.fieldText}>Theme: </Text>
      <View style={styles.items}>
        <Animated.View
          style={styles.selector}
          ref={selector}
          style={[styles.selector, { transform: [{ translateX }] }]}
        />
        <Pressable
          style={styles.selection}
          hitSlop={10}
          onPress={() => handlePress("auto")}
          onLayout={(e) => (xValues.auto = e.nativeEvent.layout.x)}
        >
          <Text
            style={[
              styles.selectText,
              themeSetting == "auto"
                ? { color: colors.foreground }
                : { color: colors.caption },
            ]}
          >
            Auto
          </Text>
        </Pressable>
        <Pressable
          style={styles.selection}
          hitSlop={10}
          onPress={() => handlePress("light")}
          onLayout={(e) => (xValues.light = e.nativeEvent.layout.x)}
        >
          <Text
            style={[
              styles.selectText,
              themeSetting == "light"
                ? { color: colors.foreground }
                : { color: colors.caption },
            ]}
          >
            Light
          </Text>
        </Pressable>
        <Pressable
          style={styles.selection}
          hitSlop={10}
          onPress={() => handlePress("dark")}
          onLayout={(e) => (xValues.dark = e.nativeEvent.layout.x)}
        >
          <Text
            style={[
              styles.selectText,
              themeSetting == "dark"
                ? { color: colors.foreground }
                : { color: colors.caption },
            ]}
          >
            Dark
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
