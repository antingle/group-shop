import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
        colors={["#5ad48d", colors.primary]}
        style={styles.gradient}
      />
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.logo}>Group Shopping</Text>
      </View>
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
    backgroundColor: colors.primary,
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
    color: colors.text,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 24,
  },
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderRadius: 48,
    marginBottom: 8,
    backgroundColor: colors.text,
  },
  signInButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderWidth: 3,
    borderRadius: 48,
    borderColor: colors.text,
    backgroundColor: "transparent",
  },
  guestButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderRadius: 48,
    backgroundColor: colors.foreground,
  },
  createText: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: "500",
  },
  signInText: {
    fontSize: 22,
    color: colors.text,
    fontWeight: "500",
  },
  orText: {
    padding: 24,
    fontSize: 20,
    color: colors.text,
    fontWeight: "500",
  },
  guestText: {
    fontSize: 22,
    color: colors.text,
    fontWeight: "500",
  },
  gradient: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    position: "absolute",
  },
});
