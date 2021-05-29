import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../colors.js";

export default function ListCard({ name }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardText}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 340,
    borderRadius: 24,
    backgroundColor: "white",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.dark,
  },
});
