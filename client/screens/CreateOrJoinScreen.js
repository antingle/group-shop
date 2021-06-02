import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../other/colors.js";
import useList from "../hooks/useList.js";
import Header from "../components/Header.js";

export default function CreateOrJoinScreen({ navigation }) {
  const { setCreatingList } = useList();
  const handleCreate = async () => {
    await setCreatingList(true);
    console.log("creating list...");
    navigation.navigate("nameList");
  };

  const handleJoin = async () => {
    await setCreatingList(true);
    console.log("joining list...");
    navigation.navigate("code");
  };

  return (
    <View style={styles.container}>
      <Header headerLeft={"settings"} />
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Group Shopping</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createText}>Create Grocery List</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or</Text>
        <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
          <Text style={styles.joinText}>Join Grocery List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
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
    color: colors.green,
  },
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderWidth: 2,
    borderRadius: 48,
    borderColor: colors.green,
    backgroundColor: colors.light,
  },
  joinButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 320,
    borderWidth: 2,
    borderRadius: 48,
    borderColor: colors.light,
    backgroundColor: colors.green,
  },
  createText: {
    fontSize: 22,
    color: colors.green,
    fontWeight: "500",
  },
  joinText: {
    fontSize: 22,
    color: colors.light,
    fontWeight: "500",
  },
  orText: {
    padding: 12,
    fontSize: 20,
    color: colors.dark,
    fontWeight: "500",
  },
});
