import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import useScheme from "../hooks/useScheme";

export default function Loading() {
  const { globalStyles } = useScheme();

  return <View style={globalStyles.container}>{<ActivityIndicator />}</View>;
}
