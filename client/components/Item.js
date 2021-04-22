import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { colors } from "../colors.js";

export default function Item({ name, isChecked }) {
  return (
    <View style={styles.card}>
      <BouncyCheckbox
        text={name}
        fillColor={colors.green}
        iconStyle={{ borderColor: colors.green }}
        onPress={(isChecked) => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    width: 340,
    borderRadius: 24,
    paddingLeft: 20,
    backgroundColor: "white",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.dark,
  },
});
