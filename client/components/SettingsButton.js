import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import useScheme from "../hooks/useScheme";
import AnimatedPressable from "./AnimatedPressable";

export default function SettingsButton({ screen = "settings" }) {
  const navigation = useNavigation();
  const { colors } = useScheme();

  return (
    <AnimatedPressable onPress={() => navigation.navigate(screen)}>
      <Ionicons
        name="settings"
        style={{ fontSize: 30, color: colors.primary }}
      />
    </AnimatedPressable>
  );
}
