import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../other/colors";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";

export default function XButton({ marginTop = 0 }) {
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    icon: {
      fontSize: 36,
      color: colors.primary,
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
        onPress={() => navigation.goBack()}
        underlayColor={colors.background}
        style={styles.container}
      >
        <View style={styles.container}>
          <Feather name="x" style={styles.icon} />
        </View>
      </TouchableHighlight>
    </View>
  );
}
