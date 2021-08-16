import React from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";
import useScheme from "../hooks/useScheme";

export default function EmptyList() {
  const { globalStyles } = useScheme();
  const styles = StyleSheet.create({
    emptyImage: {
      height: 300,
      width: 300,
      resizeMode: "contain",
    },
  });
  return (
    <View style={[globalStyles.container, { marginVertical: "10%" }]}>
      <Image
        source={require("../assets/emptylists.png")}
        style={styles.emptyImage}
      />
    </View>
  );
}
