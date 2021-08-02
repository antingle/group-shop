import React from "react";
import { View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import useScheme from "../hooks/useScheme";

export default function GoBackButton({ marginTop = 0, navigate = "back" }) {
  const navigation = useNavigation();
  const { colors } = useScheme();

  // styles
  const styles = StyleSheet.create({
    icon: {
      fontSize: 30,
      color: colors.primary,
    },
    container: {
      marginTop: marginTop,
      backgroundColor: "transparent",
      borderRadius: 12,
    },
  });

  const handlePress = () => {
    if (navigate == "back") navigation.goBack();
    else if (navigate == "lists") navigation.navigate("lists");
  };

  return (
    <View>
      <TouchableHighlight
        onPress={handlePress}
        underlayColor={colors.background}
        style={styles.container}
      >
        <View style={styles.container}>
          <Entypo name="chevron-left" style={styles.icon} />
        </View>
      </TouchableHighlight>
    </View>
  );
}
