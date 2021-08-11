import React from "react";
import { StyleSheet, Image } from "react-native";

export default function EmptyList() {
  const styles = StyleSheet.create({
    emptyImage: {
      height: 300,
      width: 300,
      resizeMode: "contain",
      flex: 1,
      marginTop: 150,
      marginBottom: 250,
    },
  });
  return (
    <Image
      source={require("../assets/emptylists.png")}
      style={styles.emptyImage}
    />
  );
}
