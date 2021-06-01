import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../other/colors.js";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth.js";

export default function ListCard({ id, name, members, navigation }) {
  const { authData } = useAuth();
  const handlePress = () => {
    navigation.navigate("groceryList", { listID: id });
  };

  const renderMembers = () => {
    let renderedMembers = "";
    for (let i = 0; i < members.length; i++) {
      if (members[i].screen_name == authData.screen_name)
        renderedMembers += "Me";
      else renderedMembers += members[i].screen_name;
      if (i < members.length - 1) renderedMembers += ", ";
    }
    return renderedMembers;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={styles.cardText}>{name}</Text>
      <View style={styles.members}>
        <Ionicons name="person" style={styles.icon} />
        <Text style={styles.membersText}>{renderMembers()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 340,
    borderRadius: 24,
    backgroundColor: "white",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 16,
  },
  members: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  icon: {
    color: colors.gray,
    marginRight: 6,
  },
  membersText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray,
  },
});
