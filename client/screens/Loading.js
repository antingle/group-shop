import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Loading() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return <View style={styles.container}>{/* <ActivityIndicator /> */}</View>;
}
