import React from "react";
import { Image, StyleSheet, View } from "react-native";
import useScheme from "../hooks/useScheme";

export default function Logo({ size = 80, ...props }) {
  const { theme } = useScheme();
  const styles = StyleSheet.create({
    image: {
      height: size,
      width: size,
      resizeMode: "contain",
      //   marginRight: 20,
    },
  });
  {
    return (
      <View {...props}>
        {theme == "dark" ? (
          <Image
            source={require("../assets/shoppingcartdark.png")}
            style={styles.image}
          />
        ) : (
          <Image
            source={require("../assets/shoppingcartlight.png")}
            style={styles.image}
          />
        )}
      </View>
    );
  }
}
