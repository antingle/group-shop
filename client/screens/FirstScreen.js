import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { colors } from "../other/colors.js";

export default function FirstScreen({ navigation }) {
  const handleCreate = () => {
    navigation.navigate("createAccount");
  };

  const handleSignIn = () => {
    navigation.navigate("signIn");
  };

  const handleGuest = () => {
    navigation.navigate("name");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.foreground, colors.background]}
        style={styles.gradient}
      />
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Group</Text>
        <Text style={styles.logo}>Shop</Text>
      </View>

      {/* <Image source={require('../assets/shoppingcart.svg')} style={styles.image}/> */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or</Text>
        <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    textAlign: "center",
    fontSize: 64,
    fontWeight: "900",
    color: colors.primary,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 20,
  },
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderRadius: 48,
    marginBottom: 8,
    backgroundColor: colors.primary,
  },
  signInButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderWidth: 3,
    borderRadius: 48,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  guestButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderRadius: 48,
    backgroundColor: colors.secondary,
  },
  createText: {
    fontSize: 22,
    color: colors.foreground,
    fontWeight: "500",
  },
  signInText: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: "500",
  },
  orText: {
    padding: 24,
    fontSize: 20,
    color: colors.primary,
    fontWeight: "500",
  },
  guestText: {
    fontSize: 20,
    color: colors.foreground,
    fontWeight: "500",
  },
  gradient: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    position: "absolute",
    opacity: 0.5,
  },
  image: {
    height: 180,
    resizeMode: "contain",
  },
});
