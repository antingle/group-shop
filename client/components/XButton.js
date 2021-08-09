import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import useScheme from "../hooks/useScheme";
import AnimatedPressable from "./AnimatedPressable";

export default function XButton() {
  const navigation = useNavigation();
  const { colors } = useScheme();

  return (
    <AnimatedPressable onPress={() => navigation.goBack()}>
      <Feather name="x" style={{ fontSize: 36, color: colors.primary }} />
    </AnimatedPressable>
  );
}
