import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../other/colors.js";

export default function ListCard({ id, name, members, navigation }) {
  const handlePress = () => {
    navigation.navigate("groceryList", { listID: id });
  };

  const renderMembers = () => {
    let renderedMembers = "Members: ";
    for (let i = 0; i < members.length; i++) {
      renderedMembers += members[i].screen_name;
      if (i < members.length - 1) renderedMembers += ", ";
    }
    return renderedMembers;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={styles.cardText}>{name}</Text>
      <Text style={styles.membersText}>{renderMembers()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    width: 340,
    borderRadius: 24,
    backgroundColor: "white",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 16,
  },
  membersText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray,
  },
});
