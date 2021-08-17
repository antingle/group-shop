import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import useScheme from "../hooks/useScheme";

export default function TwoPicker({ onPressLeft, onPressRight }) {
  const { colors } = useScheme();
  const translateX = useRef(new Animated.Value(-45)).current;
  const xValues = useRef({}).current;
  const [selected, setSelected] = React.useState("left");

  useEffect(() => {
    setTimeout(() => animateTo("left", 50), 100);
  }, []);

  const handlePress = (item) => {
    animateTo(item);
    if (item == "left") onPressLeft();
    else onPressRight();
  };

  const animateTo = (item, speed = 14) => {
    let value = 0;
    setSelected(item);

    if (item == "left") value = xValues.left + 67;
    else if (item == "right") value = xValues.right + 60;

    Animated.spring(translateX, {
      useNativeDriver: true,
      toValue: value - 160,
      speed,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: "3%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 24,
      width: 320,
    },
    selection: {
      zIndex: 10,
    },
    selector: {
      backgroundColor: colors.primary,
      width: 170,
      position: "absolute",
      height: 45,
      borderRadius: 24,
    },
    items: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "space-around",
      backgroundColor: colors.background,
      height: 45,
      borderRadius: 24,
    },
    selectText: {
      color: colors.caption,
      fontSize: 20,
      fontFamily: "Avenir-Heavy",
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.items}>
        <Animated.View
          style={styles.selector}
          style={[styles.selector, { transform: [{ translateX }] }]}
        />
        <Pressable
          style={styles.selection}
          hitSlop={10}
          onLayout={(e) => (xValues.left = e.nativeEvent.layout.x)}
          onPress={() => handlePress("left")}
        >
          <Text
            style={[
              styles.selectText,
              selected == "left"
                ? { color: colors.foreground }
                : { color: colors.caption },
            ]}
          >
            Sign Up
          </Text>
        </Pressable>
        <Pressable
          style={styles.selection}
          hitSlop={10}
          onLayout={(e) => (xValues.right = e.nativeEvent.layout.x)}
          onPress={() => handlePress("right")}
        >
          <Text
            style={[
              styles.selectText,
              selected == "right"
                ? { color: colors.foreground }
                : { color: colors.caption },
            ]}
          >
            Sign In
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
