import React from "react";
import { View, StyleSheet, TouchableHighlight, TextInput } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { colors } from "../other/colors.js";

export default function Item({ onChangeAdd, onAdd }) {
  const checkboxRef = React.useRef();

  return (
    <TouchableHighlight style={styles.touchable}>
      <View style={styles.card}>
        <BouncyCheckbox
          text=""
          fillColor={colors.primary}
          iconStyle={{ borderColor: colors.primary }}
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
    height: 50,
    width: 340,
    borderRadius: 24,
    paddingLeft: 20,
    backgroundColor: colors.foreground,
  },
  touchable: {
    borderRadius: 24,
    marginBottom: 8,
  },
  textInput: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "400",
    color: colors.text,
  },
});
