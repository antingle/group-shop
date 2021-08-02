import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import useScheme from "../hooks/useScheme.js";

export default function FirstScreen({ navigation }) {
  const { colors, globalStyles } = useScheme();
  const handleCreate = () => {
    navigation.navigate("createAccount");
  };

  const handleSignIn = () => {
    navigation.navigate("signIn");
  };

  const handleGuest = () => {
    navigation.navigate("name");
  };

  // styles
  const styles = StyleSheet.create({
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
      color: colors.theme,
    },
    logoBack: {
      backgroundColor: colors.primary,
      borderRadius: 48,
      width: 320,
      paddingVertical: 40,
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
      color: colors.caption,
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
  });

  return (
    <View style={globalStyles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoBack}>
          <Text style={styles.logo}>Group</Text>
          <Text style={styles.logo}>Shop</Text>
        </View>
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
