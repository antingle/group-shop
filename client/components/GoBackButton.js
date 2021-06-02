import React from "react";
import { View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../other/colors";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";

export default function GoBackButton({ marginTop = 0 }) {
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    icon: {
      fontSize: 30,
      color: colors.green,
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
