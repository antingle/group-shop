import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import useScheme from "../hooks/useScheme";

export default function SettingsButton({ screen = "settings", marginTop = 0 }) {
  const navigation = useNavigation();
  const { colors } = useScheme();

  // styles
  const styles = StyleSheet.create({
    icon: {
      fontSize: 30,
      color: colors.primary,
    },
    absolute: {
      position: "absolute",
      left: 40,
      top: 75,
    },
    container: {
      marginTop: marginTop,
      backgroundColor: "transparent",
      borderRadius: 12,
    },
  });

  return (
    <View>
      <TouchableHighlight
        onPress={() => navigation.navigate(screen)}
        underlayColor={colors.background}
        style={styles.container}
      >
        <View style={styles.container}>
          <Ionicons name="settings" style={styles.icon} />
        </View>
      </TouchableHighlight>
    </View>
  );
}
