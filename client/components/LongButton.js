import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";

export default function LongButton({
  text,
  onPressOut,
  backgroundColor,
  borderColor = backgroundColor,
  textColor,
  marginTop = 0,
}) {
  const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      width: 320,
      borderWidth: 2,
      borderRadius: 48,
      marginTop: marginTop,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
    },
    buttonTouchable: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    buttonText: {
      fontSize: 22,
      color: textColor,
      fontWeight: "500",
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
        styles.buttonContainer,
      ]}
      onPressOut={onPressOut}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}
