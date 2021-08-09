import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import useScheme from "../hooks/useScheme";
import AnimatedPressable from "./AnimatedPressable";

export default function GoBackButton({ navigate = "back" }) {
  const navigation = useNavigation();
  const { colors } = useScheme();

  const handlePress = () => {
    if (navigate == "back") navigation.goBack();
    else if (navigate == "lists") navigation.navigate("lists");
  };

  return (
    <AnimatedPressable onPress={handlePress}>
      <Entypo
        name="chevron-left"
        style={{ fontSize: 30, color: colors.primary }}
      />
    </AnimatedPressable>
  );
}
