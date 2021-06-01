import React from "react";
import { View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../other/colors";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function GoBackButton({ onPress }) {
  return (
    <View style={styles.absolute}>
      <TouchableHighlight
        onPress={onPress}
        underlayColor={colors.light}
        style={styles.container}
      >
        <View style={styles.container}>
          <Entypo name="chevron-left" style={styles.icon} />
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
    top: 70,
  },
  container: {
    backgroundColor: "transparent",
    borderRadius: 12,
  },
});
