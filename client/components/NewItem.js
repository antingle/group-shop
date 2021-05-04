import React from "react";
import { View, StyleSheet, TouchableHighlight, TextInput } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { colors } from "../colors.js";

export default function Item({ onChangeAdd, onAdd }) {
  const checkboxRef = React.useRef();

  return (
    <TouchableHighlight style={styles.touchable}>
      <View style={styles.card}>
        <BouncyCheckbox
          text=""
          fillColor={colors.green}
          iconStyle={{ borderColor: colors.green }}
          isChecked={false}
          disabled={true}
          ref={checkboxRef}
        />
        <TextInput
          style={styles.textInput}
          autoFocus={true}
          onChangeText={onChangeAdd}
          onEndEditing={onAdd}
          returnKeyType="done"
          autoCorrect={false}
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
  textInput: {
    color: "#757575",
    fontSize: 16,
  },
});
