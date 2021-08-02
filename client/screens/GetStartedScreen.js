import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import LongButton from "../components/LongButton";
import useScheme from "../hooks/useScheme";

export default function GetStartedScreen({ navigation }) {
  const { theme, colors } = useScheme();

  // styles
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
      fontSize: 32,
      fontWeight: "400",
      color: colors.theme,
      marginBottom: 50,
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

  return (
    <View style={styles.container}>
      {/* <LinearGradient
        colors={[colors.primaryShade, colors.primary]}
        style={styles.gradient}
      /> */}
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
      <LongButton
        text="Get Started"
        onPressOut={() => navigation.navigate("firstScreen")}
        textColor={colors.primary}
        backgroundColor={colors.theme}
        marginBottom={0}
      />
    </View>
  );
}
