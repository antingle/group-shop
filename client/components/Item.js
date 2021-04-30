import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { colors } from "../colors.js";

export default function Item({ name, onPress, purchased }) {
  const checkboxRef = React.useRef();

  const handlePress = async () => {
    await onPress();
  };

  return (
    <TouchableHighlight
      style={styles.touchable}
      underlayColor={colors.green}
      activeOpacity={0.6}
      onPress={handlePress}
    >
      <View style={styles.card}>
        <BouncyCheckbox
          text={name}
          fillColor={colors.green}
          iconStyle={{ borderColor: colors.green }}
          isChecked={purchased}
          disabled={true}
          ref={checkboxRef}
        />
      </View>
    </TouchableHighlight>
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
  },
  touchable: {
    borderRadius: 24,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.dark,
  },
});
