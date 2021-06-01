import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../other/colors";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";

export default function SettingsButton({}) {
  const navigation = useNavigation();
  return (
    <View style={styles.absolute}>
      <TouchableHighlight
        onPress={() => navigation.navigate("settings")}
        underlayColor={colors.light}
        style={styles.container}
      >
        <View style={styles.container}>
          <Ionicons name="settings" style={styles.icon} />
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 30,
    color: colors.green,
  },
  absolute: {
    position: "absolute",
    left: 40,
    top: 75,
  },
  container: {
    backgroundColor: "transparent",
    borderRadius: 12,
  },
});
