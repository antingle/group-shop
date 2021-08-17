import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
} from "react-native";
import useScheme from "../hooks/useScheme";
import AnimatedPressable from "./AnimatedPressable";

export default function LongButton({
  text,
  onPress,
  backgroundColor,
  borderColor = backgroundColor,
  textColor,
  marginTop = 0,
  loading = false,
  ...props
}) {
  const { globalStyles } = useScheme();
  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
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
      fontSize: 24,
      color: textColor,
      fontFamily: "Avenir-Heavy",
    },
  });

  return (
    <AnimatedPressable onPress={onPress} disabled={loading} {...props}>
      <View style={[styles.buttonContainer, globalStyles.shadow]}>
        {!loading ? (
          <Text style={styles.buttonText}>{text}</Text>
        ) : (
          <ActivityIndicator color={textColor} style={{ marginLeft: 12 }} />
        )}
      </View>
    </AnimatedPressable>
  );
}
