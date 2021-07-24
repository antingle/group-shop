import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import useScheme from "../hooks/useScheme";

export default function GetStartedScreen({ navigation }) {
  const { theme, colors, styles } = useScheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryShade, colors.primary]}
        style={styles.gradient}
      />
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.logo}>Group</Text>
        <Text style={styles.logo}>Shop</Text>
      </View>
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
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("firstScreen")}
      >
        <Text style={styles.startText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
