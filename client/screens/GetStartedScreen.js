import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  useColorScheme,
} from "react-native";
import { colors } from "../other/colors.js";

export default function GetStartedScreen({ navigation }) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryShade]}
        style={styles.gradient}
      />
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.logo}>Group</Text>
        <Text style={styles.logo}>Shop</Text>
      </View>
      {colorScheme == "dark" ? (
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
        style={styles.createButton}
        onPress={() => navigation.navigate("firstScreen")}
      >
        <Text style={styles.createText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderRadius: 48,
    marginBottom: 8,
    backgroundColor: colors.theme,
  },
  createText: {
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
